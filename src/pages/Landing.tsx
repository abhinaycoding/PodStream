import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Brain, Globe, Zap, Headphones } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import FluidGlass from "@/components/ui/FluidGlass";

const FEATURES = [
  { icon: Brain, title: "Neural Synthesis", body: "AI-driven takeaways that distill 3-hour marathons into 3-minute insights." },
  { icon: Zap, title: "Semantic Search", body: "Find every mention of a topic across the entire library instantly." },
  { icon: Globe, title: "Global Intel", body: "Break language barriers with real-time translation and transcription." },
  { icon: Headphones, title: "Studio Fidelity", body: "Lossless audio streaming engineered for the most discerning ears." },
];

const PODCASTERS = [
  "Lex Fridman", "Joe Rogan", "Andrew Huberman", "Tim Ferriss",
  "Raj Shamani", "Nikhil Kamath", "My First Million", "Naval Ravikant",
  "Ali Abdaal", "Steven Bartlett", "Codie Sanchez", "Scott Galloway",
  "Brené Brown", "Diary of a CEO", "Armchair Expert", "SmartLess",
  "NPR Politics", "Radiolab", "Hidden Brain", "How I Built This",
];

const MARQUEE_A = [...PODCASTERS, ...PODCASTERS];

// Array defining the vertical background bands to simulate folds
const BANDS = Array.from({ length: 16 });

