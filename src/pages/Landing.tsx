import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Brain, Globe, Zap, Headphones } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import FluidGlass from "@/components/ui/FluidGlass";

const FEATURES = [
  { icon: Brain, title: "AI Curation", body: "Learns exactly what you love. Gets smarter every session." },
  { icon: Globe, title: "180+ Countries", body: "Global creators. Local taste." },
  { icon: Zap, title: "Instant Discovery", body: "Zero lag. Infinite rabbit holes." },
  { icon: Headphones, title: "Cinematic Audio", body: "Studio-quality streaming on any device." },
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
    <FluidGlass mode="lens">
      <div className="w-full min-h-screen relative z-10 font-sans selection:bg-white selection:text-black">
        {/* Top-down shadow gradient to ground the content */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/80 pointer-events-none -z-10" />

      {/* ══ BRUTALIST PURE-TEXT NAVBAR ══ */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-8 pb-4 mix-blend-difference">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 flex items-start justify-between">
          
          {/* Logo - Pure Text */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white group-hover:rotate-180 transition-transform duration-700">
              <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="font-sans font-medium text-lg tracking-tight text-white">
              PodStream
            </span>
          </div>

          {/* Center Links (Hidden on small mobile) */}
          <nav className="hidden md:flex items-center gap-8 mt-1">
          </nav>

          {/* Right Layout (Language & CTA) */}
          <div className="flex items-center gap-16 mt-1">
            <div className="hidden lg:flex items-center gap-2 text-[14px] font-normal tracking-tight text-white/50">
              <span className="text-white">En</span>
              <span>|</span>
              <span className="hover:text-white cursor-pointer transition-colors">Es</span>
            </div>
            
            <button onClick={handleLogin} className="flex items-center gap-2 text-[14px] font-normal tracking-tight text-white hover:opacity-70 transition-opacity group">
              Start Free 
              <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* ══ MASSIVE TYPOGRAPHY HERO ══ */}
      <section className="relative w-full h-[100svh] min-h-[700px] flex items-center z-10">
        <div className="max-w-[1600px] mx-auto w-full px-8 md:px-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[1200px]"
          >
            {/* 
              Matching the exact layout from the user's reference:
              "We defy the disciplines \n to mobilize your data"
            */}
            <h1 className="font-sans text-[#f4f4f5] tracking-tight leading-[0.95] text-[clamp(4rem,10vw,11rem)]">
              <span className="font-medium block">We curate the audio</span>
              <span className="font-normal italic block pr-4">to amplify your mind</span>
            </h1>
          </motion.div>

        </div>
      </section>

      {/* ══ BRUTALIST MARQUEE ══ */}
      <div className="relative z-10 w-full border-t border-b border-white/20 bg-black/50 backdrop-blur-md py-6 overflow-hidden">
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
      </div>

      {/* ══ MINIMALIST FEATURES GRID ══ */}
      <section className="relative z-10 w-full bg-black/40 py-40">
        <div className="max-w-[1600px] mx-auto px-8 md:px-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16 mb-24 border-b border-white/20 pb-12">
            <h2 className="font-sans font-medium text-[clamp(2.5rem,5vw,4.5rem)] text-white tracking-tight leading-[1]">
              Engineered for the<br />
              <span className="italic font-normal text-white/70">auditory obsessive.</span>
            </h2>
            <p className="max-w-[400px] text-white/60 text-[18px] leading-relaxed font-sans pb-2">
              Our platform defies traditional podcast consumption, leveraging advanced algorithms to deliver pure signal, zero noise.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="flex flex-col gap-6 group">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5 group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <f.icon size={20} strokeWidth={1.5} className="group-hover:stroke-black transition-colors duration-300" />
                </div>
                <div>
                  <h4 className="font-sans font-medium text-white text-[22px] mb-3 tracking-tight">{f.title}</h4>
                  <p className="text-white/60 text-[16px] leading-[1.6] font-sans">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BRUTALIST CTA ══ */}
      <section className="relative z-10 w-full bg-[#0015b3]/80 backdrop-blur-sm py-40 flex items-center justify-center text-center">
        <div className="max-w-4xl mx-auto px-8 flex flex-col items-center">
          <h2 className="font-sans font-medium text-[clamp(4rem,8vw,7rem)] text-white tracking-tight leading-[0.9] mb-12">
            Change your<br />
            <span className="italic font-normal">perspective</span>
          </h2>
          <button onClick={handleLogin} className="flex items-center gap-3 px-10 py-5 bg-white text-black font-medium text-[16px] tracking-tight hover:bg-white/90 transition-colors rounded-full">
            Join the Club <ArrowUpRight size={20} />
          </button>
        </div>
      </section>

      {/* ══ MINIMAL FOOTER ══ */}
      <footer className="relative z-10 w-full bg-black/80 py-16 px-8 md:px-12 border-t border-white/20">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
          <div className="flex items-center gap-3">
             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white">
              <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="font-sans font-medium text-[20px] tracking-tight text-white">PodStream</span>
          </div>
          
          <div className="flex items-center gap-12">
            <a 
              href="https://github.com/abhinaycoding" 
              target="_blank" 
              rel="noopener noreferrer"
              className="no-underline"
            >
              <button className="group relative dark:bg-neutral-800 bg-neutral-200 rounded-full p-px overflow-hidden">
                <span className="absolute inset-0 rounded-full overflow-hidden">
                  <span className="inset-0 absolute pointer-events-none select-none">
                    <span className="block -translate-x-1/2 -translate-y-1/3 w-24 h-24 blur-xl" style={{background: 'linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))'}} />
                  </span>
                </span>
                <span className="inset-0 absolute pointer-events-none select-none" style={{animation: '10s ease-in-out 0s infinite alternate none running border-glow-translate'}}>
                  <span className="block z-0 h-full w-12 blur-xl -translate-x-1/2 rounded-full" style={{animation: '10s ease-in-out 0s infinite alternate none running border-glow-scale', background: 'linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))'}} />
                </span>
                <span className="flex items-center justify-center gap-1 relative z-[1] dark:bg-neutral-950/90 bg-neutral-50/90 rounded-full py-2 px-4 pl-2 w-full">
                  <span className="relative group-hover:scale-105 transition-transform group-hover:rotate-[360deg] duration-500">
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80 dark:opacity-100" style={{animation: '14s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0s infinite alternate none running star-rotate'}}>
                      <path d="M11.5268 2.29489C11.5706 2.20635 11.6383 2.13183 11.7223 2.07972C11.8062 2.02761 11.903 2 12.0018 2C12.1006 2 12.1974 2.02761 12.2813 2.07972C12.3653 2.13183 12.433 2.20635 12.4768 2.29489L14.7868 6.97389C14.939 7.28186 15.1636 7.5483 15.4414 7.75035C15.7192 7.95239 16.0419 8.08401 16.3818 8.13389L21.5478 8.88989C21.6457 8.90408 21.7376 8.94537 21.8133 9.00909C21.8889 9.07282 21.9452 9.15644 21.9758 9.2505C22.0064 9.34456 22.0101 9.4453 21.9864 9.54133C21.9627 9.63736 21.9126 9.72485 21.8418 9.79389L18.1058 13.4319C17.8594 13.672 17.6751 13.9684 17.5686 14.2955C17.4622 14.6227 17.4369 14.9708 17.4948 15.3099L18.3768 20.4499C18.3941 20.5477 18.3835 20.6485 18.3463 20.7406C18.3091 20.8327 18.2467 20.9125 18.1663 20.9709C18.086 21.0293 17.9908 21.0639 17.8917 21.0708C17.7926 21.0777 17.6935 21.0566 17.6058 21.0099L12.9878 18.5819C12.6835 18.4221 12.345 18.3386 12.0013 18.3386C11.6576 18.3386 11.3191 18.4221 11.0148 18.5819L6.3978 21.0099C6.31013 21.0563 6.2112 21.0772 6.11225 21.0701C6.0133 21.0631 5.91832 21.0285 5.83809 20.9701C5.75787 20.9118 5.69563 20.8321 5.65846 20.7401C5.62128 20.6482 5.61066 20.5476 5.6278 20.4499L6.5088 15.3109C6.567 14.9716 6.54178 14.6233 6.43534 14.2959C6.32889 13.9686 6.14441 13.672 5.8978 13.4319L2.1618 9.79489C2.09039 9.72593 2.03979 9.63829 2.01576 9.54197C1.99173 9.44565 1.99524 9.34451 2.02588 9.25008C2.05652 9.15566 2.11307 9.07174 2.18908 9.00788C2.26509 8.94402 2.3575 8.90279 2.4558 8.88889L7.6208 8.13389C7.96106 8.08439 8.28419 7.95295 8.56238 7.75088C8.84058 7.54881 9.0655 7.28216 9.2178 6.97389L11.5268 2.29489Z" fill="url(#paint0_linear_171_8212)" stroke="url(#paint1_linear_171_8212)" strokeLinecap="round" strokeLinejoin="round" />
                      <defs>
                        <linearGradient id="paint0_linear_171_8212" x1="-0.5" y1={9} x2="15.5" y2="-1.5" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#7A69F9" />
                          <stop offset="0.575" stopColor="#F26378" />
                          <stop offset={1} stopColor="#F5833F" />
                        </linearGradient>
                        <linearGradient id="paint1_linear_171_8212" x1="-0.5" y1={9} x2="15.5" y2="-1.5" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#7A69F9" />
                          <stop offset="0.575" stopColor="#F26378" />
                          <stop offset={1} stopColor="#F5833F" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="rounded-full w-11 h-11 absolute opacity-0 dark:opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-lg" style={{animation: '14s ease-in-out 0s infinite alternate none running star-shine', background: 'linear-gradient(135deg, rgb(59, 196, 242), rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))'}} />
                  </span>
                  <span className="bg-gradient-to-b ml-1.5 dark:from-white dark:to-white/50 from-neutral-950 to-neutral-950/50 bg-clip-text text-xs text-transparent group-hover:scale-105 transition transform-gpu">
                    Follow @abhinaycoding on GitHub
                  </span>
                </span>
              </button>
            </a>
          </div>
        </div>
      </footer>
      </div>
    </FluidGlass>
  );
};


export default Landing;
