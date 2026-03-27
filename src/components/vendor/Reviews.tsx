import React, { useState } from 'react';
import { Star, MessageCircle, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Reviews({ user, setUser }: any) {
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reviews = user?.vendorProfile?.reviews || [];

  const handleReplySubmit = async (reviewId: string) => {
    const text = replyText[reviewId];
    if (!text?.trim()) return toast.error("Reply cannot be empty");

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile/reply', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, reviewId, reply: text })
      });

      if (res.ok) {
        const data = await res.json();
        setUser((prev: any) => ({ ...prev, ...data.user }));
        toast.success("Reply submitted successfully!");
        setReplyText(prev => ({ ...prev, [reviewId]: '' }));
      } else {
        const err = await res.json();
        toast.error(`Error: ${err.message}`);
      }
    } catch (e) {
      toast.error("Network error submitting reply");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="glass p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h2 className="text-2xl font-bold flex items-center"><Star className="mr-3 text-secondary"/> Customer Reviews</h2>
          <p className="text-sm text-gray-500 mt-1">Manage ratings and respond to your guests</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-secondary flex items-center justify-end">
            {user?.vendorProfile?.rating?.toFixed(1) || '0.0'} <Star className="w-6 h-6 ml-2 fill-current" />
          </div>
          <p className="text-sm text-gray-500 mt-1">{reviews.length} Total Reviews</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-10 bg-surface/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-bold text-gray-600 dark:text-gray-400">No Reviews Yet</h3>
          <p className="text-sm text-gray-500 mt-1">Accept more bookings to start receiving customer feedback.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.slice().reverse().map((review: any) => (
            <div key={review._id} className="p-6 bg-surface border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold opacity-90">
                    {review.customerName?.charAt(0) || 'G'}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{review.customerName || 'Guest'}</h4>
                    <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex text-secondary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-700'}`} />
                  ))}
                </div>
              </div>

              <p className="text-sm text-foreground bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 mb-4 font-medium italic">
                "{review.comment}"
              </p>

              {review.reply ? (
                <div className="mt-4 ml-6 pl-4 border-l-2 border-primary/30 relative py-2">
                  <div className="absolute top-2 -left-[9px] w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                  <h5 className="text-xs font-bold text-primary mb-1 uppercase tracking-wide flex items-center"><UserAvatar user={user} className="w-4 h-4 mr-1 rounded-full"/> Driver Response</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{review.reply}</p>
                </div>
              ) : (
                <div className="mt-4 flex gap-3 relative">
                  <input
                    type="text"
                    placeholder="Write a public reply..."
                    value={replyText[review._id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [review._id]: e.target.value })}
                    className="flex-1 bg-surface border border-gray-200 dark:border-gray-700 rounded-xl py-2 px-4 outline-none text-sm focus:border-primary transition"
                  />
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleReplySubmit(review._id)}
                    className="bg-primary hover:bg-primary/90 text-white px-4 rounded-xl font-semibold flex items-center justify-center transition disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const UserAvatar = ({ user, className }: any) => {
  if (user?.vendorProfile?.profilePhoto) {
    return <img src={user.vendorProfile.profilePhoto} className={className + " object-cover"} alt="Driver" />;
  }
  return <div className={className + " bg-primary flex items-center justify-center text-white"}>{user?.name?.charAt(0) || 'V'}</div>;
}
