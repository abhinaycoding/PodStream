import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Chrome,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithGoogle } from "@/lib/auth";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showSplash, setShowSplash] = useState(false);

  const navigate = useNavigate();

  const handleSuccessLogin = () => {
    setShowSplash(true);

    setTimeout(() => {
      navigate(isLogin ? "/dashboard" : "/onboarding");
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSuccessLogin();
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (!user) return;
      handleSuccessLogin();
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && <LoginSplash />}
      </AnimatePresence>

      <div
        className={`min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4 ${
          showSplash ? "pointer-events-none blur-sm" : ""
        }`}
      >
        <div className="ambient-glow" />

        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Play className="w-4 h-4 text-background fill-background" />
          </div>
          <span className="font-display font-bold">PodStream</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-card w-full max-w-md p-8 relative z-10"
        >
          <div className="absolute -inset-1 bg-gradient-primary opacity-20 blur-xl rounded-3xl" />

          <div className="relative">

            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-background fill-background ml-1" />
              </div>

              <h1 className="font-display text-2xl font-bold mb-2">
                {isLogin ? "Welcome back" : "Create your account"}
              </h1>

              <p className="text-muted-foreground">
                {isLogin ? "Sign in to continue" : "Start your podcast journey"}
              </p>
            </div>

            <div className="flex rounded-xl bg-muted p-1 mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 rounded-lg ${
                  isLogin ? "bg-card shadow" : "text-muted-foreground"
                }`}
              >
                Sign In
              </button>

              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 rounded-lg ${
                  !isLogin ? "bg-card shadow" : "text-muted-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleGoogleSignIn}
              className="w-full glass-card-hover flex items-center justify-center gap-3 py-3 mb-6"
            >
              <Chrome size={18} />
              Continue with Google
            </motion.button>

            <form onSubmit={handleSubmit} className="space-y-4">

              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-glass pl-12"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-glass pl-12"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-glass pl-12 pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="btn-gradient w-full py-4"
              >
                {isLogin ? "Sign In" : "Create Account"} <ArrowRight />
              </motion.button>

            </form>

          </div>
        </motion.div>

      </div>
    </>
  );
};

export default Login;
