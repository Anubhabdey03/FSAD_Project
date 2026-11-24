import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyPurchases } from '../api/bids';
import Skeleton from '../components/Skeleton';

export default function BuyerPurchasesPage() {
 const [purchases, setPurchases] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 getMyPurchases().then(r => setPurchases(r.data)).finally(() => setLoading(false));
 }, []);

 if (loading) return (
 <div className="max-w-3xl mx-auto px-4 py-8 space-y-3">
 {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
 </div>
 );

 const totalSpent = purchases.reduce((s, p) => s + Number(p.amountPaid), 0);

 return (
 <div className="bg-slate-50 min-h-screen">
 <div className="bg-white border-b border-slate-200 ">
 <div className="max-w-3xl mx-auto px-4 py-6 flex items-start justify-between gap-4">
 <div>
 <h1 className="text-2xl font-bold text-slate-900 ">My Purchases</h1>
 <p className="text-sm text-slate-500 mt-0.5">{purchases.length} item{purchases.length !== 1 ? 's' : ''} won</p>
 </div>
 {purchases.length > 0 && (
 <div className="text-right bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
 <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wide">Total spent</p>
 <p className="text-lg font-extrabold text-emerald-700 ">₹{totalSpent.toLocaleString()}</p>
 </div>
 )}
 </div>
 </div>

 <div className="max-w-3xl mx-auto px-4 py-6">
 {purchases.length === 0 ? (
 <div className="bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center py-20 text-slate-400 ">
 <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
 <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
 </svg>
 </div>
 <p className="text-base font-semibold text-slate-600 ">No purchases yet</p>
 <p className="text-sm mt-1">Win an auction to see it here.</p>
 <Link to="/browse" className="mt-4 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition">
 Browse Auctions
 </Link>
 </div>
 ) : (
 <div className="space-y-2.5">
 {purchases.map((p, i) => (
 <div key={p.purchaseId}
 style={{ animationDelay: `${i * 60}ms` }}
 className="animate-fade-in bg-white rounded-xl border border-slate-200 px-5 py-4
 flex items-center gap-4 hover:border-emerald-200 hover:shadow-sm transition-all group">
 {/* Trophy icon */}
 <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
 <svg className="w-5 h-5 text-emerald-600 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
 d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
 </svg>
 </div>

 <div className="flex-1 min-w-0">
 <Link to={`/products/${p.productId}`}
 className="font-semibold text-slate-800 group-hover:text-emerald-700 transition text-sm truncate block">
 {p.productTitle}
 </Link>
 <p className="text-xs text-slate-400 mt-0.5">
 {new Date(p.purchaseTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
 </p>
 </div>

 <div className="text-right shrink-0">
 <p className="text-lg font-extrabold text-emerald-700 ">₹{Number(p.amountPaid).toLocaleString()}</p>
 <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
 </svg>
 Won
 </span>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}
