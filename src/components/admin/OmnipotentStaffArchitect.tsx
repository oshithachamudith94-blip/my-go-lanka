import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Shield, Key, Clock, Settings, FileText, 
  Trash2, Mail, Send, Activity, Lock, Unlock, Eye, EyeOff,
  AlertTriangle, CheckSquare, Square, MoreVertical, RefreshCw, XCircle, ChevronRight, Search, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import Lottie from 'lottie-react';

// Mock Lottie for "Sending"
const sendingAnimation = {
  v: "5.5.7",
  fr: 60,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Sending",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Paper Plane",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 1, k: [{ t: 0, s: [0] }, { t: 60, s: [360] }], ix: 10 },
        p: { a: 0, k: [50, 50, 0], ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              path: { a: 0, k: { i: [[0,0],[0,0],[0,0]], o: [[0,0],[0,0],[0,0]], v: [[-20,-10],[20,0],[-20,10]] }, ix: 2 },
              nm: "Path"
            },
            {
              ty: "st",
              c: { a: 0, k: [0, 0.35, 0.6, 1], ix: 3 },
              o: { a: 0, k: 100, ix: 4 },
              w: { a: 0, k: 2, ix: 5 },
              lc: 1, lj: 1, ml: 4, nm: "Stroke"
            }
          ]
        }
      ]
    }
  ]
};

