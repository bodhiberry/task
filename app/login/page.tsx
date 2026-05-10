"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { CheckSquare, Mail, Lock, ArrowRight, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { register } from "@/app/actions/register";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
          callbackUrl: "/dashboard",
        });
        
        if (result && "error" in result && result.error) {
          setError("Invalid email or password");
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        const result = await register({ name, email, password });
        
        if (result.error) {
          if (typeof result.error === "string") {
            setError(result.error);
          } else {
            setError("Validation failed. Please check your inputs.");
          }
        } else {
          // Auto sign in after registration
          await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/dashboard",
          });
          window.location.href = "/dashboard";
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 min-h-screen flex items-center justify-center p-6 bg-[#050505] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md glass-card rounded-[32px] p-10 border border-white/10"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center shadow-2xl shadow-blue-500/40 mb-6">
            <CheckSquare className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">TaskFlow</h1>
          <p className="text-zinc-500">{isLogin ? "Welcome back to your workspace" : "Create your internal account"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    name="name"
                    type="text"
                    required={!isLogin}
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-5 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                name="email"
                type="email"
                required
                placeholder="name@company.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-5 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-5 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          {error && <p className="text-rose-400 text-xs font-medium ml-1">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
            <span className="bg-[#121212] px-4 text-zinc-600">Or continue with</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M24 12.273c0-.837-.074-1.641-.213-2.414H12.218v4.568h6.605c-.284 1.527-1.145 2.823-2.441 3.682v3.064h3.954c2.314-2.132 3.645-5.273 3.645-8.9z"/>
              <path fill="#34A853" d="M12.218 24c3.24 0 5.956-1.077 7.945-2.913l-3.954-3.064c-1.096.736-2.5 1.173-3.991 1.173-3.073 0-5.673-2.073-6.605-4.854H1.664v3.164C3.645 21.491 7.682 24 12.218 24z"/>
              <path fill="#FBBC05" d="M5.613 14.341c-.24-.714-.373-1.473-.373-2.25s.133-1.536.373-2.25V6.677H1.664a11.986 11.986 0 0 0 0 10.827l3.949-3.163z"/>
              <path fill="#4285F4" d="M12.218 4.75c1.763 0 3.345.605 4.586 1.791l3.436-3.436C18.168 1.127 15.451 0 12.218 0 7.682 0 3.645 2.509 1.664 6.677l3.949 3.164c.932-2.782 3.532-4.841 6.605-4.841z"/>
            </svg>
            Google
          </button>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-zinc-500 hover:text-white transition-colors"
          >
            {isLogin ? "Don't have an account? Contact HR" : "Already have an account? Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
