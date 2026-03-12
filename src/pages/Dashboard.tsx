import { useEffect, useState, useRef } from "react";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { fetchPodcastsByInterest } from "@/lib/youtube";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Search, LogOut, Settings, RefreshCw, ArrowUpRight, Heart, ChevronDown } from "lucide-react";

/* ════ MINI NAVBAR ════ */
const NavBar = ({ username, onLogout, onResetTopics }: { username: string; onLogout: () => void; onResetTopics: () => void }) => {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-6 pb-4 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1600px] mx-auto px-8 md:px-12 flex items-start justify-between">
        <Link to="/" className="flex items-center gap-3">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="font-sans font-medium text-lg tracking-tight text-white">PodStream</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Home", to: "/dashboard" },
          ].map(({ label, to }) => (
            <Link key={to} to={to} className={`text-[14px] tracking-tight transition-colors ${pathname === to ? 'text-white font-medium underline underline-offset-4' : 'text-white/50 hover:text-white font-normal'}`}>
              {label}
            </Link>
          ))}
        </nav>
        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(p => !p)}
            className="flex items-center gap-3 text-[14px] text-white/60 hover:text-white transition-colors"
          >
            <div className="w-8 h-8 border border-white/20 flex items-center justify-center text-[12px] font-medium text-white bg-white/5">
              {username?.[0]?.toUpperCase() || "P"}
            </div>
            <ChevronDown size={14} className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-3 w-56 bg-black border border-white/10 shadow-2xl z-50"
              >
                <div className="px-5 py-4 border-b border-white/10">
                  <p className="text-white font-medium text-[14px] tracking-tight">{username}</p>
                  <p className="text-white/40 font-mono text-[11px] uppercase tracking-widest mt-1">Member</p>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); onResetTopics(); }}
                  className="w-full flex items-center gap-4 px-5 py-4 text-[14px] text-white/60 hover:text-white hover:bg-white/5 transition-colors border-b border-white/10 text-left"
                >
                  <RefreshCw size={16} />
                  Re-select Topics
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onLogout(); }}
                  className="w-full flex items-center gap-4 px-5 py-4 text-[14px] text-white/60 hover:text-white hover:bg-white/5 transition-colors text-left"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

