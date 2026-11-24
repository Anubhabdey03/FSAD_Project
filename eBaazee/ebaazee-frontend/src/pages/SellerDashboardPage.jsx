import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyProducts } from '../api/seller';
import CountdownTimer from '../components/CountdownTimer';
import Skeleton from '../components/Skeleton';

const statusStyles = {
 ACTIVE: 'bg-emerald-100 text-emerald-700 ',
 FROZEN: 'bg-amber-100 text-amber-700 ',
 CLOSED: 'bg-slate-100 text-slate-500 ',
};

const statusDot = {
 ACTIVE: 'bg-emerald-500 animate-pulse',
 FROZEN: 'bg-amber-500',
 CLOSED: 'bg-slate-400',
};

export default function SellerDashboardPage() {
 const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
 getMyProducts()
 .then(r => { setProducts(r.data); setTimeout(() => setMounted(true), 50); })
 .finally(() => setLoading(false));
 }, []);

 const counts = {
 total: products.length,
 active: products.filter(p => p.status === 'ACTIVE').length,
 frozen: products.filter(p => p.status === 'FROZEN').length,
 closed: products.filter(p => p.status === 'CLOSED').length,
 };

 if (loading) return (
 <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
 <div className="grid grid-cols-4 gap-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
 {[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
 </div>
 );

 return (
 <div className="bg-slate-50 min-h-screen">
 {/* Page header */}
 <div className="bg-white border-b border-slate-200 ">
 <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
 <div>
 <h1 className="text-2xl font-bold text-slate-900 ">My Listings</h1>
 <p className="text-sm text-slate-500 mt-0.5">Manage and track your auction listings</p>
 </div>
 <Link
 to="/seller/products/new"
 className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-200"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
 </svg>
 New Listing
 </Link>
 </div>
 </div>

 <div className="max-w-4xl mx-auto px-4 py-6">
 {/* Stat cards */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
 {[
 { label: 'Total', value: counts.total, bg: 'bg-white ', num: 'text-slate-800 ', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
 { label: 'Active', value: counts.active, bg: 'bg-emerald-50 ', num: 'text-emerald-700 ', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
 { label: 'Frozen', value: counts.frozen, bg: 'bg-amber-50 ', num: 'text-amber-700 ', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
 { label: 'Closed', value: counts.closed, bg: 'bg-slate-100 ', num: 'text-slate-600 ', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
 ].map(({ label, value, bg, num, icon }) => (
 <div key={label} className={`${bg} rounded-xl border border-slate-200 px-4 py-4 hover:shadow-sm transition-shadow`}>
 <div className="flex items-center justify-between mb-2">
 <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
 <svg className={`w-4 h-4 ${num} opacity-60`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={icon} />
 </svg>
 </div>
 <p className={`text-3xl font-extrabold ${num}`}>{value}</p>
 </div>
 ))}
 </div>

 {/* Listings */}
 {products.length === 0 ? (
 <div className="bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center py-20 text-slate-400 ">
 <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
 <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
 </svg>
 </div>
 <p className="text-base font-semibold text-slate-600 ">No listings yet</p>
 <p className="text-sm mt-1">Create your first auction to get started.</p>
 <Link to="/seller/products/new" className="mt-4 px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 active:scale-95 transition-all">
 New Listing
 </Link>
 </div>
 ) : (
 <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
 {products.map((p, i) => (
 <div key={p.productId}
 style={{ transitionDelay: `${Math.min(i * 40, 320)}ms` }}
 className={`group px-5 py-4 flex items-center gap-4 hover:bg-indigo-50/40 transition-all duration-300 ${
 mounted ? 'opacity-100' : 'opacity-0'
 }`}>
 {/* Status dot */}
 <div className="shrink-0">
 <span className={`block w-2.5 h-2.5 rounded-full ${statusDot[p.status] || 'bg-slate-300'}`} />
 </div>

 <div className="flex-1 min-w-0">
 <Link to={`/products/${p.productId}`}
 className="font-semibold text-slate-800 group-hover:text-indigo-700 transition text-sm truncate block">
 {p.title}
 </Link>
 <div className="flex items-center gap-2 mt-0.5 flex-wrap">
 <span className="text-xs text-slate-400 ">{p.categoryName}</span>
 <span className="text-slate-200 ">·</span>
 <span className="text-xs text-slate-400 ">₹{p.minBid.toLocaleString()} – ₹{p.maxBid.toLocaleString()}</span>
 <span className="text-slate-200 ">·</span>
 <span className={`inline-flex items-center gap-1 text-xs font-bold ${
 p.bidCount > 0 ? 'text-indigo-600 ' : 'text-slate-400 '
 }`}>
 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
 d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
 </svg>
 {p.bidCount} bid{p.bidCount !== 1 ? 's' : ''}
 </span>
 </div>
 </div>

 <div className="flex items-center gap-2 shrink-0">
 {p.status === 'ACTIVE' && (
 <span className="text-xs text-slate-500 hidden sm:inline"><CountdownTimer endTime={p.endTime} /></span>
 )}
 <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${statusStyles[p.status]}`}>
 {p.status === 'ACTIVE' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
 {p.status}
 </span>
 {p.status === 'ACTIVE' && p.bidCount === 0 && (
 <Link
 to={`/seller/products/${p.productId}/edit`}
 className="text-xs font-semibold text-slate-500 hover:text-indigo-600 border border-slate-200 hover:border-indigo-300 rounded-lg px-2.5 py-1 transition"
 >
 Edit
 </Link>
 )}
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}
