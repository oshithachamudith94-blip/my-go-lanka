import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, LayoutDashboard, Users, Car, DollarSign, 
  Settings, CheckCircle, XCircle, Search, Bell, LogOut, 
  TrendingUp, Terminal, Banknote, MapPin, FileText, Ban, 
  AlertTriangle, UserPlus, FileSearch, PieChart, Activity, 
  ShieldAlert, Sun, Moon, Link, Server, ChevronRight, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

import Sidebar from '../components/Sidebar';
import VendorsFullManager from '../components/admin/VendorsFullManager';
import OmnipotentSecurityGrid from '../components/admin/OmnipotentSecurityGrid';
import UICustomizerEngine from '../components/admin/UICustomizerEngine';
import OmniscientTerminal from '../components/admin/OmniscientTerminal';

const mockChartData = [
  { name: 'Mon', revenue: 4200, users: 240 },
  { name: 'Tue', revenue: 3800, users: 310 },
  { name: 'Wed', revenue: 5400, users: 420 },
  { name: 'Thu', revenue: 4900, users: 380 },
  { name: 'Fri', revenue: 7200, users: 510 },
  { name: 'Sat', revenue: 8100, users: 650 },
  { name: 'Sun', revenue: 6800, users: 480 },
];

export default function AdminMasterPanel() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Core Data State
  const [kpis, setKpis] = useState<any>({ totalRevenue: 15400, totalDrivers: 1590, activeTrips: 420, totalUsers: 8400 });
  const [systemState, setSystemState] = useState<any>({ 
    commission: 15, 
    logs: [], 
    payoutRequests: [
      { id: 'REQ-8992', vendorName: 'Kandy City Hotel', amount: 1258, status: 'Pending' },
      { id: 'REQ-8993', vendorName: 'Amal Transport', amount: 320, status: 'Pending' }
    ], 
    settings: {} 
  });
  const [drivers, setDrivers] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [liveFeed, setLiveFeed] = useState<any[]>([
    { id: 1, time: '10 mins ago', title: 'New Vendor Registered', desc: 'Kandy Express Tours', color: 'bg-primary' },
    { id: 2, time: '1 hour ago', title: 'Payout Authorized', desc: '$450 to Galle Face Hotel', color: 'bg-success' },
    { id: 3, time: '3 hours ago', title: 'User Banned', desc: 'Suspicious booking pattern', color: 'bg-red-500' },
    { id: 4, time: '5 hours ago', title: 'Commission Updated', desc: 'Global rate set to 15%', color: 'bg-secondary' },
    { id: 5, time: '1 day ago', title: 'System Alert', desc: 'High database latency (Resolved)', color: 'bg-primary' },
  ]);

  const [inspectDriver, setInspectDriver] = useState<any>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([
     { id: 1, title: 'Escrow Buffer Warning', desc: 'Reserve pool is approaching 15% lower limit threshold.', time: '10m ago', unread: true, icon: AlertTriangle, color: 'text-secondary', bg: 'bg-secondary/10' },
     { id: 2, title: 'KYC Document Pending', desc: 'Lotus Hotel uploaded required identity docs for matrix verification.', time: '1h ago', unread: true, icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
     { id: 3, title: 'CPU Matrix Anomaly', desc: 'Isolated server load spike registered across computing node 4.', time: '2h ago', unread: false, icon: Server, color: 'text-red-500', bg: 'bg-red-500/10' },
     { id: 4, title: 'Payout Synchronized', desc: '$4,100 disbursed to 12 active vendors globally.', time: '5h ago', unread: false, icon: Banknote, color: 'text-success', bg: 'bg-success/10' }
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.replace('/auth'); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'admin' && payload.role !== 'SUPER_ADMIN') {
        alert("ACCESS DENIED: Master Clearance Required.");
        router.replace('/auth'); return;
      }
      setAdminUser({ 
        id: payload.id, 
        name: localStorage.getItem("username") || 'Super Admin',
        photo: null
      });
      fetchMasterData(true);
    } catch { router.replace('/auth'); }
  }, []);

  useEffect(() => {
    if (router.isReady && router.query.tab) {
      const urlTab = router.query.tab as string;
      if (['overview', 'vendors', 'users', 'ui_customizer', 'logs'].includes(urlTab)) setActiveTab(urlTab);
    }
  }, [router.isReady, router.query.tab]);

  // Live Auto-Refresh Polling
  useEffect(() => {
    const interval = setInterval(() => {
       fetchMasterData(false);
    }, 15000); 
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push({ pathname: '/admin-master-v1', query: { tab: tabId } }, undefined, { shallow: true });
    fetchMasterData(true);
  };

  const addFeedEvent = (title: string, desc: string, color: string) => {
    setLiveFeed((prev: any) => [{ id: Date.now(), time: 'Just now', title, desc, color }, ...prev].slice(0, 50));
  };

  const fetchMasterData = async (showLoading = true) => {
    if(showLoading) setIsLoading(true);
    try {
      const [statsRes, driversRes, usersRes] = await Promise.all([
        fetch('http://localhost:5000/api/admin/stats').then((r: any) => r.json()),
        fetch('http://localhost:5000/api/admin/drivers').then((r: any) => r.json()),
        fetch('http://localhost:5000/api/admin/users').then((r: any) => r.json())
      ]);

      if (statsRes.kpis) setKpis((prev: any) => ({ ...prev, ...statsRes.kpis }));
      
      setSystemState((prev: any) => ({ 
         ...prev, 
         commission: statsRes.system?.commission || prev.commission,
         logs: statsRes.system?.logs || prev.logs,
         payoutRequests: (statsRes.system && statsRes.system.payoutRequests?.length > 0) ? statsRes.system.payoutRequests : prev.payoutRequests,
         settings: statsRes.system?.settings || prev.settings
      }));
      setDrivers(driversRes || []);
      setUsersList(usersRes || []);
    } catch (error) { 
      if(showLoading) toast.error("Live Data Feed Offline - Using Local Cache"); 
    }
    if(showLoading) setIsLoading(false);
  };

  const handleVerifyAction = async (id: string, newStatus: string, driverName: string) => {
    try {
      toast.loading(`Enforcing ${newStatus}...`, { id: "verify" });
      const res = await fetch(`http://localhost:5000/api/admin/verify/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, reason: 'Admin Manual Review' })
      });
      if (res.ok) {
        toast.success(`Vendor ${newStatus}!`, { id: "verify" });
        setInspectDriver(null);
        addFeedEvent(`Vendor ${newStatus}`, driverName, newStatus === 'Verified' ? 'bg-success' : 'bg-red-500');
        fetchMasterData(false); 
      } else toast.error("Action denied", { id: "verify" });
    } catch (e) { toast.error("Network Link Failed", { id: "verify" }); }
  };

  const updateCommission = async (val: number) => {
    setSystemState((prev: any) => ({ ...prev, commission: val }));
    try {
      await fetch('http://localhost:5000/api/admin/finances/commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate: val })
      });
      addFeedEvent('Commission Updated', `Global rate set to ${val}%`, 'bg-primary');
    } catch (e) {}
  };

  const authorizePayout = async (payoutId: string, vendorName: string, amount: number) => {
    try {
      toast.loading("Authorizing Transfer...", { id: "pay" });
      const res = await fetch(`http://localhost:5000/api/admin/finances/payout/${payoutId}`, { method: 'POST' });
      setSystemState((prev: any) => ({
         ...prev, 
         payoutRequests: prev.payoutRequests.filter((p: any) => p.id !== payoutId)
      }));
      toast.success(`Transfer Initiated!`, { id: "pay" });
      addFeedEvent('Payout Authorized', `$${amount} to ${vendorName}`, 'bg-success');
    } catch (e) {}
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth');
  };

  if (isLoading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-background text-primary">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
      <p className="font-display font-bold tracking-widest uppercase animate-pulse">Initializing Command HQ...</p>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background text-slate-700 font-sans selection:bg-primary/20">
      <Head><title>COMMAND HQ | MyGoLanka</title></Head>
      <Toaster position="top-right" />

      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        adminUser={adminUser}
        pendingVerifications={drivers.filter((d: any) => d.vendorProfile?.verificationStatus === 'Pending').length}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-y-auto relative flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white/60 backdrop-blur-xl border-b border-slate-200/60 px-10 py-6 flex justify-between items-center transition-all">
           <div className="flex items-center gap-3">
             <div className="p-2 bg-slate-100 rounded-lg lg:hidden">
               <LayoutDashboard className="w-5 h-5 text-slate-500" />
             </div>
             <h1 className="text-xl font-display font-extrabold tracking-tight text-slate-900 flex items-center">
               <span className="text-primary mr-2 opacity-50 font-light">/</span> 
               {activeTab === 'overview' ? 'Command Center Dashboard' : activeTab.split('_').join(' ').toUpperCase()}
             </h1>
           </div>

           <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center bg-slate-100/50 border border-slate-200 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary/30 transition-all">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input type="text" placeholder="Global Search..." className="bg-transparent border-0 outline-none text-xs w-48 font-medium" />
              </div>

               <div className="relative group">
                 <div onClick={() => setShowNotifications(!showNotifications)} className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/30 cursor-pointer transition-all shadow-sm group-hover:shadow-md">
                   <Bell className="w-5 h-5" />
                   {notifications.some((n: any) => n.unread) && <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white pointer-events-none"></div>}
                 </div>
                 
                 <AnimatePresence>
                   {showNotifications && (
                     <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="absolute right-0 mt-4 w-96 glass-card overflow-hidden z-50 p-2">
                       <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                          <h3 className="text-xs font-bold uppercase text-slate-500 tracking-widest flex items-center">
                            <Activity className="w-3.5 h-3.5 mr-2 text-primary"/> Notifications
                          </h3>
                          <button onClick={() => setNotifications(notifications.map(n => ({...n, unread: false})))} className="text-[10px] text-primary font-bold hover:underline">Clear All</button>
                       </div>
                       <div className="max-h-[400px] overflow-y-auto pr-1">
                          {notifications.map(n => (
                             <div key={n.id} className={`p-4 rounded-xl mb-1 flex gap-4 hover:bg-slate-50 transition cursor-pointer ${n.unread ? 'bg-primary/5' : ''}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.bg}`}><n.icon className={`w-5 h-5 ${n.color}`}/></div>
                                <div>
                                   <h4 className="text-sm font-bold text-slate-800">{n.title}</h4>
                                   <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.desc}</p>
                                   <span className="text-[10px] text-slate-400 mt-2 block font-medium uppercase">{n.time}</span>
                                </div>
                             </div>
                          ))}
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
           </div>
        </header>

        <div className="p-10 pb-32 max-w-[1600px] w-full mx-auto">
           {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                 
                 {/* KPI Row */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <KPICard 
                      title="Net Revenue" 
                      value={`$${kpis.totalRevenue?.toLocaleString()}`} 
                      trend="+14.2%" 
                      positive={true} 
                      icon={DollarSign} 
                      color="primary"
                    />
                    <KPICard 
                      title="Total Users" 
                      value={kpis.totalUsers?.toLocaleString() || "8,400"} 
                      trend="+5.3%" 
                      positive={true} 
                      icon={Users} 
                      color="secondary"
                    />
                    <KPICard 
                      title="Active Vendors" 
                      value={kpis.totalDrivers?.toLocaleString() || "1,590"} 
                      trend="+2.1%" 
                      positive={true} 
                      icon={Car} 
                      color="success"
                    />
                    <KPICard 
                      title="Pending KYC" 
                      value={drivers.filter((d: any) => d.vendorProfile?.verificationStatus === 'Pending').length} 
                      trend="Requires Action" 
                      positive={false} 
                      icon={ShieldAlert} 
                      color="red"
                      onClick={() => handleTabChange('vendors')}
                    />
                 </div>

                 {/* Charts Section */}
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 glass-card p-8 min-h-[450px] flex flex-col">
                       <div className="flex justify-between items-center mb-8">
                          <div>
                             <h2 className="text-lg font-extrabold text-slate-900">Revenue Analytics</h2>
                             <p className="text-xs text-slate-500 font-medium">Performance over the last 7 days</p>
                          </div>
                          <div className="flex gap-2">
                             <button className="px-3 py-1.5 text-[10px] font-bold bg-slate-100 rounded-lg text-slate-600">Daily</button>
                             <button className="px-3 py-1.5 text-[10px] font-bold bg-primary text-white rounded-lg shadow-lg shadow-primary/20">Weekly</button>
                          </div>
                       </div>
                       <div className="flex-1 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                   <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#005999" stopOpacity={0.1}/>
                                      <stop offset="95%" stopColor="#005999" stopOpacity={0}/>
                                   </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} dx={-10} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} 
                                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#005999" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                             </AreaChart>
                          </ResponsiveContainer>
                       </div>
                    </div>

                    <div className="glass-card p-8 flex flex-col">
                       <h2 className="text-lg font-extrabold text-slate-900 mb-2">Platform Pulse</h2>
                       <p className="text-xs text-slate-500 font-medium mb-8">System reliability metrics</p>
                       
                       <div className="space-y-8 flex-1">
                          <PulseItem label="API Node Stability" value="99.9%" color="success" />
                          <PulseItem label="Payment Gateway" value="Active" color="primary" />
                          <PulseItem label="Database Latency" value="12ms" color="success" />
                          
                          <div className="pt-6 border-t border-slate-100 mt-auto">
                             <div className="flex justify-between items-center mb-4">
                               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Commission</span>
                               <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-black">{systemState.commission}%</span>
                             </div>
                             <input 
                               type="range" min="5" max="30" step="1" 
                               value={systemState.commission} 
                               onChange={(e: any) => setSystemState({...systemState, commission: Number(e.target.value)})}
                               onMouseUp={() => updateCommission(systemState.commission)}
                               className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary" 
                             />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Bottom Row */}
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 glass-card overflow-hidden flex flex-col">
                       <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                          <h2 className="text-lg font-extrabold text-slate-900">Recent Verifications</h2>
                          <button onClick={() => handleTabChange('vendors')} className="text-xs font-bold text-primary hover:underline">Manage All</button>
                       </div>
                       <div className="overflow-x-auto">
                          <table className="w-full text-left">
                             <thead>
                                <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50/50">
                                   <th className="px-8 py-4">Vendor</th>
                                   <th className="px-8 py-4">Status</th>
                                   <th className="px-8 py-4 text-right">Master Actions</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                                {drivers.filter((d: any) => d.vendorProfile?.verificationStatus === 'Pending').slice(0, 4).map((d: any) => (
                                   <tr key={d._id} className="hover:bg-slate-50/50 transition">
                                      <td className="px-8 py-5">
                                         <div className="flex items-center">
                                            <div className="w-9 h-9 rounded-full bg-slate-100 mr-3 border border-slate-200 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-400">
                                               {d.vendorProfile?.profilePhoto ? <img src={d.vendorProfile.profilePhoto} className="w-full h-full object-cover" /> : d.name[0]}
                                            </div>
                                            <div>
                                               <p className="text-sm font-bold text-slate-800">{d.name}</p>
                                               <p className="text-[10px] text-slate-400 font-medium">{d.email}</p>
                                            </div>
                                         </div>
                                      </td>
                                      <td className="px-8 py-5">
                                         <span className="px-3 py-1 bg-secondary/10 text-secondary text-[10px] font-black uppercase rounded-full border border-secondary/20 tracking-tighter shadow-sm animate-pulse">Pending Review</span>
                                      </td>
                                      <td className="px-8 py-5 text-right space-x-2">
                                         <button onClick={() => handleVerifyAction(d._id, 'Verified', d.name)} className="p-2 bg-success/10 text-success hover:bg-success hover:text-white rounded-lg transition-all border border-success/20 shadow-sm"><CheckCircle className="w-4 h-4"/></button>
                                         <button onClick={() => handleVerifyAction(d._id, 'Rejected', d.name)} className="p-2 bg-red-50/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-red-500/20 shadow-sm"><XCircle className="w-4 h-4"/></button>
                                      </td>
                                   </tr>
                                ))}
                                {drivers.filter((d: any) => d.vendorProfile?.verificationStatus === 'Pending').length === 0 && (
                                   <tr>
                                      <td colSpan={3} className="py-20 text-center text-slate-400 font-medium italic">All verification requests cleared.</td>
                                   </tr>
                                )}
                             </tbody>
                          </table>
                       </div>
                    </div>

                    <div className="glass-card p-8 flex flex-col">
                       <h2 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center">
                         <Activity className="w-5 h-5 mr-2 text-primary" /> System Live Feed
                       </h2>
                       <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                          <AnimatePresence>
                            {liveFeed.map((feed) => (
                               <motion.div key={feed.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4 relative">
                                  <div className={`mt-1.5 w-2 h-2 rounded-full ${feed.color} shrink-0 shadow-lg shadow-current/50`}></div>
                                  <div>
                                     <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-xs font-extrabold text-slate-800">{feed.title}</h4>
                                        <span className="text-[9px] font-medium text-slate-400 ml-auto whitespace-nowrap">{feed.time}</span>
                                     </div>
                                     <p className="text-[11px] text-slate-500 leading-relaxed">{feed.desc}</p>
                                  </div>
                               </motion.div>
                            ))}
                          </AnimatePresence>
                       </div>
                    </div>
                 </div>

              </motion.div>
           )}

           {/* Other Tabs Rendering */}
           <div className="relative z-10">
             {activeTab === 'vendors' && <VendorsFullManager drivers={drivers} refresh={() => fetchMasterData(false)} />}
             {activeTab === 'users' && <OmnipotentSecurityGrid usersList={usersList} refresh={() => fetchMasterData(false)} />}
             {activeTab === 'ui_customizer' && <UICustomizerEngine initialSettings={systemState.settings} onSave={(s: any) => setSystemState((prev: any) => ({ ...prev, settings: s }))} />}
             {activeTab === 'logs' && <OmniscientTerminal />}
           </div>

        </div>
      </main>

      {/* Profile Overlay Effect */}
      <AnimatePresence>
        {inspectDriver && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-6">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card max-w-2xl w-full p-8 relative shadow-2xl">
               <button onClick={() => setInspectDriver(null)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"><XCircle className="w-6 h-6 text-slate-400" /></button>
               <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center"><ShieldCheck className="w-7 h-7 mr-3 text-primary" /> Vendor Documentation</h2>
               <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="aspect-square bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-4">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">License Front</p>
                     {inspectDriver.vendorProfile?.drivingLicenseFront ? <img src={inspectDriver.vendorProfile.drivingLicenseFront} className="w-full h-full object-contain cursor-pointer" onClick={() => setZoomImage(inspectDriver.vendorProfile.drivingLicenseFront)} /> : <FileSearch className="w-10 h-10 text-slate-300" />}
                  </div>
                  <div className="aspect-square bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-4">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">License Back</p>
                     {inspectDriver.vendorProfile?.drivingLicenseBack ? <img src={inspectDriver.vendorProfile.drivingLicenseBack} className="w-full h-full object-contain cursor-pointer" onClick={() => setZoomImage(inspectDriver.vendorProfile.drivingLicenseBack)} /> : <FileSearch className="w-10 h-10 text-slate-300" />}
                  </div>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => handleVerifyAction(inspectDriver._id, 'Rejected', inspectDriver.name)} className="flex-1 py-4 bg-red-50 text-red-500 font-bold rounded-2xl border border-red-100 hover:bg-red-500 hover:text-white transition-all">Reject Materials</button>
                  <button onClick={() => handleVerifyAction(inspectDriver._id, 'Verified', inspectDriver.name)} className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">Fully Approve Vendor</button>
               </div>
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      {zoomImage && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-10" onClick={() => setZoomImage(null)}>
           <img src={zoomImage} className="max-w-full max-h-full rounded-2xl shadow-2xl" />
        </div>
      )}
    </div>
  );
}

const KPICard = ({ title, value, trend, positive, icon: Icon, color, onClick }: any) => {
  const colorMap: any = {
    primary: 'bg-primary/10 text-primary border-primary/20 shadow-primary/5',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20 shadow-secondary/5',
    success: 'bg-success/10 text-success border-success/20 shadow-success/5',
    red: 'bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/5',
  };

  return (
    <div onClick={onClick} className={`glass-card p-6 flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${onClick ? 'cursor-pointer active:scale-95' : ''}`}>
       <div className="flex justify-between items-start mb-6">
          <div className={`p-3 rounded-2xl border ${colorMap[color]}`}>
             <Icon className="w-6 h-6" />
          </div>
          <div className={`flex items-center text-[10px] font-black px-2.5 py-1 rounded-full border ${positive ? 'bg-success/10 text-success border-success/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
             {positive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
             {trend}
          </div>
       </div>
       <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
       </div>
    </div>
  );
};

const PulseItem = ({ label, value, color }: any) => {
  const colorMap: any = {
    success: 'bg-success',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
  };

  return (
    <div className="flex items-center justify-between">
       <div className="flex items-center">
          <div className={`w-2.5 h-2.5 rounded-full ${colorMap[color]} mr-3 animate-pulse shadow-[0_0_8px_currentColor]`}></div>
          <span className="text-sm font-bold text-slate-600">{label}</span>
       </div>
       <span className="text-sm font-black text-slate-900">{value}</span>
    </div>
  );
};
