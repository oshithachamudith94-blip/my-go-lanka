import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Lock, User, Eye, EyeOff, CheckCircle, 
  Map, Briefcase, ChevronRight, ArrowRight, ShieldCheck, Globe
} from "lucide-react";
import Spline from '@splinetool/react-spline';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'traveler' | 'vendor'>('traveler');
  const [errors, setErrors] = useState<{name?: boolean, email?: boolean, password?: boolean}>({});

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const validateForm = () => {
    const newErrors = {
      name: !isLogin && name.trim() === "",
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      password: password.length < 6
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSuccess(true);
      // Mocking submission for visual demonstration
      setTimeout(() => {
        router.push('/admin-master-v1');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex relative overflow-hidden font-sans">
      <Head>
        <title>{isLogin ? 'Login' : 'Sign Up'} | MyGoLanka HQ</title>
      </Head>

      {/* 3D Visual Section (Surprise Factor) */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-50 border-r border-slate-200 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Spline scene="https://prod.spline.design/6Wq1Q7YGeNF99q2N/scene.splinecode" />
        </div>
        
        {/* Parallax Background Elements */}
        <motion.div 
          style={{ x: mousePosition.x * -1.5, y: mousePosition.y * -1.5 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" 
        />
        <motion.div 
          style={{ x: mousePosition.x * 2, y: mousePosition.y * 2 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px]" 
        />

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-20 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-10 max-w-md border-white/40 shadow-2xl"
            >
              <h2 className="text-3xl font-display font-black text-slate-900 mb-4 tracking-tight">Sri Lanka&apos;s Next Generation <span className="text-primary italic">Tourism Engine</span></h2>
              <p className="text-slate-500 font-medium leading-relaxed">Experience the most advanced admin command center designed for precision and performance.</p>
              
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                 {[1, 2, 3].map(i => (
                    <div key={i} className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center border border-slate-100">
                      <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                 ))}
              </div>
            </motion.div>
        </div>
      </div>

      {/* Auth Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-lg z-10">
          {/* Logo */}
          <div className="text-center mb-12">
             <motion.h1 
               whileHover={{ scale: 1.05 }}
               className="text-4xl font-display font-black tracking-tighter cursor-pointer inline-block"
               onClick={() => router.push('/')}
             >
               MyGo<span className="text-primary">Lanka</span>
             </motion.h1>
             <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Professional Admin Gateway</p>
          </div>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white/40 backdrop-blur-3xl border border-white/60 shadow-glass rounded-[40px] p-10 md:p-14"
              >
                <div className="mb-10">
                  <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                  <p className="text-slate-500 font-medium mt-1">Please enter your authorization credentials.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest">Full Name</label>
                       <div className="relative group">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                          <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Authorization Name" className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" />
                       </div>
                    </div>
                  )}

                  <div className="space-y-2">
                     <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest">Email Address</label>
                     <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="admin@mygolanka.com" className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Master Password</label>
                        <button type="button" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Recover Key</button>
                     </div>
                     <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••••••" className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-14 pr-14 text-sm font-bold shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                           {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                     </div>
                  </div>

                  {!isLogin && (
                    <div className="flex bg-slate-100 p-1.5 rounded-[20px] gap-2">
                       <button type="button" onClick={() => setRole('traveler')} className={`flex-1 py-3 rounded-[15px] text-xs font-black uppercase tracking-widest transition-all ${role === 'traveler' ? 'bg-white text-primary shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>Traveler</button>
                       <button type="button" onClick={() => setRole('vendor')} className={`flex-1 py-3 rounded-[15px] text-xs font-black uppercase tracking-widest transition-all ${role === 'vendor' ? 'bg-white text-primary shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>Provider</button>
                    </div>
                  )}

                  <button type="submit" className="w-full py-5 bg-primary hover:bg-primary-hover text-white font-black rounded-3xl transition-all shadow-2xl shadow-primary/30 flex items-center justify-center group active:scale-[0.98]">
                    {isLogin ? 'Establish Authorization' : 'Create HQ Profile'}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                  </button>
                </form>

                <div className="mt-12 pt-8 border-t border-slate-100 text-center text-sm font-bold text-slate-400">
                  {isLogin ? "No HQ credentials?" : "Already established?"}
                  <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline ml-2">
                    {isLogin ? "Join the Network" : "Return to Vault"}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center glass-card p-20 shadow-primary/20"
              >
                 <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-8 relative border border-success/20">
                    <CheckCircle className="w-12 h-12 text-success" />
                    <motion.div 
                       initial={{ scale: 0.8, opacity: 1 }}
                       animate={{ scale: 1.5, opacity: 0 }}
                       transition={{ duration: 1.5, repeat: Infinity }}
                       className="absolute inset-0 bg-success/20 rounded-full"
                    />
                 </div>
                 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight mb-2">Authenticated</h2>
                 <p className="text-slate-500 font-medium">Syncing headquarters database...</p>
                 <div className="w-48 h-1.5 bg-slate-100 rounded-full mx-auto mt-10 overflow-hidden">
                    <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1/2 h-full bg-primary rounded-full" />
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