export default function OmnipotentStaffArchitect() {
  const [activeView, setActiveView] = useState<'staff' | 'roles' | 'policies'>('staff');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const [staffList, setStaffList] = useState([
    { id: 'STF-001', name: 'Nimal Silva', email: 'nimal@mygolanka.com', role: 'Support Hero', status: 'Active', lastActive: '2 mins ago' },
    { id: 'STF-002', name: 'Tharushi Dev', email: 'tharushi@mygolanka.com', role: 'Technical Lead', status: 'Active', lastActive: '1 hr ago' },
    { id: 'STF-003', name: 'Kamal Finance', email: 'kamal@mygolanka.com', role: 'Finance Manager', status: 'Deactivated', lastActive: '1 week ago' },
  ]);

  const [customRoles, setCustomRoles] = useState([
    { id: 1, name: 'Support Hero', perms: { viewRevenue: false, manageVendors: true, sysLogs: false } },
    { id: 2, name: 'Finance Manager', perms: { viewRevenue: true, manageVendors: false, sysLogs: false } },
    { id: 3, name: 'Technical Lead', perms: { viewRevenue: false, manageVendors: false, sysLogs: true } },
  ]);

  const sendCredentials = async (stf: any) => {
    setIsSending(true);
    toast.loading(`Deploying encryption keys to ${stf.email}...`, { id: 'send' });
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 2500));
    
    setIsSending(false);
    toast.success("Packet Delivered. Staff Access Established.", { id: 'send' });
  };

  return (
    <div className="space-y-10">
       {/* Secondary Navigation */}
       <div className="flex bg-slate-100 p-1.5 rounded-2xl w-max gap-2 mx-auto shadow-inner border border-slate-200/50">
          <button onClick={() => setActiveView('staff')} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center ${activeView === 'staff' ? 'bg-white text-primary shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
             <Users className="w-4 h-4 mr-2"/> Personnel Matrix
          </button>
          <button onClick={() => setActiveView('roles')} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center ${activeView === 'roles' ? 'bg-white text-primary shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
             <ShieldCheck className="w-4 h-4 mr-2"/> Role Architect
          </button>
          <button onClick={() => setActiveView('policies')} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center ${activeView === 'policies' ? 'bg-white text-primary shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
             <Lock className="w-4 h-4 mr-2"/> Compliance
          </button>
       </div>

       <AnimatePresence mode="wait">
          {activeView === 'staff' && (
            <motion.div key="staff" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 glass-card overflow-hidden shadow-2xl border-white/60">
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white/50">
                     <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 flex items-center"><Users className="w-5 h-5 mr-3 text-primary"/> Active Battalion</h2>
                     <button onClick={() => setShowInviteModal(true)} className="btn-primary py-3 px-6 text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">
                        <UserPlus className="w-4 h-4 mr-2" /> Draft Operative
                     </button>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 border-b border-slate-100">
                              <th className="py-5 px-10">Operative</th>
                              <th className="py-5 px-10">Designation</th>
                              <th className="py-5 px-10 text-right">Master Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {staffList.map(stf => (
                             <tr key={stf.id} className="hover:bg-slate-50/50 transition duration-300">
                                <td className="py-5 px-10 flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-400">
                                      {stf.name[0]}
                                   </div>
                                   <div>
                                      <p className="font-extrabold text-slate-900 text-sm">{stf.name}</p>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase">{stf.email}</p>
                                   </div>
                                </td>
                                <td className="py-5 px-10 text-xs font-bold text-primary italic">{stf.role}</td>
                                <td className="py-5 px-10 text-right space-x-3">
                                   <button onClick={() => sendCredentials(stf)} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-success hover:border-success/30 transition-all shadow-sm"><Mail className="w-4 h-4"/></button>
                                   <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-secondary hover:border-secondary/30 transition-all shadow-sm"><Key className="w-4 h-4"/></button>
                                   <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-all shadow-sm"><Trash2 className="w-4 h-4"/></button>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>

               <div className="glass-card p-8 flex flex-col shadow-xl border-white/60">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-secondary mb-8 flex items-center"><Activity className="w-4 h-4 mr-2"/> Audit Intelligence</h2>
                  <div className="flex-1 flex flex-col items-center justify-center opacity-40 text-center">
                     <FileText className="w-12 h-12 text-slate-300 mb-6" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select an operative <br/>to view activity matrix</p>
                  </div>
               </div>
            </motion.div>
          )}

          {activeView === 'roles' && (
             <motion.div key="roles" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10 border-white/60 shadow-2xl">
                <div className="flex justify-between items-center mb-12">
                   <div>
                      <h2 className="text-xl font-display font-black text-slate-900">Permission Architect</h2>
                      <p className="text-xs text-slate-500 font-medium">Define exactly what each personnel tier can access.</p>
                   </div>
                   <button className="btn-secondary py-3 px-8 text-[10px] uppercase tracking-widest">+ Forge Role</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {customRoles.map(role => (
                      <div key={role.id} className="glass-card p-6 bg-slate-50/50 hover:bg-white transition-all group">
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-slate-800 text-sm">{role.name}</h3>
                            <Settings className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                         </div>
                         <div className="space-y-4">
                            <PermToggle label="Financial Data" active={role.perms.viewRevenue} />
                            <PermToggle label="Vendor Matrix" active={role.perms.manageVendors} />
                            <PermToggle label="System Infrastructure" active={role.perms.sysLogs} />
                         </div>
                      </div>
                   ))}
                </div>
             </motion.div>
          )}
       </AnimatePresence>

       {/* Sending Overlay (Lottie Micro-interaction) */}
       <AnimatePresence>
         {isSending && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center bg-white/80 backdrop-blur-md">
              <div className="text-center">
                 <div className="w-64 h-64 mx-auto mb-8">
                    <Lottie animationData={sendingAnimation} loop={true} />
                 </div>
                 <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Dispatching Packet</h2>
                 <p className="text-slate-500 font-medium mt-2">Encrypting and transmitting HQ credentials...</p>
                 <div className="w-64 h-1.5 bg-slate-100 rounded-full mx-auto mt-10 overflow-hidden">
                    <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 1, repeat: Infinity }} className="w-1/2 h-full bg-primary rounded-full shadow-lg" />
                 </div>
              </div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Invite Modal */}
       <AnimatePresence>
         {showInviteModal && (
           <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6" onClick={() => setShowInviteModal(false)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card max-w-md w-full p-12 shadow-2xl border-white/80" onClick={e => e.stopPropagation()}>
                 <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-sm">
                       <UserPlus className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Draft Operative</h2>
                    <p className="text-slate-500 font-medium">Establish a new headquarters connection.</p>
                 </div>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Bridge</label>
                       <input type="email" placeholder="hq@mygolanka.com" className="input-field w-full font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Role</label>
                       <select className="input-field w-full font-bold active:bg-white bg-white/50 cursor-pointer">
                          {customRoles.map(r => <option key={r.id}>{r.name}</option>)}
                       </select>
                    </div>
                    <button className="btn-primary w-full py-5 text-xs uppercase tracking-widest shadow-xl shadow-primary/20 mt-6" onClick={() => { setShowInviteModal(false); toast.success("Invitation Synced."); }}>
                       Dispatch Access Key
                    </button>
                 </div>
              </motion.div>
           </div>
         )}
       </AnimatePresence>
    </div>
  );
}

const PermToggle = ({ label, active }: any) => (
  <div className="flex justify-between items-center group">
     <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-800 transition-colors uppercase tracking-tight">{label}</span>
     <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${active ? 'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/30' : 'bg-slate-100 border-slate-200 text-transparent'}`}>
        <CheckSquare className="w-3 h-3" />
     </div>
  </div>
);
