import { motion } from "framer-motion";
import { Play, Flame, BarChart3, ChevronLeft, ArrowUpRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const TRENDING_PODCASTS = [
  { id: "1", rank: "01", title: "The End of Asymmetric Advantage", creator: "Strategy & Finance", duration: "1:24:32", listeners: "2.4M", thumbnail: "https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?w=400&h=400&fit=crop" },
  { id: "2", rank: "02", title: "Humanity's Final Design Pattern", creator: "Neural Systems", duration: "58:21", listeners: "1.8M", thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=400&fit=crop" },
  { id: "3", rank: "03", title: "Zero-Latency Thinking", creator: "Cognitive Sciences", duration: "45:18", listeners: "1.2M", thumbnail: "https://images.unsplash.com/photo-1533134486753-c833f0edde8c?w=400&h=400&fit=crop" },
  { id: "4", rank: "04", title: "The Post-Attention Economy", creator: "Cultural Analysis", duration: "1:05:42", listeners: "980K", thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop" },
  { id: "5", rank: "05", title: "Synthetic Biology Frontiers", creator: "Biosphere Labs", duration: "52:14", listeners: "850K", thumbnail: "https://images.unsplash.com/photo-1530213786676-41ce9f48e9c6?w=400&h=400&fit=crop" },
];

const Trending = () => {
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
        <div className="flex flex-col gap-8 mb-20 border-b border-white/20 pb-16">
          <div className="flex items-center gap-4 text-white/40 cursor-pointer hover:text-white transition-colors w-fit" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
            <span className="text-[16px] font-medium tracking-tight">Back</span>
          </div>
          
          <h1 className="font-sans font-medium text-[clamp(4rem,8vw,7rem)] text-white tracking-tight leading-[0.9]">
            Current<br/>
            <span className="italic font-normal text-white/60">velocities</span>
          </h1>
          <p className="max-w-[400px] text-white/60 text-[18px] leading-relaxed font-sans mb-8">
            The mathematical signal surfacing the most impactful acoustic data across the network in real-time.
          </p>
          <button className="w-fit flex items-center gap-3 px-8 py-4 bg-white text-black font-medium text-[16px] tracking-tight hover:bg-white/90 transition-colors">
            Play Top 5 <Play size={18} fill="black" />
          </button>
        </div>

        {/* The List (Brutalist Rows) */}
        <section className="flex flex-col border-t border-white/20">
          {TRENDING_PODCASTS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/watch/${item.id}`)}
              className="group cursor-pointer grid grid-cols-[1fr] md:grid-cols-[auto_1fr_auto] items-center gap-8 p-8 border-b border-white/20 hover:bg-white hover:text-black transition-colors duration-500"
            >
              <div className="flex items-center gap-8 w-full md:w-auto">
                <span className="font-sans text-[clamp(3rem,6vw,5rem)] font-normal text-white/10 tracking-tighter group-hover:text-black/10 transition-colors">
                  {item.rank}
                </span>
                <div className="w-[120px] aspect-square overflow-hidden border border-white/10 group-hover:border-black/10 shrink-0">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover grayscale transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <span className="text-[14px] font-mono tracking-widest text-white/40 uppercase group-hover:text-black/50">{item.creator}</span>
                <h3 className="font-sans font-medium text-[min(6vw,32px)] text-white leading-[1.1] group-hover:text-black tracking-tight">{item.title}</h3>
              </div>
              
              <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end mt-4 md:mt-0">
                <div className="flex flex-col items-start md:items-end gap-1">
                   <span className="text-[12px] font-mono text-white/40 uppercase tracking-widest group-hover:text-black/40">Listeners</span>
                   <span className="text-[18px] font-sans text-white group-hover:text-black">{item.listeners}</span>
                </div>
                <div className="flex flex-col items-start md:items-end gap-1">
                   <span className="text-[12px] font-mono text-white/40 uppercase tracking-widest group-hover:text-black/40">Duration</span>
                   <span className="text-[18px] font-sans text-white group-hover:text-black">{item.duration}</span>
                </div>
                <ArrowUpRight className="hidden lg:block text-white/0 group-hover:text-black transition-all duration-300 -translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0" size={32} />
              </div>
            </motion.div>
          ))}
        </section>

      </main>
    </div>
  );
};

export default Trending;