const Landing = () => {
  const { login, user, authLoading } = useAuth();
  const navigate = useNavigate();
  const [logging, setLogging] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;
    getDoc(doc(db, "users", user.uid)).then(s =>
      navigate(s.exists() && s.data().onboardingCompleted ? "/dashboard" : "/onboarding")
    ).catch(() => navigate("/dashboard"));
  }, [user, authLoading]);

  const handleLogin = async () => {
    if (logging) return;
    try { setLogging(true); await login(); }
    catch (e: any) { alert(e.message || "Login failed"); setLogging(false); }
  };

  return (
    <FluidGlass>
      <div className="w-full min-h-screen relative z-10 font-sans selection:bg-white selection:text-black">
      
      {/* ══ MINIMAL NAVBAR ══ */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-12 pb-4">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="relative flex items-center justify-center"
            >
              {/* Star-like logo from reference */}
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                 <path d="M12 2L12 22M2 12L22 12M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </motion.div>
            <span className="font-sans font-medium text-xl tracking-tight text-white uppercase letter-spacing-widest">
              PoDstream
            </span>
          </div>

          {/* Right Layout (CTA Only) */}
          <div className="flex items-center gap-6">
            <button onClick={handleLogin} className="flex items-center gap-2 text-[15px] font-medium tracking-tight text-white hover:bg-white hover:text-black transition-all duration-500 group px-6 py-2.5 rounded-full border border-white/20 backdrop-blur-md">
              Start Free 
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* ══ HERO LAYOUT ══ */}
      <section className="relative w-full h-[90svh] flex items-center z-10 pt-20">
        <div className="max-w-[1600px] mx-auto w-full px-6 md:px-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[1300px]"
          >
            <h1 className="font-sans text-white tracking-tighter leading-[1.05] text-[clamp(2.75rem,8.5vw,10.5rem)]">
              <span className="font-bold block selection:bg-blue-500">Stop scrolling.</span>
              <span className="font-bold block text-blue-400 selection:bg-white selection:text-blue-600">Start absorbing.</span>
              <span className="font-medium italic block opacity-95 mt-8 text-[clamp(1.5rem,4vw,4.5rem)] leading-[1.2] tracking-tight">
                The world's most intelligent podcast engine.
              </span>
            </h1>
          </motion.div>

        </div>
      </section>

      {/* ══ BRUTALIST MARQUEE ══ */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative z-10 w-full border-t border-b border-white/10 bg-black/40 backdrop-blur-xl py-8 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        <style>{`
          @keyframes scroll-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .marquee-content { display: flex; width: max-content; animation: scroll-left 40s linear infinite; }
        `}</style>
        <div className="marquee-content">
          {[...MARQUEE_A, ...MARQUEE_A].map((name, i) => (
            <span key={i} className="mx-6 text-[14px] font-mono tracking-tight uppercase text-white/60">
              {name}
            </span>
          ))}
        </div>
      </motion.div>

      {/* ══ MINIMALIST FEATURES GRID ══ */}
      <section className="relative z-10 w-full bg-black/40 py-40">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16 mb-24 border-b border-white/20 pb-12"
          >
            <h2 className="font-sans font-medium text-[clamp(2.5rem,5vw,4.5rem)] text-white tracking-tight leading-[1]">
              Engineered for the<br />
              <span className="italic font-normal text-white/70">knowledge-obsessed.</span>
            </h2>
            <p className="max-w-[400px] text-white/60 text-[18px] leading-relaxed font-sans pb-2">
              PoDstream redefines the auditory landscape, transforming passive listening into active intelligence.
            </p>
          </motion.div>
          
          <div className="bento-container">
            {/* Featured Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="col-span-1 md:col-span-2 row-span-2 glass-panel glass-border p-10 flex flex-col justify-between group overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               <div className="relative z-10">
                 <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                   <Brain size={28} className="text-white" />
                 </div>
                 <h4 className="font-sans font-medium text-white text-[32px] mb-4 tracking-tight leading-none">{FEATURES[0].title}</h4>
                 <p className="text-white/60 text-[18px] leading-relaxed font-sans max-w-sm">{FEATURES[0].body}</p>
                 
                 {/* Animated Waveform Wrapper */}
                 <div className="mt-12 h-16 w-full flex items-end gap-1 overflow-hidden opacity-40">
                   {[...Array(24)].map((_, i) => (
                     <motion.div
                       key={i}
                       animate={{ height: [10, 40, 15, 35, 12] }}
                       transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05, ease: "easeInOut" }}
                       className="w-full bg-blue-400/50 rounded-full"
                     />
                   ))}
                 </div>
               </div>
               <div className="relative z-10 flex items-center gap-2 text-white/40 font-mono text-sm uppercase tracking-widest group-hover:text-white transition-colors mt-8">
                 Explore Engine <ArrowUpRight size={14} />
               </div>
            </motion.div>

            {/* Other Cards */}
            {FEATURES.slice(1).map((f, i) => (
              <motion.div 
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="col-span-1 glass-panel glass-border p-8 flex flex-col gap-6 group hover:translate-y-[-4px] transition-transform duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center transition-colors group-hover:bg-white/20">
                  <f.icon size={20} className="text-white/70 group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-sans font-medium text-white text-[20px] mb-2 tracking-tight">{f.title}</h4>
                  <p className="text-white/50 text-[15px] leading-relaxed font-sans">{f.body}</p>
                </div>
              </motion.div>
            ))}

            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="col-span-1 md:col-span-2 glass-panel glass-border p-8 flex items-center justify-between group cursor-pointer bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div>
                <h4 className="font-sans font-medium text-white text-[22px] tracking-tight">Ready to dive in?</h4>
                <p className="text-white/40 text-[14px] font-mono uppercase tracking-widest mt-1">Join 50k+ listeners</p>
              </div>
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                <ArrowUpRight size={20} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full bg-[#0015b3]/80 backdrop-blur-sm py-40 flex items-center justify-center text-center"
      >
        <div className="max-w-4xl mx-auto px-8 flex flex-col items-center">
          <h2 className="font-sans font-medium text-[clamp(4rem,8vw,7rem)] text-white tracking-tight leading-[0.9] mb-12">
            Reclaim your<br />
            <span className="italic font-normal">bandwidth</span>
          </h2>
          <button onClick={handleLogin} className="flex items-center gap-3 px-10 py-5 bg-white text-black font-semibold text-[16px] tracking-tight hover:bg-neutral-200 transition-colors rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            Get Started Now <ArrowUpRight size={20} />
          </button>
        </div>
      </motion.section>

      {/* ══ PREMIUM FOOTER ══ */}
      <footer className="relative z-10 w-full bg-black/60 backdrop-blur-2xl py-24 px-8 md:px-12 border-t border-white/5 overflow-hidden">
        {/* Footer Top Glow Edge */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        {/* Ambient Footer Glows */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] pointer-events-none" />

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-16">
            
            {/* Branding Area */}
            <div className="flex items-center gap-4 group cursor-default">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="relative flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-white/20 blur-md rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                   <path d="M12 2L12 22M2 12L22 12M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </motion.div>
              <div className="flex flex-col">
                <span className="font-sans font-medium text-[22px] tracking-tight text-white uppercase letter-spacing-widest">PoDstream</span>
                <span className="text-white/30 text-[10px] uppercase tracking-[0.3em] mt-1">Intelligence Protocol v1.0</span>
              </div>
            </div>
            
            {/* Right Side Social/Link */}
            <div className="flex items-center gap-12">
              <a 
                href="https://github.com/abhinaycoding" 
                target="_blank" 
                rel="noopener noreferrer"
                className="no-underline block transform hover:scale-[1.02] transition-transform active:scale-[0.98]"
              >
                <button className="group relative dark:bg-neutral-800 bg-neutral-200 rounded-full p-px overflow-hidden shadow-2xl">
                  <span className="absolute inset-0 rounded-full overflow-hidden">
                    <span className="inset-0 absolute pointer-events-none select-none">
                      <span className="block -translate-x-1/2 -translate-y-1/3 w-28 h-28 blur-2xl" style={{background: 'linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))'}} />
                    </span>
                  </span>
                  <span className="inset-0 absolute pointer-events-none select-none" style={{animation: '10s ease-in-out 0s infinite alternate none running border-glow-translate'}}>
                    <span className="block z-0 h-full w-14 blur-2xl -translate-x-1/2 rounded-full" style={{animation: '10s ease-in-out 0s infinite alternate none running border-glow-scale', background: 'linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))'}} />
                  </span>
                  <span className="flex items-center justify-center gap-2 relative z-[1] dark:bg-black/80 bg-neutral-50/90 backdrop-blur-xl rounded-full py-3 px-6 pl-3 w-full border border-white/5">
                    <span className="relative group-hover:rotate-[360deg] transition-transform duration-700">
                      <svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80 dark:opacity-100">
                        <path d="M11.5268 2.29489C11.5706 2.20635 11.6383 2.13183 11.7223 2.07972C11.8062 2.02761 11.903 2 12.0018 2C12.1006 2 12.1974 2.02761 12.2813 2.07972C12.3653 2.13183 12.433 2.20635 12.4768 2.29489L14.7868 6.97389C14.939 7.28186 15.1636 7.5483 15.4414 7.75035C15.7192 7.95239 16.0419 8.08401 16.3818 8.13389L21.5478 8.88989C21.6457 8.90408 21.7376 8.94537 21.8133 9.00909C21.8889 9.07282 21.9452 9.15644 21.9758 9.2505C22.0064 9.34456 22.0101 9.4453 21.9864 9.54133C21.9627 9.63736 21.9126 9.72485 21.8418 9.79389L18.1058 13.4319C17.8594 13.672 17.6751 13.9684 17.5686 14.2955C17.4622 14.6227 17.4369 14.9708 17.4948 15.3099L18.3768 20.4499C18.3941 20.5477 18.3835 20.6485 18.3463 20.7406C18.3091 20.8327 18.2467 20.9125 18.1663 20.9709C18.086 21.0293 17.9908 21.0639 17.8917 21.0708C17.7926 21.0777 17.6935 21.0566 17.6058 21.0099L12.9878 18.5819C12.6835 18.4221 12.345 18.3386 12.0013 18.3386C11.6576 18.3386 11.3191 18.4221 11.0148 18.5819L6.3978 21.0099C6.31013 21.0563 6.2112 21.0772 6.11225 21.0701C6.0133 21.0631 5.91832 21.0285 5.83809 20.9701C5.75787 20.9118 5.69563 20.8321 5.65846 20.7401C5.62128 20.6482 5.61066 20.5476 5.6278 20.4499L6.5088 15.3109C6.567 14.9716 6.54178 14.6233 6.43534 14.2959C6.32889 13.9686 6.14441 13.672 5.8978 13.4319L2.1618 9.79489C2.09039 9.72593 2.03979 9.63829 2.01576 9.54197C1.99173 9.44565 1.99524 9.34451 2.02588 9.25008C2.05652 9.15566 2.11307 9.07174 2.18908 9.00788C2.26509 8.94402 2.3575 8.90279 2.4558 8.88889L7.6208 8.13389C7.96106 8.08439 8.28419 7.95295 8.56238 7.75088C8.84058 7.54881 9.0655 7.28216 9.2178 6.97389L11.5268 2.29489Z" fill="url(#paint0_linear_footer)" stroke="url(#paint1_linear_footer)" strokeLinecap="round" strokeLinejoin="round" />
                        <defs>
                          <linearGradient id="paint0_linear_footer" x1="-0.5" y1={9} x2="15.5" y2="-1.5" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#7A69F9" />
                            <stop offset="0.575" stopColor="#F26378" />
                            <stop offset={1} stopColor="#F5833F" />
                          </linearGradient>
                          <linearGradient id="paint1_linear_footer" x1="-0.5" y1={9} x2="15.5" y2="-1.5" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#7A69F9" />
                            <stop offset="0.575" stopColor="#F26378" />
                            <stop offset={1} stopColor="#F5833F" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                    <span className="bg-gradient-to-b dark:from-white dark:to-white/50 from-neutral-950 to-neutral-950/50 bg-clip-text text-[13px] font-medium tracking-tight text-transparent">
                      Follow @abhinaycoding
                    </span>
                  </span>
                </button>
              </a>
            </div>
          </div>
          
          <div className="mt-24 pt-8 border-t border-white/5 flex justify-between items-center text-[12px] text-white/20 font-mono uppercase tracking-[0.2em]">
            <span>© 2026 PoDstream Architecture</span>
            <div className="flex gap-8">
              <span className="cursor-help hover:text-white/40 transition-colors">Privacy</span>
              <span className="cursor-help hover:text-white/40 transition-colors">Terms</span>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </FluidGlass>
  );
};


export default Landing;
