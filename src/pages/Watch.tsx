import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Maximize, X, PenLine, Save, Zap, ChevronRight } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useStreaming } from "@/hooks/useStreaming";

// ══ AI SIGNAL SIMULATOR ══
// Generates believable, premium AI insights for any podcast
const AI_TOPICS = [
  { label: "ARTIFICIAL INTELLIGENCE", theme: "cognitive systems" },
  { label: "STRATEGY & CAPITAL", theme: "capital allocation" },
  { label: "HUMAN PERFORMANCE", theme: "neurological optimization" },
  { label: "SYSTEMS DESIGN", theme: "complex architecture" },
  { label: "PHILOSOPHY", theme: "first principles" },
];

const TAKEAWAY_POOLS = [
  "The nature of intelligence is inseparable from the environment in which it operates.",
  "Capital is not money — it is organized human attention applied over time.",
  "Most cognitive limitations are self-imposed constraints, not biological ceilings.",
  "Compounding applies to knowledge, relationships, and reputation as much as it does to finance.",
  "The most valuable skill in the next decade will be the ability to learn rapidly and unlearn gracefully.",
  "Systems fail not from a single catastrophic event, but from the accumulation of small unchecked assumptions.",
  "Clarity of purpose is the highest-leverage variable in any organization's performance.",
  "The boundary between human and machine cognition will be defined by context, not capability.",
  "Discipline creates freedom — constraint forced upon external systems produces the most extraordinary outputs.",
  "The signal is always present. The challenge is filtering out the noise of convention.",
];

const CONCEPT_POOLS = [
  "SIGNAL THEORY", "EMERGENT SYSTEMS", "META-COGNITION", "CAPITAL STACK",
  "NEURAL PLASTICITY", "TEMPORAL ARBITRAGE", "FIRST PRINCIPLES", "NETWORK EFFECTS",
  "COGNITIVE LOAD", "COMPOUNDING RETURNS", "ASYMMETRIC BETS", "ADVERSARIAL THINKING",
  "BEHAVIORAL LOOP", "DECISION HYGIENE", "ZERO-SUM FALLACY", "LATENT SPACE",
];

const MARKER_POOLS = [
  { time: "03:42", label: "Opening Thesis" },
  { time: "12:15", label: "Core Argument" },
  { time: "28:50", label: "Key Inflection Point" },
  { time: "41:20", label: "Framework Introduced" },
  { time: "55:08", label: "Major Insight" },
  { time: "1:12:30", label: "Contrarian Take" },
  { time: "1:34:00", label: "Final Synthesis" },
];

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const generateSignal = () => ({
  topic: AI_TOPICS[Math.floor(Math.random() * AI_TOPICS.length)],
  takeaways: shuffle(TAKEAWAY_POOLS).slice(0, 4),
  concepts: shuffle(CONCEPT_POOLS).slice(0, 8),
  markers: shuffle(MARKER_POOLS).slice(0, 4).sort((a, b) => a.time.localeCompare(b.time)),
});

// ══ AI SIGNAL SCAN ANIMATION ══
const ScanAnimation = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8 select-none">
      <div className="w-full relative h-[2px] bg-white/5 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.8, ease: "easeInOut" }}
        />
      </div>
      <div className="w-full flex flex-col gap-3">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="h-[1px] bg-white/10"
            initial={{ width: "0%", opacity: 0 }}
            animate={{ width: `${60 + Math.random() * 40}%`, opacity: 1 }}
            transition={{ delay: i * 0.3, duration: 0.8, ease: "easeOut" }}
          />
        ))}
      </div>
      <div className="flex flex-col items-center gap-3 text-center">
        <motion.div
          className="w-2 h-2 bg-white"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
        <p className="text-[11px] font-mono text-white/30 uppercase tracking-widest">
          Analysing signal...
        </p>
      </div>
    </div>
  );
};

