import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShieldCheck, XCircle, FileText, Download, 
  Trash2, Edit, Car, TrendingUp, AlertOctagon, CheckCircle, ChevronRight, CheckSquare, Square, FileWarning, Wallet, Activity, ShieldAlert, Star, ShieldBan, UploadCloud, Users, Mail, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function VendorsFullManager({ drivers, refresh, isLoading }: { drivers: any[], refresh: () => void, isLoading?: boolean }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [simLoading, setSimLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setSimLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleVerifyAction = async (id: string, newStatus: string) => {
    setActionLoading(true);
    try {
      toast.loading(`Enforcing ${newStatus}...`, { id: "verify" });
      const res = await fetch(`http://localhost:5000/api/admin/verify/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, reason: 'Admin Manual Override' })
      });
      if (res.ok) {
        toast.success(`Vendor ${newStatus}!`, { id: "verify" });
        refresh(); 
      } else toast.error("Action denied", { id: "verify" });
    } catch (e) { toast.error("Network Link Failed", { id: "verify" }); }
    setActionLoading(false);
  };

  const filteredDrivers = drivers.filter((d: any) => {
    const matchesSearch = d.name?.toLowerCase().includes(searchQuery.toLowerCase()) || d.email?.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === 'All') return matchesSearch;
    return matchesSearch && d.vendorProfile?.verificationStatus === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'Verified') return "bg-success/10 text-success border-success/20 shadow-sm";
    if (status === 'Pending') return "bg-secondary/10 text-secondary border-secondary/20 shadow-sm animate-pulse";
    if (status === 'Suspended') return "bg-red-500/10 text-red-500 border-red-500/20";
    return "bg-slate-100 text-slate-500 border-slate-200";
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-20">
      
      {/* Metric Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <MetricCard icon={Users} label="Total Fleet" value={drivers.length} trend="+12.5%" positive={true} color="primary" />
         <MetricCard icon={ShieldAlert} label="KYC Pending" value={drivers.filter(d => d.vendorProfile?.verificationStatus === 'Pending').length} trend="High Priority" positive={false} color="secondary" />
         <MetricCard icon={Wallet} label="Total Volume" value="$42,850" trend="+8.1%" positive={true} color="success" />
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-6">
         <div className="flex-1 glass-card p-2 flex items-center relative overflow-hidden border-slate-200/60 shadow-lg">
            <Search className="absolute left-6 w-5 h-5 text-slate-400"/>
            <input type="text" placeholder="Search entity database..." value={searchQuery} onChange={(e: any)=>setSearchQuery(e.target.value)} className="w-full bg-transparent border-0 pl-14 pr-4 py-4 text-sm font-bold outline-none text-slate-900 focus:ring-0 placeholder-slate-400" />
         </div>
         <div className="flex gap-4">
           <select value={filterStatus} onChange={(e: any) => setFilterStatus(e.target.value)} className="glass-card px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-500 outline-none focus:border-primary/50 cursor-pointer shadow-lg border-slate-200/60 appearance-none bg-white">
              <option value="All">All Entities</option>
              <option value="Verified">Verified HQ</option>
              <option value="Pending">Pending Review</option>
              <option value="Suspended">Blacklisted</option>
           </select>
           <button className="btn-primary px-10 flex items-center shadow-lg shadow-primary/20 text-xs uppercase tracking-widest">
              <Download className="w-4 h-4 mr-2"/> Export Data
           </button>
         </div>
      </div>

      {/* Main Vendor Matrix */}
      <div className="glass-card overflow-hidden shadow-2xl border-white/60">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100/60">
                     <th className="py-6 px-10">Entity Subject</th>
                     <th className="py-6 px-10">Communications</th>
                     <th className="py-6 px-10">Lifecycle Status</th>
                     <th className="py-6 px-10 text-right">Overrides</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {filteredDrivers.map((d: any) => (
                    <tr key={d._id} className="hover:bg-slate-50/50 transition-all group cursor-pointer" onClick={() => setSelectedDriver(d)}>
                      <td className="py-6 px-10">
                         <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm shadow-slate-200/50 group-hover:border-primary/40 transition-colors">
                               <img src={d.vendorProfile?.profilePhoto || `https://ui-avatars.com/api/?name=${d.name}&background=f8fafc&color=005999&bold=true`} className="w-full h-full object-cover"/>
                            </div>
                            <div>
                               <p className="font-extrabold text-slate-900 text-sm">{d.name}</p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: {d._id.slice(-6).toUpperCase()}</p>
                            </div>
                         </div>
                      </td>
                      <td className="py-6 px-10 text-[11px] font-bold text-slate-500 uppercase tracking-tighter"><Mail className="w-3.5 h-3.5 inline mr-2 text-primary/30"/> {d.email}</td>
                      <td className="py-6 px-10">
                         <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border ${getStatusBadge(d.vendorProfile?.verificationStatus || 'Not Submitted')}`}>
                            {d.vendorProfile?.verificationStatus || 'N/A'}
                         </span>
                      </td>
                      <td className="py-6 px-10 text-right space-x-3">
                         <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary/40 transition-all shadow-sm"><Eye className="w-4 h-4"/></button>
                         <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 hover:border-red-500/40 transition-all shadow-sm"><ShieldBan className="w-4 h-4"/></button>
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Vendor Insight Modal */}
      <AnimatePresence>
        {selectedDriver && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6" onClick={() => setSelectedDriver(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden relative border-white/80" onClick={e => e.stopPropagation()}>
               <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white/50">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-[2rem] bg-slate-100 border border-slate-200 overflow-hidden shadow-lg p-2 bg-white">
                       <img src={selectedDriver.vendorProfile?.profilePhoto || `https://ui-avatars.com/api/?name=${selectedDriver.name}&background=f8fafc&color=005999&bold=true`} className="w-full h-full object-cover rounded-[1.5rem]"/>
                    </div>
                    <div>
                       <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">{selectedDriver.name}</h2>
                       <p className="text-primary font-black text-[11px] uppercase tracking-[0.3em] mt-1">{selectedDriver.role} ARCHIVE</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedDriver(null)} className="w-12 h-12 flex items-center justify-center bg-slate-100 border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-500/30 rounded-2xl transition-all"><XCircle className="w-6 h-6" /></button>
               </div>

               <div className="flex-1 overflow-y-auto p-12 space-y-12 bg-white/30 custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fleet Intelligence</label>
                        <div className="glass-card p-6 border-slate-100 shadow-sm space-y-4 bg-white/60">
                           {selectedDriver.vendorProfile?.vehicles?.map((v: any, i: number) => (
                              <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-200/50">
                                 <div>
                                    <p className="font-extrabold text-sm text-slate-800">{v.make} {v.model}</p>
                                    <p className="text-[10px] font-bold text-primary tracking-widest mt-0.5">{v.plateNumber}</p>
                                 </div>
                                 <span className="text-xs font-black text-slate-400">{v.year}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Assets</label>
                        <div className="grid grid-cols-2 gap-4">
                           <AssetPreview label="DL Front" url={selectedDriver.vendorProfile?.drivingLicenseFront} />
                           <AssetPreview label="DL Rear" url={selectedDriver.vendorProfile?.drivingLicenseBack} />
                           <AssetPreview label="Revenue" url={selectedDriver.vendorProfile?.revenueLicense} />
                           <AssetPreview label="Insurance" url={selectedDriver.vendorProfile?.vehicleInsurance} />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
                  <button onClick={() => handleVerifyAction(selectedDriver._id, 'Rejected')} className="px-8 py-4 bg-red-50 text-red-500 border border-red-100 rounded-2xl font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all text-xs">Flag Identity</button>
                  <button onClick={() => handleVerifyAction(selectedDriver._id, 'Verified')} className="px-12 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/20 text-xs hover:scale-[1.02]">Authorize Vendor</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const MetricCard = ({ icon: Icon, label, value, trend, positive, color }: any) => {
  const colorMap: any = {
    primary: 'bg-primary/5 text-primary border-primary/20',
    secondary: 'bg-secondary/5 text-secondary border-secondary/20',
    success: 'bg-success/5 text-success border-success/20',
  };

  return (
    <div className="glass-card p-10 flex flex-col justify-between group border-white/80 shadow-xl min-h-[220px]">
       <div className="flex justify-between items-start">
          <div className={`p-4 rounded-3xl border ${colorMap[color]}`}>
             <Icon className="w-8 h-8" />
          </div>
          <div className={`text-[10px] font-black px-3 py-1.5 rounded-full border ${positive ? 'bg-success/10 text-success border-success/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
             {trend}
          </div>
       </div>
       <div className="mt-8">
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
          <h3 className="text-4xl font-display font-black text-slate-900 tracking-tight">{value}</h3>
       </div>
    </div>
  );
};

const AssetPreview = ({ label, url }: any) => (
  <div className="space-y-2">
     <p className="text-[9px] font-black text-slate-400 text-center uppercase tracking-widest">{label}</p>
     <div className="aspect-square bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-1.5 group cursor-zoom-in">
        {url ? <img src={url} className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100" /> : <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-xl"><FileWarning className="w-6 h-6 text-slate-300" /></div>}
     </div>
  </div>
);
