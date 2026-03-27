import Head from "next/head";
import ThemeToggler from "@/components/ThemeToggler";
import { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { io, Socket } from "socket.io-client";
import {
  LayoutDashboard, List, Calendar as CalendarIcon, DollarSign, MessageSquare,
  Settings, HelpCircle, LogOut, Bell, Plus, TrendingUp, Star, Car,
  MoreVertical, CheckCircle, Clock, Save, Edit, Trash2, Shield, User, Camera, Send
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import DashboardComponent from "@/components/vendor/Dashboard";
import ProfileSettingsComponent from "@/components/vendor/ProfileSettings";
import ReviewsComponent from "@/components/vendor/Reviews";

const earningsData = [
  { name: 'Jan', revenue: 400 }, { name: 'Feb', revenue: 600 }, { name: 'Mar', revenue: 550 },
  { name: 'Apr', revenue: 900 }, { name: 'May', revenue: 800 }, { name: 'Jun', revenue: 1250 },
];

export default function VendorDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [user, setUser] = useState<any>(null);

  // Data State
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [unreadBookingCount, setUnreadBookingCount] = useState(0);

  // Forms & Editing
  const [newVehicle, setNewVehicle] = useState({ name: '', category: 'Car', pricePerDay: '', fuelType: 'Petrol', transmission: 'Auto', imageUrl: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [payoutRequested, setPayoutRequested] = useState(false);

  // Chat Component State
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<{ sender: string, text: string, time: Date }[]>([]);
  const [currentMsg, setCurrentMsg] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Validate session
    const token = localStorage.getItem("token");
    if (!token) { router.push('/auth'); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'vendor' && payload.role !== 'Provider') {
        alert("Access Denied. Vendors only."); router.push('/'); return;
      }
      setUser({ id: payload.id, name: localStorage.getItem("username") || 'Provider', email: 'vendor@example.com', phone: '' });
      fetchVendorData(payload.id);

      // Initialize WebSockets
      const newSocket = io('http://localhost:5000');
      newSocket.emit('join_vendor_room', payload.id);
      setSocket(newSocket);

      audioRef.current = new Audio('/audio/ding.mp3');

      newSocket.on('receive_message', (data: any) => {
        setMessages(prev => [...prev, data]);
        if (data.sender !== localStorage.getItem("username")) {
          audioRef.current?.play().catch(e => console.log(e));
          toast.success(`New Message from ${data.sender}`, { icon: '💬', style: { borderRadius: '10px', background: '#333', color: '#fff' } });
          setUnreadChatCount(prev => prev + 1);
        }
      });

      newSocket.on('new_booking', (data: any) => {
        audioRef.current?.play().catch(e => console.log(e));
        toast.success(`New Hire Request Received!`, { icon: '🔔', style: { borderRadius: '10px', background: '#333', color: '#fff' } });
        setUnreadBookingCount(prev => prev + 1);
        fetchVendorData(payload.id); // Refresh bookings
      });

      return () => { newSocket.close(); };
    } catch { router.push('/auth'); }
  }, []);

  const fetchVendorData = async (vendorId: string) => {
    try {
      const uRes = await fetch(`http://localhost:5000/api/auth/profile?id=${vendorId}`);
      if (uRes.ok) {
        const uData = await uRes.json();
        setUser((prev: any) => ({ ...prev, ...uData }));
      }
      const vRes = await fetch(`http://localhost:5000/api/vehicles/vendor/${vendorId}`);
      if (vRes.ok) setVehicles(await vRes.json());
      const bRes = await fetch(`http://localhost:5000/api/vehicles/vendor/${vendorId}/bookings`);
      if (bRes.ok) setBookings(await bRes.json());
    } catch (e) { console.error(e); }
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setIsUploading(true);
    try {
      const res = await fetch("http://localhost:5000/api/uploads", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setNewVehicle({ ...newVehicle, imageUrl: data.url });
    } catch (err) { toast.error("Upload failed"); }
    setIsUploading(false);
  };

  const handleAddVehicle = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/vehicles/add', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...newVehicle, vendorId: user?.id })
      });
      if (res.ok) {
        toast.success("Listing saved successfully!");
        fetchVendorData(user!.id);
        setActiveTab('My Vehicle');
      }
    } catch (e) { toast.error("Network Error"); }
  };

  const handleDeleteVehicle = async (id: string, name: string) => {
    if (!confirm(`Delete listing: ${name}?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/vehicles/${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success("Deleted!"); fetchVendorData(user!.id); }
    } catch (e) { toast.error("Failed to delete."); }
  };

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (currentMsg.trim() !== "" && socket) {
      const msgData = { room: user?.id, sender: user?.name, text: currentMsg, time: new Date() };
      socket.emit("send_message", msgData);
      setCurrentMsg("");
    }
  };

  const handleProfileUpdate = async (e: any) => {
    e.preventDefault();
    toast.success("Profile Settings Updated!");
  }

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'My Vehicle', icon: Car },
    { name: 'Bookings', icon: CalendarIcon, badge: unreadBookingCount },
    { name: 'Earnings', icon: DollarSign },
    { name: 'Chat', icon: MessageSquare, badge: unreadChatCount },
    { name: 'Reviews', icon: Star, badge: 0 },
    { name: 'Profile Settings', icon: Settings },
  ];

  const totalRevenue = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Completed').reduce((sum, b) => sum + b.totalPrice, 0) || 1250;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length || 0;

  return (
    <>
      <Head><title>Provider Portal | MyGoLanka</title></Head>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 glass hidden md:flex flex-col">
          <div className="p-6 cursor-pointer" onClick={() => router.push('/')}>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-logo">MyGoLanka</span>
          </div>
          
          <div className="px-6 mb-4 flex items-center bg-surface/30 mx-4 p-3 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="bg-primary/10 p-2 rounded-xl mr-3"><Star className="w-5 h-5 text-secondary fill-current"/></div>
            <div>
              <p className="font-bold text-foreground leading-tight">{user?.vendorProfile?.rating?.toFixed(1) || '0.0'}</p>
              <p className="text-xs text-gray-500">{user?.vendorProfile?.reviews?.length || 0} Reviews</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 space-y-2 mt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name || (activeTab === 'Add New' && item.name === 'My Vehicle');
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.name);
                    if (item.name === 'Chat') setUnreadChatCount(0);
                    if (item.name === 'Bookings') setUnreadBookingCount(0);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors font-medium relative ${isActive ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-foreground'
                    }`}
                >
                  <Icon className="w-5 h-5 mr-3" /> {item.name}
                  {item.badge ? <span className="absolute right-4 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-sm shadow-red-500/50"></span> : null}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
            <button onClick={() => setActiveTab('Support')} className="w-full flex items-center px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"><HelpCircle className="w-5 h-5 mr-3" />Support</button>
            <button onClick={() => { localStorage.clear(); router.push('/auth'); }} className="w-full flex items-center px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-medium"><LogOut className="w-5 h-5 mr-3" />Logout</button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full dark:bg-[#0b1121]">
          {/* Header */}
          <header className="sticky top-0 z-30 glass px-8 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{activeTab === 'Dashboard' ? `Welcome Back, ${user?.name}!` : activeTab}</h1>
              {activeTab === 'Dashboard' && <p className="text-sm text-gray-500 dark:text-gray-400">Here&apos;s what&apos;s happening today.</p>}
            </div>

            <div className="flex items-center space-x-6">
              <button
                onClick={() => {
                  if (user?.vendorProfile?.verificationStatus === 'Verified') setActiveTab('Add New');
                  else toast.error("Complete Verification First", { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
                }}
                className={`hidden md:flex items-center text-white px-4 py-2 rounded-xl font-semibold shadow-lg transition-all ${user?.vendorProfile?.verificationStatus === 'Verified' ? 'bg-gradient-logo hover:shadow-xl hover:-translate-y-0.5' : 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed opacity-70'}`}
              >
                <Plus className="w-5 h-5 mr-1" />{user?.vendorProfile?.verificationStatus === 'Verified' ? 'Add New' : 'Verification Required'}
              </button>

              <div className="relative group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors">
                <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                {unreadChatCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background"></span>}
                <div className="absolute top-12 right-0 w-72 glass p-5 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50 pointer-events-none">
                  <h4 className="font-bold text-sm mb-3 border-b border-gray-200 dark:border-gray-700 pb-2 flex items-center"><Bell className="w-4 h-4 mr-2" /> Notifications</h4>
                  {user?.vendorProfile?.verificationStatus === 'Pending' && <p className="text-xs text-orange-500 font-semibold mb-2 bg-orange-500/10 p-2 rounded-lg">• Your verification is pending. Please wait 24 hours.</p>}
                  {user?.vendorProfile?.verificationStatus === 'Verified' && <p className="text-xs text-success font-semibold mb-2 bg-success/10 p-2 rounded-lg">• Account Verified! You can now add listings.</p>}
                  {(!user?.vendorProfile?.verificationStatus || user?.vendorProfile?.verificationStatus === 'Not Submitted') && <p className="text-xs text-secondary font-semibold mb-2 bg-secondary/10 p-2 rounded-lg">• Please submit KYC details in Settings.</p>}
                </div>
              </div>

              <ThemeToggler />

              <div onClick={() => setActiveTab('Profile Settings')} className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold cursor-pointer shadow-md overflow-hidden">
                {user?.vendorProfile?.profilePhoto ? (
                  <img src={user.vendorProfile.profilePhoto} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  user?.name?.charAt(0) || 'V'
                )}
              </div>
            </div>
          </header>

          <div className="p-8 space-y-8 max-w-7xl mx-auto pb-24">
            {/* 1. DASHBOARD OVERVIEW */}
            {activeTab === 'Dashboard' && (
              <DashboardComponent
                user={user}
                totalRevenue={totalRevenue}
                bookings={bookings}
                pendingCount={pendingCount}
                vehicles={vehicles}
                earningsData={earningsData}
                setActiveTab={setActiveTab}
              />
            )}

            {/* 2. ADD NEW VEHICLE (With File Upload) */}
            {activeTab === 'Add New' && (
              <div className="glass p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-1 border-r border-gray-200 dark:border-gray-800 pr-6 flex flex-col items-center justify-center relative">
                  <div className="w-full h-64 bg-surface rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden flex flex-col items-center justify-center relative hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    {newVehicle.imageUrl ? (
                      <img src={newVehicle.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                    ) : (<><Camera className="w-12 h-12 text-gray-400 mb-2" /> <span className="text-gray-500 text-sm font-medium">Upload Image</span></>)}
                    <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" disabled={isUploading} />
                  </div>
                  {isUploading && <p className="text-blue-500 text-sm mt-3 animate-pulse font-bold">Uploading to Server...</p>}
                </div>

                <form onSubmit={handleAddVehicle} className="col-span-2 space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="col-span-2 space-y-1"><label className="text-sm font-semibold text-gray-500">Vehicle Name / Model</label><input required type="text" value={newVehicle.name} onChange={e => setNewVehicle({ ...newVehicle, name: e.target.value })} className="w-full bg-surface border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 outline-none focus:border-primary" /></div>
                    <div className="space-y-1"><label className="text-sm font-semibold text-gray-500">Category</label><select value={newVehicle.category} onChange={e => setNewVehicle({ ...newVehicle, category: e.target.value })} className="w-full bg-surface border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 outline-none"><option value="Car">Car</option><option value="Van">Van</option><option value="Bike">Bike</option></select></div>
                    <div className="space-y-1"><label className="text-sm font-semibold text-gray-500">Price Per Day ($)</label><input required type="number" value={newVehicle.pricePerDay} onChange={e => setNewVehicle({ ...newVehicle, pricePerDay: e.target.value })} className="w-full bg-surface border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 outline-none focus:border-primary" /></div>
                    <div className="space-y-1"><label className="text-sm font-semibold text-gray-500">Fuel Type</label><select value={newVehicle.fuelType} onChange={e => setNewVehicle({ ...newVehicle, fuelType: e.target.value })} className="w-full bg-surface border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 outline-none"><option value="Petrol">Petrol</option><option value="Diesel">Diesel</option><option value="Electric">Electric</option></select></div>
                    <div className="space-y-1"><label className="text-sm font-semibold text-gray-500">Transmission</label><select value={newVehicle.transmission} onChange={e => setNewVehicle({ ...newVehicle, transmission: e.target.value })} className="w-full bg-surface border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 outline-none"><option value="Auto">Automatic</option><option value="Manual">Manual</option></select></div>
                  </div>
                  <button type="submit" disabled={isUploading || !newVehicle.imageUrl} className="w-full bg-primary disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg mt-4 flex items-center justify-center">
                    <Save className="w-5 h-5 mr-2" /> Save to Fleet Catalog
                  </button>
                </form>
              </div>
            )}

            {/* 3. MY VEHICLE */}
            {activeTab === 'My Vehicle' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold flex items-center"><Car className="mr-3 text-primary" /> Vehicle Management</h2>
                  <button
                    onClick={() => {
                      if (user?.vendorProfile?.verificationStatus === 'Verified') setActiveTab('Add New');
                      else toast.error("Complete Verification First");
                    }}
                    className={`text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg transition-all ${user?.vendorProfile?.verificationStatus === 'Verified' ? 'bg-primary' : 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed text-gray-200'}`}
                  >
                    <Plus className="w-5 h-5 mr-1" /> Add Vehicle
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map(v => (
                    <div key={v._id} className="glass rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col group">
                      <div className="h-48 relative overflow-hidden">
                        <div className={`absolute top-3 left-3 text-white px-2 py-1 rounded-md text-xs font-bold uppercase z-10 ${v.status === 'Available' ? 'bg-success' : 'bg-secondary'}`}> {v.status}</div>
                        <img src={v.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={v.name} />
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold mb-2">{v.name}</h3>
                        <p className="text-sm text-gray-500 flex-1">{v.category} • {v.fuelType} • {v.transmission}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                          <p className="font-bold text-lg text-primary">${v.pricePerDay}<span className="text-xs text-gray-500 font-normal">/day</span></p>
                          <div className="flex space-x-2">
                            <button onClick={() => toast('Editing requires form sync! Coming soon.')} className="p-2 bg-surface hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300 transition"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteVehicle(v._id, v.name)} className="p-2 bg-red-50 hover:bg-red-500/20 text-red-500 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {vehicles.length === 0 && <div className="col-span-3 text-center py-20 text-gray-500"><Car className="w-16 h-16 mx-auto mb-4 opacity-50" /><h3>No fleet listings active.</h3></div>}
                </div>
              </div>
            )}

            {/* 4. BOOKINGS LEDGER */}
            {activeTab === 'Bookings' && (
              <div className="glass p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <h2 className="text-2xl font-bold mb-6 flex items-center"><CalendarIcon className="mr-3 text-primary" /> Comprehensive Reservation Ledger</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800 text-sm text-gray-500 font-semibold bg-surface/50">
                        <th className="py-4 px-4 rounded-tl-xl">ID</th>
                        <th className="py-4 px-4">Guest Name</th>
                        <th className="py-4 px-4">Pickup Point / Dest</th>
                        <th className="py-4 px-4">Date & Time</th>
                        <th className="py-4 px-4">Revenue</th>
                        <th className="py-4 px-4 rounded-tr-xl">Status Flag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-surface/50 transition">
                          <td className="py-4 px-4 text-xs font-mono text-gray-500">#{b._id.substring(18, 24)}</td>
                          <td className="py-4 px-4 font-bold">{b.userId?.name} <span className="block text-xs text-gray-500 font-normal mt-1">{b.userId?.email}</span></td>
                          <td className="py-4 px-4 text-sm font-semibold">{b.pickupPoint || 'BIA Airport'} <br /> <span className="text-gray-400 font-normal">to {b.destination || 'Colombo'}</span></td>
                          <td className="py-4 px-4 text-xs"><b>On:</b> {new Date(b.startDate).toLocaleDateString()}<br /><b>At:</b> {b.time || '10:00 AM'}</td>
                          <td className="py-4 px-4 font-extrabold text-primary">${b.totalPrice}</td>
                          <td className="py-4 px-4">
                            <span className="bg-surface border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">{b.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. EARNINGS */}
            {activeTab === 'Earnings' && (
              <div className="space-y-6">
                <div className="glass p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex justify-between items-center bg-gradient-to-r from-primary/10 to-transparent">
                  <div>
                    <h2 className="text-xl font-bold flex items-center text-primary"><DollarSign className="mr-2" /> Available Ledger Balance</h2>
                    <p className="text-5xl font-extrabold text-foreground mt-4">${totalRevenue - 200}</p>
                    <p className="text-sm text-gray-500 mt-2">After 10% platform facilitation fee deduction.</p>
                  </div>
                  <button disabled={payoutRequested} onClick={() => { setPayoutRequested(true); toast.success("Payout Request initiated successfully. Funds will arrive within 2 business days.") }} className="bg-gradient-logo disabled:opacity-50 disabled:grayscale text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:-translate-y-1 transition text-lg flex items-center">
                    {payoutRequested ? <CheckCircle className="w-6 h-6 mr-2" /> : <Shield className="w-6 h-6 mr-2" />} {payoutRequested ? "Settlement Processing" : "Request Payout Delivery"}
                  </button>
                </div>

                <div className="glass p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h2 className="text-lg font-bold mb-4">Payout Ledger</h2>
                  <div className="text-sm text-gray-500 py-4 text-center">No previous payout structures generated this month.</div>
                </div>
              </div>
            )}

            {/* REVIEWS */}
            {activeTab === 'Reviews' && <ReviewsComponent user={user} setUser={setUser} />}

            {/* 2. PROFILE SETTINGS */}
            {activeTab === 'Profile Settings' && (
              <ProfileSettingsComponent user={user} setUser={setUser} />
            )}

            {/* 7. REAL-TIME CHAT */}
            {activeTab === 'Chat' && (
              <div className="glass rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col h-[600px] bg-surface relative">
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center font-bold mr-3 animate-pulse border-2 border-green-500/50">OC</div>
                    <div><h3 className="font-bold text-lg leading-tight">Operation Center (Live)</h3><p className="text-xs text-green-600 font-semibold flex items-center">● System Status Active</p></div>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col">
                  <div className="text-center text-xs text-gray-400 font-bold tracking-widest uppercase my-4">Chat Socket Protocol Connected: Secure Channel</div>
                  {messages.map((msg, idx) => {
                    const isMe = msg.sender === user?.name;
                    return (
                      <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-sm ${isMe ? 'bg-primary text-white rounded-br-sm' : 'glass border border-gray-200 dark:border-gray-800 text-foreground rounded-bl-sm'}`}>
                          <p className="text-sm font-medium">{msg.text}</p>
                          <span className={`text-[10px] mt-1 block opacity-70 ${isMe ? 'text-right' : 'text-left'}`}>{new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    )
                  })}
                  {messages.length === 0 && <div className="m-auto text-gray-400 text-sm flex flex-col items-center"><MessageSquare className="w-10 h-10 mb-2 opacity-50" /> Awaiting Messages...</div>}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-[#0b1121] border-t border-gray-200 dark:border-gray-800">
                  <form onSubmit={handleSendMessage} className="flex items-center relative gap-3">
                    <input type="text" value={currentMsg} onChange={(e) => setCurrentMsg(e.target.value)} placeholder="Type a message to the team network..." className="flex-1 bg-surface border border-gray-300 dark:border-gray-700 rounded-full py-4 px-6 outline-none focus:border-primary pr-16 shadow-inner font-medium" />
                    <button type="submit" disabled={!currentMsg.trim()} className="absolute right-2 top-1 bottom-1 bg-primary text-white p-3 rounded-full hover:scale-105 active:scale-95 transition disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center shadow-md">
                      <Send className="w-5 h-5 ml-1" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* 8. SUPPORT */}
            {activeTab === 'Support' && (
              <div className="glass p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm text-center">
                <Shield className="w-16 h-16 text-primary mx-auto mb-6 opacity-80" />
                <h2 className="text-3xl font-extrabold mb-4">Resolution Center</h2>
                <p className="text-gray-500 max-w-lg mx-auto mb-8 font-medium">As a certified Provider, you receive priority enterprise support. For immediate concerns relating to asset deployments, please execute the secure portal protocol below.</p>
                <button className="bg-gradient-logo text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition text-lg">Initialize Secure Ticket</button>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}
