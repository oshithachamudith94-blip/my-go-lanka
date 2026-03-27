import Head from "next/head";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users, ArrowRight, ShieldCheck, Star } from "lucide-react";
import Spline3DBackground from "../components/Spline3DBackground";
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const navigateToAuth = () => router.push('/auth');

  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/20">
      <Head>
        <title>MyGoLanka | Premium Tourism & Transport</title>
        <meta name="description" content="Sri Lanka's elite transport and tourism platform." />
      </Head>

      {/* 3D Visual Layer */}
      <Spline3DBackground />

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-8 flex justify-between items-center max-w-7xl mx-auto backdrop-blur-sm bg-white/10 border-b border-white/10">
        <div className="flex items-center gap-2 group cursor-pointer">
           <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
           </div>
           <h1 className="text-xl font-display font-black tracking-tight text-slate-900 group-hover:text-primary transition-colors">MyGo<span className="text-primary">Lanka</span></h1>
        </div>
        <div className="flex items-center gap-8">
           <button onClick={navigateToAuth} className="text-xs font-black uppercase tracking-widest text-slate-600 hover:text-primary transition-colors">Partner Access</button>
           <button onClick={navigateToAuth} className="btn-primary py-3 px-8 text-xs uppercase tracking-widest shadow-xl shadow-primary/20">Sign In</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-48 pb-32 px-8 flex flex-col items-center justify-center min-h-screen text-center">
        
        {/* Animated Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center px-4 py-2 bg-white/50 backdrop-blur-md rounded-full border border-white shadow-sm mb-10">
             <Star className="w-4 h-4 text-secondary mr-2 fill-secondary" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Exquisite Sri Lankan Adventures</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter text-slate-900 mb-8 leading-[1.1]">
            Your Premium <span className="text-secondary">Ride</span> <br /> Through Paradise.
          </h2>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
            Experience the pearl of the Indian Ocean with professional chauffeurs, elite vehicles, and bespoke itineraries tailored for the global traveler.
          </p>
        </motion.div>

        {/* Glass Search Interface */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full max-w-5xl"
        >
          <div className="glass-card p-4 md:p-6 !rounded-[40px] shadow-2xl border-white/80">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SearchField icon={MapPin} label="Destination" placeholder="Bentota, Ella, Kandy..." />
              <SearchField icon={Calendar} label="Trip Type" placeholder="Daily, Round Tour..." />
              <SearchField icon={Users} label="Passengers" placeholder="2 Adults, 1 Child" />
              <button className="btn-primary h-20 md:h-full text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center justify-center group overflow-hidden relative">
                 <span className="relative z-10">Explore Matrix</span>
                 <ArrowRight className="w-4 h-4 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>
          
          {/* Social Proof */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
             <span className="text-sm font-black text-slate-400">TRUSTED BY 500+ HOTELS</span>
             <span className="text-sm font-black text-slate-400">SLTDA CERTIFIED</span>
             <span className="text-sm font-black text-slate-400">ISO 9001 SECURITY</span>
          </div>
        </motion.div>
      </main>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>
    </div>
  );
}

const SearchField = ({ icon: Icon, label, placeholder }: any) => (
  <div className="bg-white/40 hover:bg-white transition-colors duration-300 rounded-3xl p-5 border border-white/50 text-left cursor-pointer group">
    <div className="flex items-center gap-3 mb-1">
       <Icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
    </div>
    <input 
      type="text" 
      placeholder={placeholder} 
      className="w-full bg-transparent text-sm font-bold text-slate-900 border-none outline-none placeholder:text-slate-300 pointer-events-none"
    />
  </div>
);
