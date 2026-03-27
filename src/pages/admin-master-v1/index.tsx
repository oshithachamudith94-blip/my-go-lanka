import Head from "next/head";
import ThemeToggler from "@/components/ThemeToggler";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { 
  ShieldAlert, Activity, Users, DollarSign, CheckCircle2, 
  XOctagon, FileText, Settings, Image as ImageIcon,
  AlertTriangle, Check, Ban, Search, Server, Bell,
  ChevronRight, ArrowRightLeft, CreditCard
} from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';
import { motion } from "framer-motion";

const entityData = [
  { name: 'Vendors', value: 340, color: '#FFD700' }, // Gold
  { name: 'Tourists', value: 1250, color: '#00BFFF' }, // Cyan
];

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');
  const [commission, setCommission] = useState(15);
  const [isAuthorized, setIsAuthorized] = useState(true); // Set to true for UI demo

  useEffect(() => {
    // Simulated Access Control
    // In production, we would decode the JWT and verify role === 'SUPER_ADMIN'
    const role = localStorage.getItem('role') || 'SUPER_ADMIN'; 
    if (role !== 'SUPER_ADMIN') {
      setIsAuthorized(false);
      router.push('/404');
    }
  }, [router]);

  if (!isAuthorized) return null;

  const navItems = [
    { name: 'Overview', icon: Activity },
    { name: 'Vendors', icon: ShieldAlert },
    { name: 'Finances', icon: DollarSign },
    { name: 'Users & Security', icon: Users },
    { name: 'UI Customizer', icon: ImageIcon },
    { name: 'System Logs', icon: Settings },
  ];

  const pendingVerification = [
    { name: 'Lanka Tours Ltd', category: 'Transport', date: 'Oct 24', status: 'Pending Review' },
    { name: 'Galle Retreat', category: 'Hotel', date: 'Oct 23', status: 'Missing Docs' },
  ];

  const recentActivity = [
    { time: '10 mins ago', action: 'New Vendor Registration', details: 'Kandy Express Tours' },
    { time: '1 hour ago', action: 'Payout Authorized', details: '$450 to Galle Face Hotel' },
    { time: '3 hours ago', action: 'User Banned', details: 'Suspicious booking patterns' },
    { time: '5 hours ago', action: 'Commission Updated', details: 'Global rate set to 15%' },
    { time: '1 day ago', action: 'System Alert', details: 'High database latency (Resolved)' },
  ];

  const cyanBlue = '#00BFFF';
  const gold = '#FFD700';

  return (
    <>
      <Head>
        <title>Master Control Panel | MyGoLanka</title>
      </Head>

      <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
        
        {/* SLIM SIDEBAR (Column 1) */}
        <aside className="w-20 lg:w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl flex flex-col z-20">
          <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
            <ShieldAlert className="w-8 h-8 text-[#FFD700] flex-shrink-0" />
            <span className="hidden lg:block ml-3 font-bold text-lg tracking-wider text-slate-100 uppercase">
              Command
            </span>
          </div>

          <nav className="flex-1 px-2 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center justify-center lg:justify-start px-3 py-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(0,191,255,0.1)]' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                  }`}
                  title={item.name}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : ''}`} />
                  <span className="hidden lg:block ml-3 font-medium text-sm">{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-800 flex justify-center lg:justify-start">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <span className="text-xs font-bold text-[#FFD700]">SA</span>
            </div>
            <div className="hidden lg:block ml-3">
              <p className="text-xs font-bold text-slate-200">Super Admin</p>
              <p className="text-[10px] text-cyan-400 font-mono">ID: AUT-990</p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTROL AREA (Column 2) */}
        <main className="flex-1 overflow-y-auto relative bg-[#060B19]">
          
          {/* subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-cyan-500/5 blur-[120px] rounded-full point-events-none z-0"></div>

          <header className="sticky top-0 z-30 h-16 bg-slate-900/40 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-wide text-slate-100">
              <span className="text-cyan-400">/</span> {activeTab.toUpperCase()}
            </h1>
            <div className="flex items-center space-x-4">
              <ThemeToggler />
              <button className="relative p-2 rounded-full hover:bg-slate-800 transition-colors">
                <Bell className="w-5 h-5 text-slate-300" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            </div>
          </header>

          <div className="p-8 space-y-8 relative z-10 max-w-6xl mx-auto">
            
            {/* 1. EXECUTIVE STATS (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 p-6 rounded-xl flex flex-col relative overflow-hidden group hover:border-[#FFD700]/30 transition-colors">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#FFD700]/5 rounded-full blur-xl group-hover:bg-[#FFD700]/10 transition-colors"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-[#FFD700]/10 rounded-lg"><DollarSign className="w-5 h-5 text-[#FFD700]" /></div>
                </div>
                <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Ecosystem Revenue</h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-slate-100">$15,400</span>
                  <span className="text-sm font-medium text-[#FFD700]">Total</span>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs text-slate-500">Platform Cut (15%)</span>
                  <span className="text-sm font-bold text-cyan-400">+$2,310</span>
                </div>
              </motion.div>

              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 p-6 rounded-xl flex flex-col relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                 <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-cyan-500/10 rounded-lg"><Users className="w-5 h-5 text-cyan-400" /></div>
                </div>
                <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Active Entities</h3>
                <div className="flex items-end justify-between mt-2">
                  <div>
                    <span className="text-2xl font-bold text-slate-100">1,590</span>
                    <span className="text-xs text-slate-500 ml-2">Total</span>
                  </div>
                  <div className="w-16 h-16">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={entityData} cx="50%" cy="50%" innerRadius={18} outerRadius={28} dataKey="value" stroke="none">
                          {entityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', fontSize: '12px' }} itemStyle={{ color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 p-6 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg"><Server className="w-5 h-5 text-emerald-400" /></div>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  </div>
                  <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">System Pulse</h3>
                  <div className="text-2xl font-bold text-slate-100">99.9%</div>
                </div>
                <div className="mt-2 flex items-center text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> All Services Online
                </div>
              </motion.div>

              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-[#FFD700]/5 backdrop-blur-sm border border-[#FFD700]/20 p-6 rounded-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/0 to-[#FFD700]/5 animate-pulse"></div>
                <div>
                  <div className="flex justify-between items-center mb-4 relative z-10">
                    <div className="p-2 bg-[#FFD700]/20 rounded-lg"><ShieldAlert className="w-5 h-5 text-[#FFD700]" /></div>
                    <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-md animate-bounce">ACTION REQ</span>
                  </div>
                  <h3 className="text-[#FFD700]/70 text-xs font-semibold uppercase tracking-wider mb-1">Pending Verification</h3>
                  <div className="text-3xl font-bold text-[#FFD700]">12</div>
                </div>
                <div className="mt-2 relative z-10">
                  <button className="text-xs font-bold text-[#FFD700] hover:text-[#fff] flex items-center transition-colors">
                    Review Queue <ChevronRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* 2 & 3. GATEKEEPER & ENGINE GRIDS */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* VENDOR APPROVAL (GATEKEEPER) */}
              <div className="xl:col-span-2 bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl flex flex-col">
                <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                  <h2 className="text-sm font-bold text-slate-100 flex items-center"><ShieldAlert className="w-4 h-4 mr-2 text-cyan-400" /> Vendor Quality Control</h2>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Search ID..." className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-cyan-500/50" />
                  </div>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/50 text-xs text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-5 font-semibold">Vendor Name</th>
                        <th className="py-3 px-5 font-semibold">Category</th>
                        <th className="py-3 px-5 font-semibold">Join Date</th>
                        <th className="py-3 px-5 font-semibold">Status</th>
                        <th className="py-3 px-5 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {pendingVerification.map((vendor, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors group">
                          <td className="py-4 px-5 font-medium text-sm text-slate-200">{vendor.name}</td>
                          <td className="py-4 px-5 text-sm text-slate-400">{vendor.category}</td>
                          <td className="py-4 px-5 text-sm text-slate-400">{vendor.date}</td>
                          <td className="py-4 px-5">
                            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border border-[#FFD700]/30 text-[#FFD700] bg-[#FFD700]/10 flex items-center w-fit">
                              <AlertTriangle className="w-3 h-3 mr-1.5" /> {vendor.status}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right space-x-2 flex justify-end">
                            <button title="Inspect Documents" className="p-1.5 bg-slate-800 rounded-md text-cyan-400 hover:bg-slate-700 transition-colors">
                              <FileText className="w-4 h-4" />
                            </button>
                            <button title="Approve" className="p-1.5 bg-emerald-500/10 rounded-md text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors">
                              <Check className="w-4 h-4" />
                            </button>
                            <button title="Reject" className="p-1.5 bg-red-500/10 rounded-md text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                              <XOctagon className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-slate-800 bg-slate-950/30 rounded-b-xl text-center">
                  <button className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">View All Verification Requests</button>
                </div>
              </div>

              {/* COMMISSION & FINANCIAL ENGINE */}
              <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl flex flex-col">
                <div className="p-5 border-b border-slate-800">
                   <h2 className="text-sm font-bold text-slate-100 flex items-center"><DollarSign className="w-4 h-4 mr-2 text-[#FFD700]" /> Financial Engine</h2>
                </div>
                <div className="p-5 space-y-6">
                  
                  {/* Commission Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Global Commission</span>
                      <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded">{commission}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" max="30" step="1" 
                      value={commission} 
                      onChange={(e) => setCommission(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-mono">
                      <span>5%</span><span>30%</span>
                    </div>
                  </div>

                  <hr className="border-slate-800" />

                  {/* Payout Requests */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Pending Withdrawals</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                        <div>
                          <p className="text-sm font-medium text-slate-200">Kandy City Hotel</p>
                          <p className="text-xs text-slate-500 font-mono">REQ-8992 • $1,250</p>
                        </div>
                        <button className="flex items-center px-3 py-1.5 bg-cyan-500 text-slate-950 text-xs font-bold rounded-md hover:bg-cyan-400 transition-colors">
                          <CreditCard className="w-3 h-3 mr-1" /> Pay
                        </button>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800">
                        <div>
                          <p className="text-sm font-medium text-slate-200">Amal Transport</p>
                          <p className="text-xs text-slate-500 font-mono">REQ-8993 • $320</p>
                        </div>
                        <button className="flex items-center px-3 py-1.5 bg-cyan-500 text-slate-950 text-xs font-bold rounded-md hover:bg-cyan-400 transition-colors">
                          <CreditCard className="w-3 h-3 mr-1" /> Pay
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* 4. GLOBAL SECURITY & CUSTOMIZER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl p-5 flex items-center justify-between group cursor-pointer hover:bg-slate-800/80 transition-colors">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-500/10 text-red-500 rounded-xl mr-4 group-hover:bg-red-500 group-hover:text-white transition-colors">
                      <Ban className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">User Moderation</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Ban, suspend, or trace suspicious accounts</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
               </div>

               <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl p-5 flex items-center justify-between group cursor-pointer hover:bg-slate-800/80 transition-colors">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl mr-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">UI & Asset Control</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Update homepage banners and static assets</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
               </div>
            </div>

          </div>
        </main>

        {/* RECENT ACTIVITY FEED (Column 3) */}
        <aside className="w-72 flex-shrink-0 border-l border-slate-800 bg-slate-900/30 hidden xl:flex flex-col z-20">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
              <Activity className="w-4 h-4 mr-2 text-cyan-500" />
              Live Feed
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-px before:bg-slate-800 last:before:hidden">
                <div className="absolute left-1 top-1.5 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(0,191,255,0.6)]"></div>
                <div className="text-[10px] text-slate-500 font-mono mb-0.5">{activity.time}</div>
                <div className="text-sm font-semibold text-slate-200">{activity.action}</div>
                <div className="text-xs text-slate-400 mt-1">{activity.details}</div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-800 text-center">
             <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">System Secure • Encrypted Link</span>
          </div>
        </aside>

      </div>
    </>
  );
}
