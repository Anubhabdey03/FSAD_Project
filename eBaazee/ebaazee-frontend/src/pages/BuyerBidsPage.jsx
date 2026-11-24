import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyBids } from '../api/bids';
import Skeleton from '../components/Skeleton';

const statusConfig = {
 ACTIVE: { style: 'bg-emerald-100 text-emerald-700 ', label: 'Active', dot: 'bg-emerald-500', pulse: true },
 FROZEN: { style: 'bg-amber-100 text-amber-700 ', label: 'Frozen', dot: 'bg-amber-500', pulse: false },
 CLOSED: { style: 'bg-slate-100 text-slate-500 ', label: 'Closed', dot: 'bg-slate-400', pulse: false },
};

export default function BuyerBidsPage() {
 const [bids, setBids] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 getMyBids().then(r => setBids(r.data)).finally(() => setLoading(false));
 }, []);

 if (loading) return (
 <div className="max-w-3xl mx-auto px-4 py-8 space-y-3">
 {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
 </div>
 );

 return (
 <div className="bg-slate-50 min-h-screen">
 <div className="bg-white border-b border-slate-200 ">
 <div className="max-w-3xl mx-auto px-4 py-6 flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-bold text-slate-900 ">My Bids</h1>
 <p className="text-sm text-slate-500 mt-0.5">{bids.length} bid{bids.length !== 1 ? 's' : ''} placed</p>
 </div>
 <Link to="/browse"
 className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
 </svg>
 Place more bids
 </Link>
 </div>
 </div>

 <div className="max-w-3xl mx-auto px-4 py-6">
 {bids.length === 0 ? (
 <div className="bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center py-20 text-slate-400 ">
 <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
 <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
 d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
 </svg>
 </div>
 <p className="text-base font-semibold text-slate-600 ">No bids yet</p>
 <p className="text-sm mt-1">Start bidding on auctions to see them here.</p>
 <Link to="/browse" className="mt-4 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition">
 Browse Auctions
 </Link>
 </div>
 ) : (
 <div className="space-y-2.5">
 {bids.map((b, i) => {
 const sc = statusConfig[b.productStatus] || statusConfig.CLOSED;
 return (
 <div key={b.bidId}
 style={{ animationDelay: `${i * 50}ms` }}
 className="animate-fade-in bg-white rounded-xl border border-slate-200 px-5 py-4
 flex items-center gap-4 hover:border-indigo-200 hover:shadow-sm transition-all group">
 {/* Amount circle */}
 <div className="w-12 h-12 rounded-xl bg-indigo-50 flex flex-col items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
 <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wide">BID</span>
 <span className="text-xs font-extrabold text-indigo-700 leading-tight">
 ₹{Number(b.amount).toLocaleString('en-IN', { notation: 'compact', maximumFractionDigits: 1 })}
 </span>
 </div>

 <div className="flex-1 min-w-0">
 <Link to={`/products/${b.productId}`}
 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition text-sm truncate block">
 {b.productTitle}
 </Link>
 <p className="text-xs text-slate-400 mt-0.5">
 {new Date(b.bidTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
 </p>
 </div>

 <div className="flex items-center gap-2 shrink-0">
 <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full ${sc.style}`}>
 <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${sc.pulse ? 'animate-pulse' : ''}`} />
 {sc.label}
 </span>
 {b.productStatus === 'FROZEN' && (
 <Link to={`/products/${b.productId}`}
 className="text-xs font-semibold bg-amber-500 text-white px-2.5 py-1 rounded-lg hover:bg-amber-600 transition">
 Purchase →
 </Link>
 )}
 </div>
 </div>
 );
 })}
 </div>
 )}
 </div>
 </div>
 );
}
