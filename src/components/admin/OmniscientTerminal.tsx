import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Download, Trash2, Pause, Play, Search, 
  Cpu, Database, Server, Activity, AlertTriangle, 
  ShieldCheck, MapPin, Monitor, Clock, X, TerminalSquare, AlertCircle, FileJson, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

type LogType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

interface LogEntry {
  id: string;
  timestamp: Date;
  type: LogType;
  message: string;
  source: string;
  stack?: string;
}

const mockMessages = {
  INFO: [
    { msg: 'Incoming HTTP GET request to /api/auth/profile', src: 'Frontend' },
    { msg: 'User session validated via JWT signature', src: 'Authentication' },
    { msg: 'Serving static assets for route /admin-master-v1', src: 'Nextjs' },
    { msg: 'Cron job: Cleanup expired OTPs initiated', src: 'Worker' }
  ],
  SUCCESS: [
    { msg: 'MongoDB replica set connected successfully', src: 'Database' },
    { msg: 'Payment payout REQ-8992 authorized via Stripe', src: 'Finances' },
    { msg: 'Vendor documents verified and cached', src: 'S3-Storage' },
    { msg: 'Memory garbage collection completed globally', src: 'System' }
  ],
  WARNING: [
    { msg: 'Slow query detected resolving Vendor Matrix (>2000ms)', src: 'Database' },
    { msg: 'High CPU threshold approaching (78% load)', src: 'System' },
    { msg: 'Multiple failed login attempts from 192.168.1.45', src: 'Firewall' },
    { msg: 'Rate limit approaching for endpoint /api/drivers', src: 'RateLimiter' }
  ],
  ERROR: [
    { msg: 'Database connection interrupted (ERR_ECONNREFUSED)', src: 'Database', stack: 'Error: connect ECONNREFUSED 127.0.0.1:27017\n    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1494:16)\n    at mongoose.connect (server.js:15:1)' },
    { msg: 'Payout failure: Insufficient platform escrow funds', src: 'Finances', stack: 'StripeError: amount_too_large\n    at Payout.create (stripe.js:45)\n    at Object.authorizePayout (admin.js:122:5)' },
    { msg: 'Unhandled Promise Rejection: Cannot read properties of null', src: 'Frontend', stack: 'TypeError: Cannot read properties of null (reading "vendorProfile")\n    at VendorsFullManager (VendorsFullManager.tsx:210:35)' }
  ]
};

