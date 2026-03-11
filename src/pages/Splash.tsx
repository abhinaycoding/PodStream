import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/onboarding"); // or /dashboard later
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center overflow-hidden">

      {/* Glow */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute w-[300px] h-[300px] bg-primary/30 blur-[120px] rounded-full"
      />

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 140 }}
        className="flex flex-col items-center gap-4 z-10"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-xl">
          <Play className="w-10 h-10 text-background fill-background ml-1" />
        </div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-display text-2xl font-bold"
        >
          PodStream
        </motion.h1>

        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-muted-foreground text-sm"
        >
          Preparing your experience...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Splash;
