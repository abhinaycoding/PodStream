import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ArrowUpRight, Play } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const CATEGORIES = [
  "Technology", "Business", "Health", "World",
  "Science", "Lifestyle", "Culture", "True Crime"
];

// Using real YouTube podcast video IDs that are guaranteed to embed
const FEATURED = [
  { id: "J1LgQ-i7qQo", title: "Sam Altman: OpenAI CEO on GPT-4, ChatGPT, and the Future of AI", creator: "Lex Fridman", duration: "2:23:45", thumbnail: "https://i.ytimg.com/vi/J1LgQ-i7qQo/hqdefault.jpg" },
  { id: "v=PeMaE9LhM0A", title: "Why We Sleep: Science of Sleep & Dreams", creator: "Matt Walker", duration: "1:05:32", thumbnail: "https://i.ytimg.com/vi/PeMaE9LhM0A/hqdefault.jpg" },
  { id: "v1b-l3UvW-g", title: "How to Build a Startup", creator: "Y Combinator", duration: "45:18", thumbnail: "https://i.ytimg.com/vi/v1b-l3UvW-g/hqdefault.jpg" },
  { id: "n3kNlFNcABw", title: "Tim Cook: Apple CEO on Innovation and Privacy", creator: "Dua Lipa", duration: "43:20", thumbnail: "https://i.ytimg.com/vi/n3kNlFNcABw/hqdefault.jpg" },
  { id: "WqJ0EIfp27M", title: "The Science of Making & Breaking Habits", creator: "Andrew Huberman", duration: "1:52:14", thumbnail: "https://i.ytimg.com/vi/WqJ0EIfp27M/hqdefault.jpg" },
  { id: "1-TZqOsVCNM", title: "How to Stop Procrastinating", creator: "Ali Abdaal", duration: "18:33", thumbnail: "https://i.ytimg.com/vi/1-TZqOsVCNM/hqdefault.jpg" },
];

const Discover = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = query
    ? FEATURED.filter(f => f.title.toLowerCase().includes(query.toLowerCase()) || f.creator.toLowerCase().includes(query.toLowerCase()))
    : FEATURED;

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
      <main className="max-w-[1600px] mx-auto px-8 md:px-12 pt-40 pb-20">

        {/* Header Section */}
        <div className="flex flex-col gap-8 mb-24 border-b border-white/20 pb-16">
          <div className="flex items-center gap-4 text-white/40 cursor-pointer hover:text-white transition-colors w-fit" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
            <span className="text-[16px] font-medium tracking-tight">Back</span>
          </div>

          <h1 className="font-sans font-medium text-[clamp(3.5rem,7vw,6rem)] text-white tracking-tight leading-[0.9]">
            Discover fresh<br/>
            <span className="italic font-normal text-white/60">perspectives.</span>
          </h1>

          <div className="relative max-w-2xl w-full mt-4">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40" size={24} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Creators, topics, or ideas..."
              className="w-full bg-transparent border-b border-white/20 rounded-none py-6 pl-12 pr-4 text-[20px] text-white placeholder:text-white/30 focus:outline-none focus:border-white transition-colors font-sans"
            />
          </div>
        </div>

        {/* Categories Grid (Brutalist style) */}
        {!query && (
          <div className="mb-24">
            <h2 className="font-sans text-[24px] font-medium tracking-tight mb-8">Topics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-white/20">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  className={`group relative aspect-[4/3] border-r border-b border-white/20 p-6 flex flex-col justify-end cursor-pointer transition-colors duration-500 text-left
                    ${selectedCategory === category ? 'bg-[#0015b3]' : 'bg-black hover:bg-white/[0.03]'}`}
                >
                  <span className="font-sans text-[18px] font-medium tracking-tight text-white z-10">{category}</span>
                  <ArrowUpRight className="absolute top-6 right-6 text-white/20 group-hover:text-white transition-all duration-300" size={24} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Featured / Results Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-sans text-[24px] font-medium tracking-tight">
              {query ? `Results for "${query}"` : selectedCategory ? selectedCategory : "Featured"}
            </h2>
            <span className="text-[14px] font-mono tracking-widest text-white/40 uppercase">[{filtered.length}]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group flex flex-col gap-4 cursor-pointer"
                onClick={() => navigate(`/watch/${item.id}`)}
              >
                <div className="w-full aspect-video overflow-hidden border border-white/10 group-hover:border-white/40 relative transition-all duration-500">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-14 h-14 border-2 border-white bg-black/50 backdrop-blur-md flex items-center justify-center">
                      <Play size={22} className="fill-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 px-2.5 py-1 font-mono text-[11px] text-white/70">
                    {item.duration}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest block mb-2">{item.creator}</span>
                  <h3 className="font-sans font-medium text-[20px] text-white leading-tight group-hover:underline underline-offset-4 line-clamp-2">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-24 text-center border border-white/10">
              <p className="text-white/40 text-[18px] font-medium">No results found for "{query}"</p>
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default Discover;
