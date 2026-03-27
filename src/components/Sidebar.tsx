import React from 'react';
import { 
  Activity, ShieldAlert, Users, PieChart, Settings, 
  ChevronRight, LogOut, ShieldCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  adminUser: any;
  pendingVerifications: number;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  adminUser, 
  pendingVerifications,
  onLogout 
}) => {
  const sidemenu = [
    { id: 'overview', name: 'Overview', icon: Activity },
    { id: 'vendors', name: 'Vendors', icon: ShieldAlert, badge: pendingVerifications },
    { id: 'users', name: 'Users & Security', icon: Users },
    { id: 'ui_customizer', name: 'UI Customizer', icon: PieChart },
    { id: 'logs', name: 'System Logs', icon: Settings },
  ];

  return (
    <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200 flex flex-col z-30 shadow-xl shrink-0 transition-all duration-300">
      <div className="p-8 flex items-center mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mr-4 shadow-inner ring-1 ring-primary/20">
          <ShieldCheck className="w-7 h-7 text-primary animate-pulse" />
        </div>
        <div>
          <span className="text-xl font-extrabold tracking-tight text-slate-800 font-display">COMMAND</span>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-1">HQ V2.0</p>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-2">
        <p className="text-[10px] font-black text-slate-400 px-4 mb-4 uppercase tracking-[0.2em]">Navigation Matrix</p>
        {sidemenu.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)} 
            className={`w-full flex items-center px-4 py-3.5 rounded-2xl font-bold text-sm transition-all relative group ${
              activeTab === item.id 
              ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
              : 'text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-100 hover:text-slate-800'
            }`}
          >
            <item.icon className={`w-5 h-5 mr-3 transition-colors ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`} /> 
            {item.name}
            {item.badge ? (
              <span className={`ml-auto px-2 py-0.5 text-[10px] rounded-full border transition-colors font-black ${
                activeTab === item.id 
                ? 'bg-white/20 text-white border-white/30' 
                : 'bg-secondary/10 text-secondary border-secondary/20'
              }`}>
                {item.badge}
              </span>
            ) : null}
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </nav>
      
      <div className="p-8 mt-auto flex flex-col space-y-4">
        <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex items-center group cursor-pointer hover:bg-white hover:shadow-md transition-all">
           <div className="w-11 h-11 rounded-xl bg-slate-200 border border-white mr-4 flex items-center justify-center text-xs font-black text-slate-500 overflow-hidden shadow-sm">
             {adminUser?.photo ? <img src={adminUser.photo} className="w-full h-full object-cover" /> : 'SA'}
           </div>
           <div className="flex-1 overflow-hidden">
              <p className="font-bold text-sm text-slate-800 truncate">{adminUser?.name || 'Super Admin'}</p>
              <p className="text-[10px] text-primary/80 uppercase tracking-widest font-black truncate">ID: {adminUser?.id?.slice(-7).toUpperCase() || 'AUT-330'}</p>
           </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center px-4 py-3 rounded-2xl font-bold text-sm text-red-500 bg-red-50/50 hover:bg-red-500 hover:text-white border border-red-100 hover:border-red-500 transition-all group"
        >
          <LogOut className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