/* ════ SKELETON ════ */
const Skeleton = () => (
  <div className="min-h-screen bg-black pt-32 px-8 md:px-12">
    <div className="max-w-[1600px] mx-auto">
      <div className="h-12 bg-white/5 mb-16 w-1/3 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-video bg-white/5 animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

/* ════ MAIN ════ */
const Dashboard = () => {
  const { user, logout, authLoading } = useAuth();
  const navigate = useNavigate();
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [username, setUsername] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const loaderRef = useRef<HTMLDivElement>(null);

  const thumb = (id: string, fb?: string) => fb || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  // Redirect to landing if not authenticated once auth has resolved
  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate("/");
  }, [user, authLoading]);


  const toggleFav = async (v: any) => {
    if (!user) return;
    const vid = v.id.videoId;
    const ref = doc(db, "favorites", `${user.uid}_${vid}`);
    if (saved.has(vid)) {
      setSaved(p => { const n = new Set(p); n.delete(vid); return n; });
    } else {
      setSaved(p => new Set([...p, vid]));
      try { await setDoc(ref, { userId: user.uid, videoId: vid, title: v.snippet.title, thumbnail: thumb(vid, v.snippet.thumbnails?.high?.url), channel: v.snippet.channelTitle, savedAt: new Date() }); } catch {}
    }
  };

  const [isFirestoreBlocked, setIsFirestoreBlocked] = useState(false);

  const loadFeed = async (pg = 1) => {
    if (!user || isFetching) return;
    try {
      setIsFetching(true);
      pg === 1 ? setLoading(true) : setLoadingMore(true);
      
      const snap = await getDoc(doc(db, "users", user.uid)).catch(e => {
        if (e.message?.includes("blocked-by-client") || e.code === "unavailable" || e.name === "FirebaseError") {
          setIsFirestoreBlocked(true);
        }
        throw e;
      });

      if (!snap.exists()) return;
      const d = snap.data();
      setUsername(d.name || user.displayName || "");
      const ints = d.interests || [];
      setInterests(ints);
      if (!ints.length) { setLoading(false); return; }
      const res = await fetchPodcastsByInterest(ints, pg);
      const clean = (res || []).filter((i: any) => i?.id?.videoId && i?.snippet);
      if (!clean.length) { setHasMore(false); return; }
      setFeed(p => { const m = new Map(); [...p, ...clean].forEach((v: any) => m.set(v.id.videoId, v)); return Array.from(m.values()); });
    } catch (e) { 
      console.error("Dashboard Load Error:", e);
    }
    finally { setLoading(false); setLoadingMore(false); setIsFetching(false); }
  };

  useEffect(() => { if (!user) return; setFeed([]); setPage(1); setHasMore(true); loadFeed(1); }, [user]);
  useEffect(() => {
    if (!loaderRef.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && hasMore && !loadingMore && !isFetching) { const n = page + 1; setPage(n); loadFeed(n); }
    }, { rootMargin: "220px" });
    obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [page, hasMore, loadingMore, isFetching]);

  const filtered = q
    ? feed.filter(v => v.snippet.title.toLowerCase().includes(q.toLowerCase()) || v.snippet.channelTitle?.toLowerCase().includes(q.toLowerCase()))
    : feed;

  const handleLogout = async () => { await logout(); navigate("/"); };
  const handleResetTopics = async () => {
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), { onboardingCompleted: false }, { merge: true });
      navigate("/onboarding");
    } catch (e) { console.error(e); }
  };

  if (authLoading || loading) return <Skeleton />;

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <NavBar username={username} onLogout={handleLogout} onResetTopics={handleResetTopics} />

      <main className="max-w-[1600px] mx-auto px-8 md:px-12 pt-32 pb-20">
        
        {/* Ad-Blocker / Connection Warning */}
        {isFirestoreBlocked && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 text-red-200 text-[14px] flex items-center justify-between">
            <p><strong>System Alert:</strong> Your browser or ad-blocker is blocking Firebase. This will hide your topics and break the cache. Please disable ad-blockers for this site.</p>
            <button onClick={() => window.location.reload()} className="underline font-mono uppercase text-[12px] hover:text-white">Retry Connection</button>
          </div>
        )}
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/20 pb-12">
          <div>
            <h1 className="font-sans font-medium text-[clamp(2.5rem,6vw,5rem)] text-white tracking-tight leading-[0.9]">
              {username ? (
                <>For <span className="italic font-normal text-white/50">{username.split(" ")[0]}</span></>
              ) : "Your feed"}
            </h1>
            {interests.length > 0 && (
              <p className="text-white/40 text-[14px] tracking-tight mt-4 font-mono uppercase">[{interests.slice(0, 3).join(" · ")}{interests.length > 3 ? ` + ${interests.length - 3} more` : ""}]</p>
            )}
          </div>
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-white/30" size={20} />
            <input  
              type="text"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search your feed..."
              className="w-full bg-transparent border-b border-white/20 py-4 pl-10 pr-4 text-[16px] text-white placeholder:text-white/30 focus:outline-none focus:border-white transition-colors font-sans"
            />
          </div>
        </div>

        {/* No interests state */}
        {!interests.length && (
          <div className="flex flex-col items-center gap-8 py-32 text-center border border-white/10">
            <h2 className="font-sans font-medium text-[32px] text-white tracking-tight">No interests yet</h2>
            <p className="text-white/50 text-[18px] max-w-sm">Set up your topics to get a personalized audio feed curated just for you.</p>
            <button onClick={() => navigate("/onboarding")} className="flex items-center gap-4 px-10 py-5 bg-white text-black font-medium text-[16px] hover:bg-white/90 transition-colors">
              Select Topics <ArrowUpRight size={20} />
            </button>
          </div>
        )}

        {/* Featured Hero Card */}
        {featured && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-sans text-[20px] font-medium tracking-tight text-white">Featured</h2>
              <span className="text-[12px] font-mono text-white/30 uppercase tracking-widest">[{filtered.length} episodes]</span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(`/watch/${featured.id.videoId}`)}
              className="group relative w-full overflow-hidden glass-panel glass-border hover:border-white/40 transition-all duration-500 cursor-pointer"
              style={{ aspectRatio: "16/6" }}
            >
              <img
                src={thumb(featured.id.videoId, featured.snippet.thumbnails?.high?.url)}
                alt={featured.snippet.title}
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-40 group-hover:opacity-70 scale-105 group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-12 max-w-[70%] z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-mono text-white/60 uppercase tracking-widest border border-white/10">
                    Trending Now
                  </span>
                  <span className="text-[12px] font-mono text-white/40 uppercase tracking-widest">{featured.snippet.channelTitle}</span>
                </div>
                <h3 className="font-sans font-medium text-[clamp(1.5rem,4vw,3.5rem)] text-white leading-[1.1] mb-8 line-clamp-2 premium-text-glow">{featured.snippet.title}</h3>
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-3 px-8 py-4 bg-white text-black font-medium text-[14px] tracking-tight hover:bg-neutral-200 transition-colors rounded-full">
                    <Play size={18} className="fill-black" /> Play Episode
                  </button>
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                    <Heart size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Podcast Grid */}
        {rest.length > 0 && (
          <div className="mb-16">
            <h2 className="font-sans text-[20px] font-medium tracking-tight text-white mb-8">All Episodes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {rest.map((v, i) => (
                <motion.div
                  key={v.id.videoId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex flex-col gap-4"
                >
                  <div
                    onClick={() => navigate(`/watch/${v.id.videoId}`)}
                    className="relative w-full aspect-video overflow-hidden glass-panel glass-border group-hover:border-white/40 transition-all duration-500 cursor-pointer"
                  >
                    <img
                      src={thumb(v.id.videoId, v.snippet.thumbnails?.high?.url)}
                      alt={v.snippet.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-90 transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform">
                       <div className="flex items-center gap-2">
                         <Play size={14} className="text-white fill-white" />
                         <span className="text-[10px] font-mono text-white/80 uppercase tracking-widest">Available now</span>
                       </div>
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-4 px-2">
                    <div 
                      className="flex flex-col gap-2 cursor-pointer flex-1"
                      onClick={() => navigate(`/watch/${v.id.videoId}`)}
                    >
                      <span className="text-[11px] font-mono text-white/30 uppercase tracking-widest group-hover:text-white/60 transition-colors">{v.snippet.channelTitle}</span>
                      <h3 className="font-sans font-medium text-[17px] text-white/80 group-hover:text-white leading-snug transition-colors line-clamp-2">{v.snippet.title}</h3>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFav(v); }}
                      className={`shrink-0 p-2 transition-colors ${saved.has(v.id.videoId) ? 'text-white' : 'text-white/20 hover:text-white'}`}
                    >
                      <Heart size={20} fill={saved.has(v.id.videoId) ? 'white' : 'none'} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Infinite scroll loader */}
        <div ref={loaderRef} className="w-full py-12 flex justify-center">
          {loadingMore && (
            <span className="text-[12px] font-mono text-white/30 uppercase tracking-widest animate-pulse">Loading more…</span>
          )}
          {!hasMore && filtered.length > 0 && (
            <span className="text-[12px] font-mono text-white/20 uppercase tracking-widest">End of feed</span>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
