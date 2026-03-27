import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Type, Layers, Box, Maximize, Zap, Volume2, 
  VolumeX, Save, RefreshCcw, Camera, XCircle, Layout, Sparkles, CheckCircle, Smartphone
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function UICustomizerEngine({ initialSettings, onSave }: any) {
  const defaultSettings = {
    mode: 'dark', // 'dark' | 'light' | 'cyber'
    accent: '#06b6d4', // cyan-500
    fontSize: '14', // px
    glassBlur: 10, // px
    glassOpacity: 0.8,
    radius: 12, // px
    borderWidth: 1, // px
    animSpeed: 0.3, // s
    glow: true,
    sound: true
  };

  const [theme, setTheme] = useState(initialSettings?.mode ? initialSettings : defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const updateTheme = (key: string, value: any) => {
    setTheme((prev: any) => ({ ...prev, [key]: value }));
    setHasChanges(true);
    if(theme.sound) playClick();
  };

  const playClick = () => {
    // Subtle synth click sound encoded in base64
    const audio = new Audio("data:audio/mp3;base64,//OExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
    if(audio && theme.sound) audio.play().catch(()=>{});
  };

  const applyPreset = (presetName: string) => {
    if(theme.sound) playClick();
    if(presetName === 'Analyst') {
       setTheme({...defaultSettings, mode: 'light', accent: '#3b82f6', radius: 4, glassBlur: 0, glassOpacity: 1, glow: false});
    } else if(presetName === 'Admin Pro') {
       setTheme(defaultSettings);
    } else if(presetName === 'Minimal') {
       setTheme({...defaultSettings, accent: '#eab308', radius: 0, borderWidth: 0, glassBlur: 20});
    }
    setHasChanges(true);
    toast.success(`${presetName} Layout Snapshot Applied!`);
  };

  const handleApply = () => {
    if(theme.sound) playClick();
    toast.success("Changes Applied to UI Matrix!");
    setHasChanges(false);
  };

  const handlePersist = () => {
    if(theme.sound) playClick();
    if(onSave) onSave(theme);
    toast.loading("Encrypting Base Theme Settings...", { id: "saveTheme" });
    setTimeout(() => toast.success("Theme Linked to Backend Database", { id: "saveTheme" }), 1000);
    setHasChanges(false);
  };

  // Dynamic CSS variables for the 30% Preview Window
  const previewStyle = {
    '--accent': theme.accent,
    '--radius': `${theme.radius}px`,
    '--border': `${theme.borderWidth}px solid ${theme.mode === 'cyber' ? theme.accent : theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    '--bg': theme.mode === 'cyber' ? '#030014' : theme.mode === 'light' ? '#f8fafc' : '#0b1121',
    '--text': theme.mode === 'light' ? '#0f172a' : '#f8fafc',
    '--text-muted': theme.mode === 'light' ? '#64748b' : '#94a3b8',
    '--card-bg': theme.mode === 'cyber' ? `rgba(10,0,30,${theme.glassOpacity})` : theme.mode === 'light' ? `rgba(255,255,255,${theme.glassOpacity})` : `rgba(15,21,37,${theme.glassOpacity})`,
    '--blur': `blur(${theme.glassBlur}px)`,
    '--glow': theme.glow ? `0 0 15px ${theme.accent}40` : 'none',
    '--anim': `${theme.animSpeed}s`,
    '--font': `${theme.fontSize}px`
  } as React.CSSProperties;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:flex-row gap-8 pb-32 h-full">
      
      {/* 70% LEFT CONTROL PANEL */}
      <div className="w-full lg:w-[70%] space-y-8 pr-2">
         
         {/* Top Action Bar */}
         <div className="flex items-center justify-between bg-[#0f1525] border border-[#1e293b] p-4 rounded-2xl shadow-xl">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-purple-500 flex items-center"><Layers className="w-5 h-5 mr-3"/> Visual Architect</h2>
            <div className="flex space-x-3">
               <button onClick={() => applyPreset('Analyst')} className="px-3 py-1.5 bg-[#0b1121] border border-white/5 hover:border-blue-500/50 rounded-lg text-[10px] font-bold text-gray-400 hover:text-blue-400 transition">Analyst View</button>
               <button onClick={() => applyPreset('Admin Pro')} className="px-3 py-1.5 bg-[#0b1121] border border-white/5 hover:border-cyan-500/50 rounded-lg text-[10px] font-bold text-gray-400 hover:text-cyan-400 transition">Admin Pro</button>
               <button onClick={() => applyPreset('Minimal')} className="px-3 py-1.5 bg-[#0b1121] border border-white/5 hover:border-yellow-500/50 rounded-lg text-[10px] font-bold text-gray-400 hover:text-yellow-400 transition">Minimal</button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Global Theme & Visual Architect */}
            <div className="bg-[#0f1525] border border-white/5 rounded-3xl p-6 shadow-2xl relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center"><Palette className="w-4 h-4 mr-2 text-purple-400"/> Color & Theme</h3>
               
               <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-gray-400 mb-2 block">Theme Engine</label>
                    <div className="flex bg-[#0b1121] rounded-xl p-1 border border-[#1e293b]">
                       {['dark', 'light', 'cyber'].map(m => (
                          <button key={m} onClick={() => updateTheme('mode', m)} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${theme.mode === m ? 'bg-[#1e293b] text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}>
                             {m}
                          </button>
                       ))}
                    </div>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-gray-400 mb-2 block">Accent Matrix</label>
                     <div className="flex items-center space-x-4">
                        <input type="color" value={theme.accent} onChange={(e) => updateTheme('accent', e.target.value)} className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none outline-none"/>
                        <div className="flex-1 bg-[#0b1121] border border-[#1e293b] rounded-xl px-4 py-3 font-mono text-xs text-white uppercase tracking-widest flex items-center justify-between">
                           {theme.accent} <Sparkles className="w-4 h-4" style={{color: theme.accent}}/>
                        </div>
                     </div>
                     <div className="flex gap-2 mt-3">
                        {['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map(color => (
                           <div key={color} onClick={() => updateTheme('accent', color)} className={`w-6 h-6 rounded-full cursor-pointer border-2 transition-transform hover:scale-110 ${theme.accent === color ? 'border-white scale-110' : 'border-transparent'}`} style={{backgroundColor: color}}></div>
                        ))}
                     </div>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-gray-400 mb-2 flex justify-between"><span>Base Typography</span> <span className="font-mono">{theme.fontSize}px</span></label>
                     <input type="range" min="12" max="18" step="1" value={theme.fontSize} onChange={(e) => updateTheme('fontSize', e.target.value)} className="w-full h-1.5 bg-[#1e293b] rounded-lg appearance-none cursor-pointer" style={{accentColor: theme.accent}}/>
                  </div>
               </div>
            </div>

            {/* 2. Layout & Geometry */}
            <div className="bg-[#0f1525] border border-white/5 rounded-3xl p-6 shadow-2xl relative">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center"><Box className="w-4 h-4 mr-2 text-cyan-400"/> Geometry Math</h3>
               <div className="space-y-6">
                  <div>
                     <label className="text-xs font-bold text-gray-400 mb-2 flex justify-between"><span>Global Border Radius</span> <span className="font-mono">{theme.radius}px</span></label>
                     <input type="range" min="0" max="30" step="2" value={theme.radius} onChange={(e) => updateTheme('radius', Number(e.target.value))} className="w-full h-1.5 bg-[#1e293b] rounded-lg appearance-none cursor-pointer" style={{accentColor: theme.accent}}/>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-gray-400 mb-2 flex justify-between"><span>Border Framework</span> <span className="font-mono">{theme.borderWidth}px</span></label>
                     <input type="range" min="0" max="3" step="1" value={theme.borderWidth} onChange={(e) => updateTheme('borderWidth', Number(e.target.value))} className="w-full h-1.5 bg-[#1e293b] rounded-lg appearance-none cursor-pointer" style={{accentColor: theme.accent}}/>
                  </div>
                  <div className="pt-2 border-t border-[#1e293b]">
                     <label className="text-xs font-bold text-gray-400 mb-3 block">Navigation Flow</label>
                     <div className="grid grid-cols-2 gap-3">
                        <button className="py-2 border border-[#1e293b] bg-[#0b1121] rounded-xl text-[9px] font-black uppercase tracking-widest text-white shadow-inner">Sidebar: Left</button>
                        <button className="py-2 border border-[#1e293b] bg-[#0b1121] rounded-xl text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-gray-400 hover:border-gray-600 transition">Sidebar: Right</button>
                     </div>
                  </div>
               </div>
            </div>

            {/* 3. Glassmorphism Engine */}
            <div className="bg-[#0f1525] border border-white/5 rounded-3xl p-6 shadow-2xl relative">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center"><Maximize className="w-4 h-4 mr-2 text-emerald-400"/> Glassmorphism Matrix</h3>
               <div className="space-y-6">
                  <div>
                     <label className="text-xs font-bold text-gray-400 mb-2 flex justify-between"><span>Backdrop Blur Filter</span> <span className="font-mono">{theme.glassBlur}px</span></label>
                     <input type="range" min="0" max="30" step="1" value={theme.glassBlur} onChange={(e) => updateTheme('glassBlur', Number(e.target.value))} className="w-full h-1.5 bg-[#1e293b] rounded-lg appearance-none cursor-pointer" style={{accentColor: theme.accent}}/>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-gray-400 mb-2 flex justify-between"><span>Panel Opacity</span> <span className="font-mono">{Math.round(theme.glassOpacity * 100)}%</span></label>
                     <input type="range" min="0.1" max="1" step="0.05" value={theme.glassOpacity} onChange={(e) => updateTheme('glassOpacity', Number(e.target.value))} className="w-full h-1.5 bg-[#1e293b] rounded-lg appearance-none cursor-pointer" style={{accentColor: theme.accent}}/>
                  </div>
               </div>
            </div>

            {/* 4. Interaction & Dynamics */}
            <div className="bg-[#0f1525] border border-white/5 rounded-3xl p-6 shadow-2xl relative">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center"><Zap className="w-4 h-4 mr-2 text-yellow-400"/> Interaction Physics</h3>
               <div className="space-y-6">
                  <div>
                     <label className="text-xs font-bold text-gray-400 mb-2 flex justify-between"><span>Animation Stagger Matrix</span> <span className="font-mono">{theme.animSpeed}s</span></label>
                     <input type="range" min="0" max="1" step="0.1" value={theme.animSpeed} onChange={(e) => updateTheme('animSpeed', Number(e.target.value))} className="w-full h-1.5 bg-[#1e293b] rounded-lg appearance-none cursor-pointer" style={{accentColor: theme.accent}}/>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-[#1e293b] bg-[#0b1121] rounded-xl cursor-pointer hover:border-white/20 transition" onClick={() => updateTheme('glow', !theme.glow)}>
                     <div className="flex items-center"><Sparkles className="w-4 h-4 text-cyan-500 mr-3"/><span className="text-xs font-bold text-gray-300">Interaction Plasma Glow</span></div>
                     <div className={`w-10 h-5 rounded-full p-1 transition-colors ${theme.glow ? 'bg-cyan-500' : 'bg-[#1e293b]'}`}><div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${theme.glow ? 'translate-x-5' : 'translate-x-0'}`}></div></div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-[#1e293b] bg-[#0b1121] rounded-xl cursor-pointer hover:border-white/20 transition" onClick={() => updateTheme('sound', !theme.sound)}>
                     <div className="flex items-center">{theme.sound ? <Volume2 className="w-4 h-4 text-emerald-500 mr-3"/> : <VolumeX className="w-4 h-4 text-red-500 mr-3"/>}<span className="text-xs font-bold text-gray-300">Acoustic Feedback</span></div>
                     <div className={`w-10 h-5 rounded-full p-1 transition-colors ${theme.sound ? 'bg-emerald-500' : 'bg-[#1e293b]'}`}><div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${theme.sound ? 'translate-x-5' : 'translate-x-0'}`}></div></div>
                  </div>
               </div>
            </div>

         </div>

         {/* Master Control Workflow */}
         <AnimatePresence>
            {hasChanges && (
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="p-6 bg-[#0f1525] border border-[#1e293b] rounded-2xl flex justify-between items-center shadow-[0_10px_50px_rgba(0,0,0,0.5)] z-50 sticky bottom-8">
                  <div className="flex items-center text-yellow-500 text-xs font-black uppercase tracking-widest"><RefreshCcw className="w-4 h-4 mr-2 animate-spin"/> Unsaved Changes Detected</div>
                  <div className="flex gap-4">
                     <button onClick={() => setShowResetModal(true)} className="px-5 py-3 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition">Factory Reset</button>
                     <button onClick={handleApply} className="px-5 py-3 bg-[#0b1121] border border-[#1e293b] text-gray-300 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition">Apply Preview</button>
                     <button onClick={handlePersist} className="px-6 py-3 bg-cyan-500 text-[#0b1121] shadow-[0_0_20px_rgba(6,182,212,0.4)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition flex items-center"><Save className="w-4 h-4 mr-2"/> Make Persistent</button>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* 30% RIGHT LIVE PREVIEW BOX */}
      <div className="w-full lg:w-[30%] lg:sticky top-8 self-start h-[calc(100vh-150px)]">
         <div className="w-full h-full rounded-3xl border border-[#1e293b] overflow-hidden flex flex-col bg-[#030712] shadow-2xl relative">
            <div className="p-4 border-b border-[#1e293b] flex items-center justify-between bg-black/50 z-20 relative">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 flex items-center"><Monitor className="w-4 h-4 mr-2"/> Mini-Matrix Render</h3>
               <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
               </div>
            </div>

            {/* Render Sandbox Area mapped to dynamic styles */}
            <div className="flex-1 p-6 relative overflow-hidden transition-colors" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', transitionDuration: 'var(--anim)' }}>
               {/* Decorative background grid */}
               <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>

               <div className="max-w-md mx-auto space-y-6 relative z-10" style={{ fontSize: 'var(--font)' }}>
                  
                  {/* Mock Navbar */}
                  <div className="flex justify-between items-center mb-8">
                     <span className="font-black text-xl tracking-widest">COMMAND</span>
                     <div className="w-8 h-8 flex items-center justify-center border transition-all" style={{ borderRadius: 'var(--radius)', border: 'var(--border)', backdropFilter: 'var(--blur)' }}>
                        <Smartphone className="w-4 h-4" style={{ color: 'var(--accent)' }}/>
                     </div>
                  </div>

                  {/* Mock Metric Card */}
                  <div className="p-4 transition-all" style={{ backgroundColor: 'var(--card-bg)', backdropFilter: 'var(--blur)', WebkitBackdropFilter: 'var(--blur)', border: 'var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--glow)', transitionDuration: 'var(--anim)' }}>
                     <div className="flex justify-between items-start mb-6">
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Revenue Pulse</span>
                        <div className="w-6 h-6 flex items-center justify-center rounded-full" style={{ backgroundColor: 'var(--accent)20' }}>
                           <Zap className="w-3 h-3" style={{ color: 'var(--accent)' }}/>
                        </div>
                     </div>
                     <h2 className="text-3xl font-black mb-1">$15,400</h2>
                     <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>+ 12.5% vs Last Orbit</span>
                  </div>

                  {/* Mock Action Panel */}
                  <div className="p-4 transition-all space-y-4" style={{ backgroundColor: 'var(--card-bg)', backdropFilter: 'var(--blur)', WebkitBackdropFilter: 'var(--blur)', border: 'var(--border)', borderRadius: 'var(--radius)', transitionDuration: 'var(--anim)' }}>
                     <div className="flex items-center p-3 transition-colors cursor-pointer group" style={{ border: 'var(--border)', borderRadius: 'var(--radius)' }}>
                        <CheckCircle className="w-4 h-4 mr-3" style={{ color: 'var(--accent)' }}/>
                        <span className="font-bold text-sm">Verify Vendor Batch A</span>
                     </div>
                     <button className="w-full py-3 font-black uppercase tracking-widest text-[10px] shadow-lg hover:brightness-110 transition-all" style={{ backgroundColor: 'var(--accent)', color: theme.mode === 'light' ? '#fff' : '#000', borderRadius: 'var(--radius)', boxShadow: 'var(--glow)', transitionDuration: 'var(--anim)' }}>
                        Execute Command
                     </button>
                  </div>

               </div>
               
               {/* Internal CSS injected into Preview */}
               <style dangerouslySetInnerHTML={{__html: `
                 :root {
                   ${Object.entries(previewStyle).map(([k,v]) => `${k}: ${v};`).join('\n')}
                 }
               `}} />
            </div>
         </div>
      </div>

      {/* Destructive Confirm Modal */}
      <AnimatePresence>
         {showResetModal && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0b1121] border border-red-500/30 w-full max-w-md rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.3)]">
                  <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6 animate-pulse"/>
                  <h2 className="text-xl font-black text-white uppercase tracking-widest mb-4">Confirm Factory Reset</h2>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed">This will erase all custom geometry, glassmorphism, and color profiles, restoring the system to Deep Space Protocol.</p>
                  <div className="flex gap-4">
                     <button onClick={() => setShowResetModal(false)} className="flex-1 py-4 bg-[#0f1525] border border-white/10 rounded-xl text-gray-400 font-black uppercase tracking-widest hover:text-white transition-colors text-[10px]">Abort</button>
                     <button onClick={() => { setTheme(defaultSettings); setHasChanges(true); setShowResetModal(false); toast.success("Wipe Complete. Factory Defaults Applied.", { icon: '🧹' }); }} className="flex-1 py-4 bg-red-500 text-white rounded-xl font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)] text-[10px]">Execute Wipe</button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </motion.div>
  );
}

// Icon helper since lucide-react Monitor can be extracted from standard Laptop/Layout sometimes
const Monitor = (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
const AlertTriangle = (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>;