// ══ NEURAL SYNTHESIS STREAMING ══
const NeuralSynthesis = ({ data, isStreaming }: { data: string, isStreaming: boolean }) => (
  <div className="p-8 font-sans selection:bg-blue-500/30">
    <div className="flex items-center gap-3 mb-10">
      <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`} />
      <span className="text-[10px] font-mono tracking-[0.4em] text-white/40 uppercase">
        {isStreaming ? "Neural Layer Active" : "Synthesis Complete"}
      </span>
    </div>
    
    <div className="text-[17px] leading-[1.8] text-white/80 whitespace-pre-line">
      {data}
      {isStreaming && (
        <motion.span 
          animate={{ opacity: [1, 0, 1] }} 
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-[2px] h-[18px] bg-blue-500 ml-1 translate-y-[3px]"
        />
      )}
    </div>

    {!isStreaming && data && (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 pt-8 border-t border-white/5"
      >
        <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
          End of Transmission // Semantic Buffer Flushed
        </span>
      </motion.div>
    )}
  </div>
);

// ══ AI SIGNAL RESULTS ══
const SignalResults = ({
  signal,
}: {
  signal: any;
}) => (
  <div className="px-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
    {/* Topic Tag */}
    <div className="py-5 border-b border-white/10">
      <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase block mb-1">
        Dominant Signal
      </span>
      <span className="text-[13px] font-mono font-medium text-white tracking-widest uppercase">
        {signal.topic.label}
      </span>
    </div>

    {/* Key Takeaways */}
    <div className="py-6 border-b border-white/10">
      <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase block mb-6">
        Structured Insights
      </span>
      <ol className="flex flex-col gap-6">
        {signal.takeaways.map((t: string, i: number) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex gap-4 items-start group"
          >
            <span className="font-mono text-[11px] text-white/20 mt-0.5 shrink-0">
              0{i + 1}
            </span>
            <p className="text-[13px] text-white/70 leading-relaxed font-sans group-hover:text-white transition-colors">
              {t}
            </p>
          </motion.li>
        ))}
      </ol>
    </div>

    {/* Core Concepts */}
    <div className="py-6">
      <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase block mb-4">
        Semantic Clusters
      </span>
      <div className="flex flex-wrap gap-2">
        {signal.concepts.map((c: string, i: number) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            className="px-3 py-1.5 border border-white/10 text-[10px] font-mono tracking-widest text-white/50 hover:border-white hover:border-blue-500/40 transition-all cursor-default"
          >
            {c}
          </motion.span>
        ))}
      </div>
    </div>
  </div>
);

// ══ MAIN WATCH COMPONENT ══
const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Panel state: null = closed, "notes" = notes, "signal" = ai
  const [panel, setPanel] = useState<null | "notes" | "signal">(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [scanning, setScanning] = useState(false);
  const [signal, setSignal] = useState<any | null>(null);
  
  const { data, isStreaming, startSimulation, stopStream } = useStreaming();

  // Auto-generate structured signal data once streaming finishes
  useEffect(() => {
    if (data && !isStreaming && !signal) {
      setSignal(generateSignal());
    }
  }, [data, isStreaming, signal]);

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate(-1);
    };
    document.addEventListener("keydown", handleEsc, true);
    return () => document.removeEventListener("keydown", handleEsc, true);
  }, [navigate]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user || !id) return;
      try {
        const d = await getDoc(doc(db, "notes", `${user.uid}_${id}`));
        if (d.exists() && d.data().content) {
          setNotes(d.data().content);
          setLastSaved(d.data().updatedAt?.toDate() || new Date());
        }
      } catch (e) {
        console.error("Error fetching notes:", e);
      }
    };
    fetchNotes();
  }, [user, id]);

  const handleNotesChange = (val: string) => {
    setNotes(val);
    setSaving(true);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      if (!user || !id) return;
      try {
        const now = new Date();
        await setDoc(
          doc(db, "notes", `${user.uid}_${id}`),
          { userId: user.uid, videoId: id, content: val, updatedAt: now },
          { merge: true }
        );
        setLastSaved(now);
      } catch (e) {
        console.error("Error saving notes:", e);
      } finally {
        setSaving(false);
      }
    }, 1500);
  };

  const openFullscreen = () => {
    const iframe = document.getElementById("yt-player") as HTMLIFrameElement | null;
    if (!iframe) return;
    try {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if ((iframe as any).webkitRequestFullscreen) {
        (iframe as any).webkitRequestFullscreen();
      } else if ((iframe as any).mozRequestFullScreen) {
        (iframe as any).mozRequestFullScreen();
      } else if ((iframe as any).msRequestFullscreen) {
        (iframe as any).msRequestFullscreen();
      }
    } catch (e) {
      console.error("Fullscreen failed:", e);
    }
  };

  const handleSignalOpen = () => {
    if (panel === "signal") { 
      setPanel(null); 
      stopStream();
      return; 
    }
    setPanel("signal");
    if (!data) {
      setScanning(true);
    }
  };

  const handleScanDone = useCallback(() => {
    setScanning(false);
    const mockInsight = `Analysis of input audio signal indicates a heavy emphasis on first principles thinking within the capital stack. 

The speaker points out that most cognitive limitations are not biological, but rather systematic assumptions that have been left unchecked over decades of convention. 

To break this loop, one must apply rapid unlearning—discarding the noise of tradition to find the high-leverage signal that compounding returns actually require. 

Conclusion: Human performance is optimized through the constraint of external systems, not the removal of them.`;
    
    startSimulation(mockInsight);
  }, [startSimulation]);

  const showPanel = panel !== null;
  const modeLabel = panel === "signal" ? "Signal Mode" : panel === "notes" ? "Study Mode" : "Cinema Mode";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black z-[9999] flex flex-col overflow-hidden"
    >
      {/* TOP BAR */}
      <div className="w-full px-8 py-5 flex items-center justify-between border-b border-white/10 shrink-0 select-none">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-[14px] font-medium text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-[11px] font-mono uppercase tracking-widest text-white/20">
            {modeLabel}
          </span>
          <button
            onClick={openFullscreen}
            title="Enter Fullscreen"
            className="p-3 border border-white/10 hover:border-white/40 hover:bg-white/5 transition-all text-white/50 hover:text-white"
          >
            <Maximize size={16} />
          </button>
          <button
            onClick={() => navigate(-1)}
            className="p-3 border border-white/10 hover:border-white/40 hover:bg-white/5 transition-all text-white/50 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-0 w-full relative">
        {/* VIDEO (Left/Full) */}
        <motion.div
          animate={{ 
            width: showPanel ? (window.innerWidth < 768 ? "100%" : "65%") : "100%",
            opacity: (showPanel && window.innerWidth < 768) ? 0.3 : 1
          }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="h-full flex flex-col items-center justify-center px-4 md:px-12 py-6 shrink-0 z-0"
        >
          <motion.div
            animate={{ maxWidth: showPanel ? "100%" : "75rem" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full flex justify-center items-center"
          >
            <div
              className="relative w-full border border-white/10 bg-black overflow-hidden mx-auto"
              style={{
                aspectRatio: "16 / 9",
                maxHeight: "calc(100vh - 180px)",
                maxWidth: "calc((100vh - 180px) * 16 / 9)",
              }}
            >
              <iframe
                id="yt-player"
                src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&fs=1`}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                title="PodStream Video Player"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT PANEL */}
        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="absolute right-0 top-0 bottom-0 w-full md:w-[35%] border-l border-white/10 bg-black/95 md:bg-[#050505] backdrop-blur-xl md:backdrop-blur-none flex flex-col z-50 overflow-hidden"
            >
              {/* Panel Tab Bar */}
              <div className="flex border-b border-white/10 shrink-0 select-none">
                <button
                  onClick={() => setPanel("notes")}
                  className={`flex items-center gap-2.5 px-6 py-4 text-[11px] font-mono uppercase tracking-widest border-r border-white/10 transition-colors
                    ${panel === "notes" ? "bg-white text-black" : "text-white/40 hover:text-white hover:bg-white/5"}`}
                >
                  <PenLine size={13} /> Notes
                </button>
                <button
                  onClick={() => setPanel("signal")}
                  className={`flex items-center gap-2.5 px-6 py-4 text-[11px] font-mono uppercase tracking-widest transition-colors
                    ${panel === "signal" ? "bg-white text-black" : "text-white/40 hover:text-white hover:bg-white/5"}`}
                >
                  <Zap size={13} /> AI Signal
                </button>

                {/* Save indicator in header (for notes tab only) */}
                {panel === "notes" && (
                  <div className="ml-auto flex items-center px-4 text-[10px] font-mono tracking-widest uppercase">
                    {saving ? (
                      <span className="text-white/30 flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-white/30 animate-pulse inline-block" /> Saving
                      </span>
                    ) : lastSaved ? (
                      <span className="text-white/20 flex items-center gap-1.5">
                        <Save size={11} /> Saved
                      </span>
                    ) : null}
                  </div>
                )}
              </div>

              {/* NOTES CONTENT */}
              {panel === "notes" && (
                <textarea
                  value={notes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder={"Start typing your insights here...\n\nNotes auto-save instantly."}
                  className="flex-1 w-full bg-transparent resize-none outline-none p-6 text-[14px] leading-relaxed text-white/80 placeholder:text-white/20 font-sans"
                  spellCheck={false}
                />
              )}

              {/* SIGNAL CONTENT */}
              {panel === "signal" && (
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {scanning && <ScanAnimation onDone={handleScanDone} />}
                  {!scanning && (
                    <>
                      <NeuralSynthesis data={data} isStreaming={isStreaming} />
                      {!isStreaming && signal && <SignalResults signal={signal} />}
                    </>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM BAR */}
      <div className="w-full px-4 md:px-8 py-4 flex items-center justify-between border-t border-white/10 shrink-0 select-none bg-black/50 backdrop-blur-md">
        <span className="text-[10px] md:text-[11px] font-mono text-white/20 uppercase tracking-widest hidden sm:block">
          Press <span className="text-white/40">ESC</span> to exit ·{" "}
          <span className="text-white/40">FS</span> for fullscreen
        </span>

        <div className="flex items-center gap-2 md:gap-3 ml-auto md:ml-0 w-full md:w-auto justify-end">
          {/* Notes Button */}
          <button
            onClick={() => setPanel(panel === "notes" ? null : "notes")}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2.5 px-4 md:px-5 py-3 md:py-2.5 border transition-all text-[10px] md:text-[11px] font-mono uppercase tracking-widest
              ${panel === "notes"
                ? "bg-white text-black border-white"
                : "bg-transparent text-white border-white/20 hover:border-white hover:bg-white/5"}`}
          >
            <PenLine size={13} />
            <span className="hidden xs:inline">Notes</span>
          </button>

          {/* AI Signal Button */}
          <button
            onClick={handleSignalOpen}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2.5 px-4 md:px-5 py-3 md:py-2.5 border transition-all text-[10px] md:text-[11px] font-mono uppercase tracking-widest
              ${panel === "signal"
                ? "bg-white text-black border-white"
                : "bg-transparent text-white border-white/20 hover:border-white hover:bg-white/5"}`}
          >
            <Zap size={13} />
            <span className="hidden xs:inline">AI Signal</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Watch;
