import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Calendar as CalendarIcon, Clock, Star, TrendingUp, Car } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ user, totalRevenue, bookings, pendingCount, vehicles, earningsData, setActiveTab }: any) {
  const rating = user?.vendorProfile?.rating || 0.0;
  const reviewsCount = user?.vendorProfile?.reviews?.length || 0;
  const ratingCompletion = reviewsCount > 0 ? 100 : 0; // Simple mock for completion

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><DollarSign className="w-16 h-16 text-primary" /></div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Earnings</p>
          <h3 className="text-3xl font-bold text-foreground">${totalRevenue}</h3>
          <p className="text-xs text-success font-medium flex items-center mt-2"><TrendingUp className="w-3 h-3 mr-1" /> +15% from last month</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><CalendarIcon className="w-16 h-16 text-primary" /></div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">New Hire Requests</p>
          <h3 className="text-3xl font-bold text-foreground">{bookings.length || 8}</h3>
          <p className="text-xs text-gray-500 mt-2">Past 30 Days</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="glass p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => setActiveTab('Reviews')}>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Star className="w-16 h-16 text-secondary" /></div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Average Rating</p>
          <h3 className="text-3xl font-bold text-secondary">{rating.toFixed(1)} <Star className="inline w-6 h-6 -mt-1 ml-1 fill-current" /></h3>
          <p className="text-xs text-gray-500 mt-2">from {reviewsCount} total reviews</p>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="glass p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Car className="w-16 h-16 text-secondary" /></div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Rating Completion</p>
          <h3 className="text-3xl font-bold text-foreground">{ratingCompletion}%</h3>
          <p className="text-xs text-gray-500 mt-2">All tours finished</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 glass p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-6"><h2 className="text-lg font-bold">Latest Hire Requests</h2><button onClick={() => setActiveTab('Bookings')} className="text-primary text-sm font-semibold hover:underline">Manage All</button></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 text-sm text-gray-500">
                  <th className="py-3 px-2 font-medium">Guest Name</th>
                  <th className="py-3 px-2 font-medium">Tour Info</th>
                  <th className="py-3 px-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 4).map((b: any) => (
                  <tr key={b._id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-2 font-bold">{b.userId?.name}</td>
                    <td className="py-4 px-2 text-sm text-gray-500">{b.vehicleId?.name} <br/> {new Date(b.startDate).toLocaleDateString()}</td>
                    <td className="py-4 px-2">
                      <span className={`px-2 py-1 text-xs font-bold rounded-lg ${b.status === 'Confirmed' ? 'bg-success/20 text-success' : 'bg-secondary/20 text-secondary'}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold mb-4">Earnings History</h2>
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earningsData}><XAxis dataKey="name" axisLine={false} tickLine={false}/><Tooltip/><Line type="monotone" dataKey="revenue" stroke="#ff8c00" strokeWidth={3} dot={false}/></LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-6">
            <h3 className="text-md font-bold mb-4 flex justify-between items-center text-gray-600 dark:text-gray-400">Payout History <span className="text-xs font-normal bg-secondary/10 text-secondary px-2 py-1 rounded">Net 30</span></h3>
            <div className="space-y-3">
              {[
                { date: 'Oct 01, 2026', amount: 350.50, status: 'Transferred' },
                { date: 'Sep 15, 2026', amount: 520.00, status: 'Transferred' },
                { date: 'Sep 01, 2026', amount: 890.75, status: 'Transferred' }
              ].map((p, i) => (
                <div key={i} className="flex justify-between items-center text-sm p-3 bg-surface rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="font-semibold text-gray-500">{p.date}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">${p.amount.toFixed(2)}</span>
                    <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-md">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
