import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Activity, Server, Database, Globe, Lock, Unlock, 
  Power, Smartphone, Laptop, AlertTriangle, RadioTower, RefreshCw, 
  Fingerprint, Eye, Zap, ShieldBan, XCircle, Search, Cpu, CheckSquare, Square, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import OmnipotentStaffArchitect from './OmnipotentStaffArchitect';

export default function OmnipotentSecurityGrid({ usersList, refresh }: { usersList: any[], refresh: () => void }) {
  const [subModule, setSubModule] = useState<'global' | 'staff'>('global');
  const [pulseProps, setPulseProps] = useState({ cpu: 12, ram: 45, latency: 42 });
  const [secState, setSecState] = useState({
    nuclearLock: false,
    payoutFreeze: false,
    force2FA: false,
    geoSrilankaOnly: true
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, title: string, desc: string, action: () => void } | null>(null);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  
  const enhancedUsers = usersList.map((u: any, index: number) => ({
    ...u,
    mockDevice: index % 3 === 0 ? 'iPhone 15 Pro • iOS 17' : index % 2 === 0 ? 'Redmi Note 12 • Android 14' : 'Windows 11 • Chrome',
    mockIp: `202.165.11.${Math.floor(Math.random() * 255)}`,
    mockRisk: Math.floor(Math.random() * 100),
    mockStatus: index % 5 === 0 ? 'Away' : index % 8 === 0 ? 'Banned' : 'Online',
    mockSessionId: `SESS-${Math.floor(Math.random() * 9000) + 1000}`
  }));

  const filteredUsers = enhancedUsers.filter((u: any) => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseProps({
        cpu: Math.floor(Math.random() * 15) + 5,
        ram: Math.floor(Math.random() * 10) + 30,
        latency: Math.floor(Math.random() * 20) + 10
      });
    }, 5000);
    return () => clearInterval(pulseInterval);
  }, []);

  const toggleOverride = (key: keyof typeof secState) => {
    setSecState(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success(`${key.toUpperCase()} Status Updated`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-32">
      
      {/* Tab Switcher */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-max gap-2 mx-auto shadow-inner border border-slate-200/50">
         <button onClick={() => setSubModule('global')} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center ${subModule === 'global' ? 'bg-white text-primary shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
            <Globe className="w-4 h-4 mr-2"/> Network Intelligence
         </button>
         <button onClick={() => setSubModule('staff')} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center ${subModule === 'staff' ? 'bg-white text-primary shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
            <Shield className="w-4 h-4 mr-2"/> Personnel Vault
         </button>
      </div>

      <AnimatePresence mode="wait">
        {subModule === 'global' ? (
           <motion.div key="global" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
             
             {/* Security Controls Grid */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               
               {/* Infrastructure Health */}
               <div className="glass-card p-8 flex flex-col shadow-xl">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-8 flex items-center"><Activity className="w-4 h-4 mr-2 animate-pulse"/> Infrastructure Health</h2>
                  <div className="space-y-8 flex-1">
                     <StatLine label="Core Processor" value={`${pulseProps.cpu}%`} color="bg-primary" />
                     <StatLine label="Memory Matrix" value={`${pulseProps.ram}%`} color="bg-success" />
                     <StatLine label="Network Latency" value={`${pulseProps.latency}ms`} color="bg-secondary" />
                  </div>
               </div>

               {/* Access Protocols */}
               <div className="glass-card p-8 shadow-xl">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-red-500 mb-8 flex items-center"><ShieldBan className="w-4 h-4 mr-2"/> Security Protocols</h2>
                  <div className="grid grid-cols-2 gap-4">
                     <ProtocolBtn active={secState.nuclearLock} onClick={() => toggleOverride('nuclearLock')} icon={Power} label="Global Lock" color="red" />
                     <ProtocolBtn active={secState.payoutFreeze} onClick={() => toggleOverride('payoutFreeze')} icon={Lock} label="Payout Stop" color="orange" />
                     <ProtocolBtn active={secState.geoSrilankaOnly} onClick={() => toggleOverride('geoSrilankaOnly')} icon={Globe} label="Geo Fence" color="blue" />
                     <ProtocolBtn active={secState.force2FA} onClick={() => toggleOverride('force2FA')} icon={Fingerprint} label="Force MFA" color="green" />
                  </div>
               </div>

               {/* Broadcast & Alerts */}
               <div className="glass-card p-8 shadow-xl flex flex-col">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-8 flex items-center"><Zap className="w-4 h-4 mr-2"/> Global Broadcast</h2>
                  <textarea 
                    value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Enter urgent notification title..." 
                    className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-bold outline-none focus:border-primary/50 transition-all resize-none shadow-inner"
                  />
                  <button className="btn-secondary w-full py-4 mt-6 text-[10px] uppercase tracking-widest shadow-secondary/20">
                    <RadioTower className="w-4 h-4 mr-2" /> Disseminate Message
                  </button>
               </div>
             </div>

             {/* User Access Matrix */}
             <div className="glass-card overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/50">
                   <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 flex items-center"><ShieldAlert className="w-5 h-5 mr-3 text-primary"/> Identity & Access Matrix</h2>
                   <div className="w-80 bg-slate-100 border border-slate-200 rounded-2xl flex items-center px-4 py-2 relative">
                      <Search className="w-4 h-4 text-slate-400 mr-2"/>
                      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search access logs..." className="w-full bg-transparent border-none text-xs font-bold outline-none"/>
                   </div>
                </div>
                
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 border-b border-slate-100">
                            <th className="py-5 px-8 uppercase">Authorization Subject</th>
                            <th className="py-5 px-8">Endpoint Fingerprint</th>
                            <th className="py-5 px-8">Security Risk</th>
                            <th className="py-5 px-8 text-right">Master Overrides</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredUsers.map((u, i) => (
                          <tr key={u._id} className="hover:bg-slate-50/50 transition duration-300">
                             <td className="py-5 px-8">
                                <div className="flex items-center gap-4">
                                   <div className="relative">
                                      <img src={`https://ui-avatars.com/api/?name=${u.name}&background=f1f5f9&color=005999&bold=true`} className="w-11 h-11 rounded-2xl border border-slate-200 shadow-sm"/>
                                      <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${u.mockStatus === 'Online' ? 'bg-success' : 'bg-slate-300'}`}></div>
                                   </div>
                                   <div>
                                      <p className="font-exrabold text-slate-900 text-sm">{u.name}</p>
                                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{u.role}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="py-5 px-8">
                                <div className="space-y-1">
                                   <div className="flex items-center text-[11px] font-bold text-slate-600"><Smartphone className="w-3.5 h-3.5 mr-2 text-primary/40"/> {u.mockDevice}</div>
                                   <div className="text-[10px] font-mono text-slate-400 tracking-tighter">NODE-HASH: {u.mockIp}</div>
                                </div>
                             </td>
                             <td className="py-5 px-8">
                                <div className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-[10px] font-black tracking-widest uppercase ${u.mockRisk > 70 ? 'bg-red-50 text-red-500 border-red-100' : 'bg-primary/5 text-primary border-primary/10'}`}>
                                   <ShieldAlert className="w-3.5 h-3.5 mr-2"/> Risk LVL: {u.mockRisk}%
                                </div>
                             </td>
                             <td className="py-5 px-8 text-right space-x-3">
                                <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm"><Eye className="w-4 h-4"/></button>
                                <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-secondary hover:border-secondary/30 transition-all shadow-sm"><Power className="w-4 h-4"/></button>
                                <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-all shadow-sm"><ShieldBan className="w-4 h-4"/></button>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
             </div>
           </motion.div>
        ) : (
           <motion.div key="staff" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <OmnipotentStaffArchitect />
           </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const StatLine = ({ label, value, color }: any) => (
  <div className="space-y-2">
     <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
        <span>{label}</span>
        <span className="text-slate-900 font-display">{value}</span>
     </div>
     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <motion.div initial={{ width: 0 }} animate={{ width: value }} transition={{ duration: 1, ease: 'easeOut' }} className={`h-full ${color} rounded-full shadow-lg shadow-current/20`} />
     </div>
  </div>
);

const ProtocolBtn = ({ active, onClick, icon: Icon, label, color }: any) => {
  const colorMap: any = {
    red: 'text-red-500 bg-red-50 border-red-100 active-shadow-red',
    orange: 'text-secondary bg-secondary/10 border-secondary/20 active-shadow-orange',
    blue: 'text-primary bg-primary/10 border-primary/20 active-shadow-primary',
    green: 'text-success bg-success/10 border-success/20 active-shadow-success',
  };

  return (
    <button onClick={onClick} className={`p-6 rounded-3xl border transition-all flex flex-col items-center justify-center gap-3 group ${active ? colorMap[color] : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600 shadow-sm hover:shadow-md'}`}>
       <Icon className={`w-8 h-8 transition-transform group-hover:scale-110 ${active ? 'animate-pulse' : ''}`} />
       <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
};
