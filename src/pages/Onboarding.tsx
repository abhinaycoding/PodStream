import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Check, ArrowRight } from "lucide-react";

const CATEGORIES = [
  "Technology", "Artificial Intelligence", "Business", "Finance",
  "Startups", "Health & Wellness", "Education", "Science",
  "Culture", "True Crime", "Comedy", "Productivity",
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, authLoading } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border border-white/20 animate-spin">
          <div className="w-2 h-2 bg-white absolute top-0 left-0" />
        </div>
      </div>
    );
  }

  if (!user) { navigate("/"); return null; }

  const toggle = (c: string) =>
    setSelected(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const handleContinue = async () => {
    if (!selected.length) return;
    try {
      setLoading(true);
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid, email: user.email,
        name: user.displayName, photoURL: user.photoURL,
        interests: selected, onboardingCompleted: true,
        updatedAt: new Date(),
      }, { merge: true });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error saving interests");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-white selection:text-black">
      
      {/* Navbar */}
      <header className="w-full px-8 md:px-12 pt-10 pb-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="font-sans font-medium text-lg tracking-tight text-white">PodStream</span>
        </div>
        <span className="text-[12px] font-mono text-white/40 uppercase tracking-widest">Step 01 — Topic Selection</span>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-[900px] mx-auto w-full px-8 md:px-12 pt-20 pb-20">
        
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 border-b border-white/20 pb-16"
        >
          <h1 className="font-sans font-medium text-[clamp(3.5rem,8vw,7rem)] text-white tracking-tight leading-[0.85] mb-8">
            Build your<br />
            <span className="italic font-normal text-white/50">personal feed.</span>
          </h1>
          <p className="text-[18px] text-white/50 font-medium leading-relaxed max-w-[500px]">
            Select the topics that move you. We'll curate a precision-crafted audio signal unique to your interests.
          </p>
          
          <div className="flex items-center gap-8 mt-12">
            <span className="text-[14px] font-mono text-white/40 uppercase tracking-widest">
              Selected: <span className="text-white">{selected.length}</span> / {CATEGORIES.length}
            </span>
            {selected.length > 0 && (
              <div className="w-full max-w-[200px] h-[2px] bg-white/10 relative overflow-hidden">
                <motion.div 
                  animate={{ width: `${(selected.length / CATEGORIES.length) * 100}%` }}
                  className="absolute top-0 left-0 h-full bg-[#0015b3]"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Topic Grid (Brutalist) */}
        <div className="grid grid-cols-2 md:grid-cols-3 border-t border-l border-white/20 mb-16">
          {CATEGORIES.map((cat, i) => {
            const isActive = selected.includes(cat);
            return (
              <motion.button
                key={cat}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => toggle(cat)}
                className={`group relative flex items-center justify-between p-8 border-r border-b border-white/20 text-left transition-all duration-500 cursor-pointer
                  ${isActive ? 'bg-white' : 'bg-black hover:bg-white/[0.02]'}`}
              >
                <span className={`font-sans font-medium text-[18px] tracking-tight transition-colors ${isActive ? 'text-black' : 'text-white'}`}>
                  {cat}
                </span>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-6 h-6 rounded-full bg-black flex items-center justify-center shrink-0"
                >
                  <Check size={14} className="text-white" strokeWidth={3} />
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-8"
        >
          <button
            onClick={handleContinue}
            disabled={!selected.length || loading}
            className={`group flex items-center gap-5 px-12 py-6 font-medium text-[16px] tracking-tight transition-all duration-500
              ${selected.length > 0 
                ? 'bg-white text-black hover:bg-[#0015b3] hover:text-white' 
                : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <span className="w-5 h-5 border border-current/30 border-t-current animate-spin" />
                Curating your feed…
              </span>
            ) : (
              <>
                Continue to Feed
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </>
            )}
          </button>
          
          {selected.length === 0 && (
            <span className="text-[14px] font-mono text-white/30 uppercase tracking-widest">
              Select at least one topic
            </span>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