export default function OmniscientTerminal() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<LogType | 'ALL'>('ALL');
  const [selectedError, setSelectedError] = useState<LogEntry | null>(null);

  // Health Stats
  const [pulseProps, setPulseProps] = useState({ cpu: 12, ram: 45, latency: 42, dbOnline: true });

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  const generateMockLog = () => {
    const dice = Math.random();
    const type: LogType = dice > 0.95 ? 'ERROR' : dice > 0.85 ? 'WARNING' : dice > 0.6 ? 'SUCCESS' : 'INFO';
    const msgArray = mockMessages[type];
    const picked: any = msgArray[Math.floor(Math.random() * msgArray.length)];
    return {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      type,
      message: picked.msg,
      source: picked.src,
      ...(picked.stack ? { stack: picked.stack } : {})
    };
  };

  // Auto-generator effect
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setLogs(prev => {
        const newLog = generateMockLog();
        return [...prev, newLog].slice(-1000); // Keep last 1000 logs
      });
    }, Math.random() * 2000 + 500); // Random interval between 0.5s and 2.5s
    return () => clearInterval(interval);
  }, [isPaused]);

  // Initial populate
  useEffect(() => {
    const initialLogs: LogEntry[] = Array.from({ length: 15 }).map(generateMockLog);
    setLogs(initialLogs);
  }, []);

  // Pulse updater
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseProps({
        cpu: Math.floor(Math.random() * 25) + 5,
        ram: Math.floor(Math.random() * 20) + 30,
        latency: Math.floor(Math.random() * 80) + 15,
        dbOnline: Math.random() > 0.05 // 95% chance to remain online
      });
    }, 2000);
    return () => clearInterval(pulseInterval);
  }, []);

  // Auto-scroll logic to bottom
  useEffect(() => {
    if (!isPaused && terminalContainerRef.current) {
      const container = terminalContainerRef.current;
      const isNearBottom = container.scrollHeight - container.clientHeight - container.scrollTop < 150;
      if (isNearBottom) {
        // By directly setting scrollTop, we avoid scrollIntoView() moving the parent page wrapper!
        container.scrollTo({ top: container.scrollHeight, behavior: 'auto' });
      }
    }
  }, [logs, isPaused]);

  const clearLogs = () => {
    setLogs([]);
    toast.success('Omniscient Terminal Wiped');
  };

  const exportLogs = (format: 'txt' | 'json') => {
    if (logs.length === 0) {
      toast.error('Terminal buffer is empty');
      return;
    }
    toast.loading(`Translating buffer to .${format}...`, { id: "export" });
    
    let content = '';
    if (format === 'json') {
      content = JSON.stringify(logs, null, 2);
    } else {
      content = logs.map(l => `[${l.timestamp.toISOString()}] [${l.type}] [${l.source}] ${l.message}${l.stack ? '\n' + l.stack : ''}`).join('\n');
    }

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omniscient_logs_${new Date().getTime()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Data Payload Exported`, { id: "export" });
  };

  const filteredLogs = logs.filter(l => 
    (filterType === 'ALL' || l.type === filterType) &&
    (l.message.toLowerCase().includes(searchQuery.toLowerCase()) || l.source.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getLogColor = (type: LogType) => {
    switch (type) {
      case 'INFO': return 'text-cyan-400';
      case 'SUCCESS': return 'text-emerald-400';
      case 'WARNING': return 'text-yellow-400';
      case 'ERROR': return 'text-rose-500 font-bold';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:flex-row gap-6 pb-20 h-full text-gray-200">
      
      {/* 1. THE MASTER TERMINAL (Left 65%) */}
      <div className="flex-1 bg-[#050810] border border-[#1e293b] rounded-3xl shadow-2xl flex flex-col overflow-hidden relative group">
         {/* Top Terminal Controls */}
         <div className="bg-[#0b1121] border-b border-[#1e293b] p-4 flex flex-wrap gap-4 items-center justify-between z-10 relative">
            <div className="flex items-center space-x-2 text-cyan-500 font-black tracking-[0.2em] text-[10px] uppercase">
               <TerminalSquare className="w-5 h-5 mr-1"/>
               Omniscient Feed
               <span className="ml-2 px-1.5 py-0.5 bg-cyan-500/10 rounded border border-cyan-500/30 text-[8px]">{logs.length} BUFFERS</span>
            </div>
            
            <div className="flex-1 flex items-center max-w-sm relative">
               <Search className="absolute left-3 w-4 h-4 text-gray-500"/>
               <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Query terminal stream..." className="w-full bg-[#050810] border border-[#1e293b] text-gray-300 font-mono text-xs pl-9 pr-3 py-2 rounded-lg outline-none focus:border-cyan-500 transition-colors"/>
            </div>

            <div className="flex bg-[#050810] border border-[#1e293b] rounded-lg p-1 overflow-hidden">
               {['ALL', 'INFO', 'SUCCESS', 'WARNING', 'ERROR'].map((type: any) => (
                  <button key={type} onClick={() => setFilterType(type)} className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded transition-colors ${filterType === type ? 'bg-[#1e293b] text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                     {type}
                  </button>
               ))}
            </div>

            <div className="flex space-x-2 border-l border-[#1e293b] pl-4">
               <button onClick={() => setIsPaused(!isPaused)} className={`p-2 rounded-lg border transition-all ${isPaused ? 'bg-amber-500/20 border-amber-500/50 text-amber-500' : 'bg-[#050810] border-[#1e293b] text-cyan-500 hover:bg-cyan-500/10'}`} title="Pause/Play Stream">
                  {isPaused ? <Play className="w-4 h-4"/> : <Pause className="w-4 h-4"/>}
               </button>
               <button onClick={clearLogs} className="p-2 rounded-lg border border-[#1e293b] bg-[#050810] text-gray-400 hover:text-rose-500 hover:border-rose-500/50 transition-all" title="Clear Buffer"><Trash2 className="w-4 h-4"/></button>
               <div className="relative group/export flex">
                  <button className="p-2 rounded-lg border border-[#1e293b] bg-[#050810] text-gray-400 hover:text-white transition-all peer" title="Export Payload"><Download className="w-4 h-4"/></button>
                  <div className="absolute right-0 top-full mt-2 bg-[#0b1121] border border-[#1e293b] rounded-lg shadow-xl opacity-0 scale-95 pointer-events-none group-hover/export:opacity-100 group-hover/export:scale-100 group-hover/export:pointer-events-auto transition-all z-20 flex flex-col p-1 w-24">
                     <button onClick={() => exportLogs('txt')} className="flex items-center px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-[#1e293b] rounded"><FileText className="w-3 h-3 mr-2"/> .TXT</button>
                     <button onClick={() => exportLogs('json')} className="flex items-center px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-[#1e293b] rounded"><FileJson className="w-3 h-3 mr-2"/> .JSON</button>
                  </div>
               </div>
            </div>
         </div>

         {/* Terminal Window */}
         <div ref={terminalContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 font-mono text-[11px] leading-relaxed relative bg-[#010308] custom-scrollbar">
            {/* Hacker Scanline Effect */}
            <div className="pointer-events-none absolute inset-0 z-10 scanlines opacity-30 mix-blend-overlay"></div>
            
            <div className="space-y-1 relative z-0">
               {filteredLogs.map((log) => (
                  <div key={log.id} className="flex hover:bg-white/[0.03] px-2 py-0.5 rounded transition-colors break-words text-wrap">
                     <span className="text-gray-600 mr-4 shrink-0 selection:bg-cyan-500/30">[{log.timestamp.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit', fractionalSecondDigits: 3 })}]</span>
                     <span className={`w-20 shrink-0 font-bold tracking-widest ${getLogColor(log.type)}`}>[{log.type}]</span>
                     <span className="text-gray-500 mr-2 shrink-0">[{log.source}]</span>
                     <span className={`flex-1 break-words ${log.type === 'ERROR' ? 'text-rose-400 cursor-pointer underline decoration-rose-500/30 decoration-dashed hover:decoration-rose-500' : 'text-gray-300'}`} onClick={() => log.type === 'ERROR' && setSelectedError(log)}>
                        {log.message}
                     </span>
                  </div>
               ))}
               <div ref={terminalEndRef} className="h-4"></div>
            </div>
            
            {logs.length === 0 && (
               <div className="absolute inset-0 flex items-center justify-center text-gray-600 uppercase font-black tracking-[0.3em] flex-col opacity-50">
                  <TerminalSquare className="w-12 h-12 mb-4"/>
                  Buffer Empty. Awaiting telemetry...
               </div>
            )}
         </div>
         {isPaused && <div className="absolute bottom-4 right-6 text-amber-500 text-[10px] font-black uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded border border-amber-500/30 animate-pulse z-20">STREAM PAUSED</div>}
      </div>

      {/* 2. INFRASTRUCTURE & AUDITS (Right 35%) */}
      <div className="w-full lg:w-[35%] flex flex-col gap-6">
         
         {/* Infrastructure Health Gauges */}
         <div className="bg-[#0f1525] border border-[#1e293b] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl"></div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6 flex items-center"><Activity className="w-4 h-4 mr-2 text-cyan-500"/> System Health Index</h2>
            
            <div className="space-y-6">
               <GaugeBar label="Server CPU Load" value={pulseProps.cpu} icon={<Cpu className="w-3.5 h-3.5 text-cyan-400"/>} color="bg-cyan-500" />
               <GaugeBar label="Memory Allocation" value={pulseProps.ram} icon={<Server className="w-3.5 h-3.5 text-emerald-400"/>} color="bg-emerald-500" />
               
               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#1e293b]">
                  <div className="flex flex-col">
                     <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest flex items-center mb-1"><Clock className="w-3 h-3 mr-1"/> API Latency</span>
                     <span className="text-xl font-black text-yellow-500">{pulseProps.latency}<span className="text-[10px] ml-1 text-gray-600">ms</span></span>
                  </div>
                  <div className="flex flex-col border-l border-[#1e293b] pl-4">
                     <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest flex items-center mb-1"><Database className="w-3 h-3 mr-1"/> Replica State</span>
                     <span className={`text-sm font-black uppercase tracking-widest flex items-center mt-1 ${pulseProps.dbOnline ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {pulseProps.dbOnline ? <><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2 shadow-[0_0_10px_#10b981]"></div> ONLINE</> : <><div className="w-2 h-2 rounded-full bg-rose-500 mr-2 shadow-[0_0_10px_#f43f5e]"></div> FAULTED</>}
                     </span>
                  </div>
               </div>
            </div>
         </div>

         {/* Security & Access Audits */}
         <div className="bg-[#0f1525] border border-[#1e293b] rounded-3xl p-6 shadow-2xl flex-1 flex flex-col">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6 flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-purple-500"/> Audit Trail</h2>
            
            <div className="space-y-8 flex-1 overflow-y-auto pr-2 custom-scrollbar">
               {/* Authentication Module */}
               <div>
                  <h3 className="text-[9px] text-gray-500 font-black uppercase tracking-widest border-b border-[#1e293b] pb-2 mb-4">Authentication Logs</h3>
                  <div className="space-y-3">
                     {[
                        { time: '2m ago', user: 'admin@mygolanka.com', loc: 'Colombo, LK', ip: '112.134.56.2', dev: 'Win 11 / Chrome' },
                        { time: '14m ago', user: 'kamal.tour@gmail.com', loc: 'Kandy, LK', ip: '175.157.88.9', dev: 'iPhone 14 / Safari' },
                        { time: '1h ago', user: 'johndoe@yahoo.com', loc: 'London, UK', ip: '82.11.45.1', dev: 'MacBook M2 / Firefox' },
                     ].map((l, i) => (
                        <div key={i} className="bg-[#0b1121] border border-[#1e293b] rounded-xl p-3 flex flex-col gap-1 transition-colors hover:border-purple-500/30">
                           <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-gray-300">{l.user}</span>
                              <span className="text-[9px] text-gray-600 font-mono">{l.time}</span>
                           </div>
                           <div className="flex justify-between items-center text-[9px] font-mono text-gray-500">
                              <span className="flex items-center"><MapPin className="w-3 h-3 mr-1 text-cyan-500/50"/> {l.loc}</span>
                              <span>{l.ip}</span>
                           </div>
                           <div className="text-[9px] text-gray-600 mt-1 flex items-center"><Monitor className="w-3 h-3 mr-1"/> {l.dev}</div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* God Mode Actions */}
               <div>
                  <h3 className="text-[9px] text-gray-500 font-black uppercase tracking-widest border-b border-[#1e293b] pb-2 mb-4">Critical Action Log</h3>
                  <div className="relative pl-4 space-y-4">
                     {/* Timeline Line */}
                     <div className="absolute top-2 bottom-0 left-0 w-px bg-[#1e293b]"></div>
                     
                     {[
                        { time: 'Today 10:45 AM', admin: 'AUT-990', action: 'Changed Global Commission Rate to 15%' },
                        { time: 'Yesterday 22:15', admin: 'AUT-990', action: 'Initiated Manual Payout to Galle Retreat ($450)' },
                        { time: '2 Days Ago', admin: 'SYS-AUTO', action: 'Database Index Optimization Routine Executed' },
                     ].map((c, i) => (
                        <div key={i} className="relative">
                           <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_10px_#eab308] border-2 border-[#0f1525]"></div>
                           <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest mb-0.5">{c.time} • <span className="text-cyan-500">{c.admin}</span></p>
                           <p className="text-[11px] text-gray-300 leading-snug">{c.action}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* ERROR STACK TRACE MODAL */}
      <AnimatePresence>
         {selectedError && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedError(null)}>
               <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#050810] border border-rose-500/30 w-full max-w-3xl rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(244,63,94,0.2)]" onClick={(e: any) => e.stopPropagation()}>
                  <div className="bg-rose-500/10 p-4 border-b border-rose-500/20 flex justify-between items-center">
                     <h2 className="text-xs font-black text-rose-500 uppercase tracking-widest flex items-center"><AlertCircle className="w-4 h-4 mr-2"/> Exception Trace Matrix</h2>
                     <button onClick={() => setSelectedError(null)} className="text-gray-500 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
                  </div>
                  <div className="p-6">
                     <div className="mb-6">
                        <p className="text-xs text-gray-500 font-mono tracking-widest uppercase mb-1">Fatal Message</p>
                        <p className="text-white text-lg font-black">{selectedError.message}</p>
                     </div>
                     <div className="bg-[#010308] border border-[#1e293b] rounded-lg p-4 custom-scrollbar overflow-x-auto relative group">
                        <div className="text-[10px] font-mono text-gray-400 leading-loose whitespace-pre-wrap">{selectedError.stack || 'No Stack Trace Available.'}</div>
                        <button onClick={() => { navigator.clipboard.writeText(selectedError.stack || ''); toast.success('Trace Copied'); }} className="absolute top-4 right-4 bg-white/5 border border-white/10 hover:bg-white/10 text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm text-gray-300">Copy Trace</button>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .scanlines {
           background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
           background-size: 100% 4px;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}} />
    </motion.div>
  );
}

const GaugeBar = ({ label, value, icon, color }: any) => (
   <div>
      <div className="flex justify-between items-end mb-2">
         <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center">{icon} <span className="ml-2">{label}</span></span>
         <span className="text-sm font-black text-white">{value}%</span>
      </div>
      <div className="h-2 w-full bg-[#1e293b] rounded-full overflow-hidden">
         <motion.div animate={{ width: `${value}%` }} transition={{ duration: 0.5 }} className={`h-full ${color}`}></motion.div>
      </div>
   </div>
);
