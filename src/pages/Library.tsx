import { motion } from "framer-motion";
import { Clock, Heart, Download, ChevronLeft, ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const RECENTLY_PLAYED = [
  { id: "1", title: "The End of Asymmetric Advantage", creator: "Strategy & Finance", duration: "1:24:32", progress: 65, thumbnail: "https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?w=400&h=400&fit=crop" },
  { id: "2", title: "Building a $100M Startup", creator: "Founder Stories", duration: "58:21", progress: 100, thumbnail: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop" },
];

const SAVED_EPISODES = [
  { id: "3", title: "The Science of Sleep", creator: "Health Hub", duration: "45:18", added: "2 days ago", thumbnail: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=400&fit=crop" },
  { id: "4", title: "Web3 Explained", creator: "Crypto Daily", duration: "1:05:42", added: "1 week ago", thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop" },
];

const Library = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      
      {/* ══ BRUTALIST PURE-TEXT NAVBAR ══ */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-8 pb-4 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 flex items-start justify-between">
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white group-hover:-rotate-45 transition-transform duration-500">
              <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="font-sans font-medium text-lg tracking-tight text-white">PodStream</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 mt-1">
            <Link to="/dashboard" className="text-[14px] font-normal tracking-tight text-white/50 hover:text-white transition-opacity">Home</Link>
          </nav>
        </div>
      </header>

      {/* ══ MAIN CONTENT ══ */}
      <main className="max-w-[1200px] mx-auto px-8 md:px-12 pt-40 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col gap-8 mb-24 border-b border-white/20 pb-16">
          <div className="flex items-center gap-4 text-white/40 cursor-pointer hover:text-white transition-colors w-fit" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
            <span className="text-[16px] font-medium tracking-tight">Back</span>
          </div>
          
          <h1 className="font-sans font-medium text-[clamp(4rem,9vw,8rem)] text-white tracking-tight leading-[0.85]">
            Personal<br/>
            <span className="italic font-normal text-white/60">archive</span>
          </h1>
          
          <div className="flex gap-12 mt-8">
            <div className="flex flex-col gap-2">
              <span className="text-[14px] font-mono tracking-widest text-[#0015b3] uppercase">Saved</span>
              <span className="text-[32px] font-sans font-medium">124</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[14px] font-mono tracking-widest text-[#0015b3] uppercase">Listened</span>
              <span className="text-[32px] font-sans font-medium">1,402</span>
            </div>
          </div>
        </div>

        {/* Recently Played (Brutalist Grid) */}
        <section className="mb-32">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-sans text-[24px] font-medium tracking-tight">Recent Activity</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/20 border-t border-b border-white/20">
            {RECENTLY_PLAYED.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/watch/${item.id}`)}
                className="group relative cursor-pointer bg-black p-8 flex flex-col gap-8 hover:bg-[#050505] transition-colors"
              >
                <div className="flex gap-8">
                  <img src={item.thumbnail} alt={item.title} className="w-24 h-24 object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-sans font-medium text-[20px] text-white leading-tight mb-2 group-hover:underline underline-offset-4 line-clamp-2">{item.title}</h3>
                      <p className="text-white/50 text-[14px] tracking-tight">{item.creator}</p>
                    </div>
                    <span className="text-[12px] font-mono text-white/40 uppercase tracking-widest">{item.duration}</span>
                  </div>
                </div>
                
                <div className="w-full h-[2px] bg-white/10 relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-[#0015b3]" style={{ width: `${item.progress}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Saved Episodes (Sharp List) */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-sans text-[24px] font-medium tracking-tight">Bookmarks</h2>
          </div>
          <div className="flex flex-col border-t border-white/20">
            {SAVED_EPISODES.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/watch/${item.id}`)}
                className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 border-b border-white/20 cursor-pointer hover:bg-white transition-colors duration-500"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300" />
                  <div className="flex flex-col gap-1">
                    <h3 className="font-sans font-medium text-[18px] text-white leading-tight group-hover:text-black transition-colors">{item.title}</h3>
                    <p className="text-white/50 text-[14px] tracking-tight group-hover:text-black/60 transition-colors block">{item.creator}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                   <div className="flex flex-col items-start md:items-end gap-1">
                      <span className="text-[12px] font-mono text-white/40 uppercase tracking-widest group-hover:text-black/40">Duration</span>
                      <span className="text-[16px] font-sans text-white group-hover:text-black transition-colors">{item.duration}</span>
                   </div>
                   <div className="flex flex-col items-start md:items-end gap-1">
                      <span className="text-[12px] font-mono text-white/40 uppercase tracking-widest group-hover:text-black/40">Bookmarked</span>
                      <span className="text-[16px] font-sans text-white group-hover:text-black transition-colors">{item.added}</span>
                   </div>
                   <ArrowUpRight className="text-white/0 group-hover:text-black transition-all duration-300 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" size={24} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default Library;
