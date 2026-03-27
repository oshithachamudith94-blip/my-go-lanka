import Head from "next/head";
import { useState, useEffect } from "react";
import { User, Mail, Phone, Save, ArrowLeft, ShieldCheck, MapPin, Calendar, Clock } from "lucide-react";
import { useRouter } from "next/router";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState({ name: '', email: '', phone: '', id: 'AUT-330', role: 'admin' });
  const [loading, setLoading] = useState(false);
  
  // 3D Tilt Effect Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(prev => ({ ...prev, id: payload.id.slice(-7).toUpperCase(), email: payload.email, name: localStorage.getItem("username") || 'Super Admin' }));
    } catch (e) { console.error('Token parse failed'); }
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-8 font-sans selection:bg-primary/20">
      <Head><title>Admin Profile | MyGoLanka HQ</title></Head>
      
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-12">
        <button onClick={() => router.back()} className="flex items-center text-slate-500 font-bold hover:text-primary transition-colors group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Terminal
        </button>
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shadow-sm">
             <ShieldCheck className="w-6 h-6 text-primary" />
           </div>
           <h1 className="text-xl font-display font-black tracking-tight text-slate-900">Security Clearance: <span className="text-primary">Level 4</span></h1>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Profile Identity Card (With 3D Tilt Surprise) */}
        <div className="lg:col-span-1 perspective-1000">
           <motion.div 
             onMouseMove={handleMouseMove}
             onMouseLeave={handleMouseLeave}
             style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
             className="glass-card p-10 flex flex-col items-center text-center relative overflow-hidden group cursor-pointer shadow-2xl border-white/60"
           >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-32 h-32 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-xl mb-6 overflow-hidden relative" style={{ transform: "translateZ(50px)" }}>
                 <div className="w-full h-full flex items-center justify-center text-4xl font-black text-slate-300">SA</div>
                 <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ShieldCheck className="w-10 h-10 text-primary" />
                 </div>
              </div>

              <div style={{ transform: "translateZ(30px)" }}>
                 <h2 className="text-2xl font-display font-black text-slate-900">{user.name}</h2>
                 <p className="text-primary font-black text-[11px] uppercase tracking-[0.3em] mt-1 mb-6">System Architect</p>
                 
                 <div className="flex flex-col gap-3 text-left w-full mt-8">
                    <div className="flex items-center text-xs font-bold text-slate-500">
                       <MapPin className="w-4 h-4 mr-3 text-primary/60" /> Colombo HQ, Node 1
                    </div>
                    <div className="flex items-center text-xs font-bold text-slate-500">
                       <Calendar className="w-4 h-4 mr-3 text-primary/60" /> Established Dec 2023
                    </div>
                    <div className="flex items-center text-xs font-bold text-slate-500">
                       <Clock className="w-4 h-4 mr-3 text-primary/60" /> Last Sync: Just Now
                    </div>
                 </div>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-100 w-full" style={{ transform: "translateZ(20px)" }}>
                 <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest inline-block">
                    ID: {user.id}
                 </div>
              </div>
           </motion.div>
        </div>

        {/* Profile Settings (Main Form) */}
        <div className="lg:col-span-2 space-y-8">
           <div className="glass-card p-10 md:p-14 border-white/60 shadow-xl">
             <div className="mb-10">
                <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">System Identity Vault</h2>
                <p className="text-slate-500 font-medium">Update your core profile information across the network.</p>
             </div>

             <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Master Name</label>
                   <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <input type="text" value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="input-field w-full pl-12 font-bold" />
                   </div>
                </div>

                <div className="space-y-2 opacity-60">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Email Protocol</label>
                   <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="email" value={user.email} disabled className="input-field w-full pl-12 font-bold bg-slate-100/50 cursor-not-allowed" />
                   </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                   <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Contact Matrix line</label>
                   <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <input type="text" value={user.phone} onChange={e => setUser({...user, phone: e.target.value})} className="input-field w-full pl-12 font-bold" placeholder="+94 7X XXX XXXX" />
                   </div>
                </div>

                <div className="md:col-span-2 pt-6">
                   <button 
                     onClick={(e) => { e.preventDefault(); toast.success("Identity Synchronized with Master Node."); }}
                     className="btn-primary w-full py-5 text-sm uppercase tracking-widest flex items-center justify-center group"
                   >
                     <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" /> Synchronize Identity
                   </button>
                </div>
             </form>
           </div>

           {/* Security Stats */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-8 border-white/60 shadow-lg flex items-center gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                    <ShieldCheck className="w-7 h-7 text-secondary" />
                 </div>
                 <div>
                    <h4 className="text-lg font-black text-slate-900">2FA Active</h4>
                    <p className="text-xs text-slate-500 font-medium tracking-tight">Enhanced security protocols engaged.</p>
                 </div>
              </div>
              
              <div className="glass-card p-8 border-white/60 shadow-lg flex items-center gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center border border-success/20">
                    <ShieldCheck className="w-7 h-7 text-success" />
                 </div>
                 <div>
                    <h4 className="text-lg font-black text-slate-900">Encrypted</h4>
                    <p className="text-xs text-slate-500 font-medium tracking-tight">Full disk and session encryption active.</p>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
