import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, getAllUsers, freezeProduct, unfreezeProduct, declareWinner } from '../api/admin';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/Skeleton';

const statusStyles = {
 ACTIVE: 'bg-emerald-100 text-emerald-700 ',
 FROZEN: 'bg-amber-100 text-amber-700 ',
 CLOSED: 'bg-slate-100 text-slate-500 ',
};

const roleBadge = {
 ADMIN: 'bg-red-100 text-red-700 ',
 SELLER: 'bg-indigo-100 text-indigo-700 ',
 BUYER: 'bg-emerald-100 text-emerald-700 ',
};

const roleAvatarBg = {
 ADMIN: 'bg-red-100 text-red-600 ',
 SELLER: 'bg-indigo-100 text-indigo-600 ',
 BUYER: 'bg-emerald-100 text-emerald-600 ',
};

export default function AdminDashboardPage() {
 const [products, setProducts] = useState([]);
 const [users, setUsers] = useState([]);
 const [tab, setTab] = useState('products');
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const { showToast } = useToast();

 const loadProducts = async () => {
 const r = await getAllProducts();
 setProducts(r.data);
 };

 useEffect(() => {
 Promise.all([getAllProducts(), getAllUsers()])
 .then(([pr, ur]) => { setProducts(pr.data); setUsers(ur.data); })
 .finally(() => setLoading(false));
 }, []);

 const handleFreeze = async (p) => {
 if (!window.confirm(`Freeze auction for "${p.title}"?`)) return;
 try { await freezeProduct(p.productId); showToast('Auction frozen', 'success'); await loadProducts(); }
 catch (err) { showToast(err.response?.data?.message || 'Error', 'error'); }
 };

 const handleUnfreeze = async (p) => {
 if (!window.confirm(`Unfreeze auction for "${p.title}"?`)) return;
 try { await unfreezeProduct(p.productId); showToast('Auction unfrozen', 'success'); await loadProducts(); }
 catch (err) { showToast(err.response?.data?.message || 'Error', 'error'); }
 };

 const handleDeclareWinner = async (p) => {
 if (!window.confirm(`Declare winner for "${p.title}"?\n\nThis will assign the highest bidder as the winner and close the auction immediately.`)) return;
 try { await declareWinner(p.productId); showToast(`Winner declared for "${p.title}"`, 'success'); await loadProducts(); }
 catch (err) { showToast(err.response?.data?.message || 'Error', 'error'); }
 };

 const filteredProducts = useMemo(() =>
 products.filter(p =>
 p.title.toLowerCase().includes(search.toLowerCase()) ||
 p.sellerName?.toLowerCase().includes(search.toLowerCase())
 ), [products, search]);

 const stats = {
 total: products.length,
 active: products.filter(p => p.status === 'ACTIVE').length,
 frozen: products.filter(p => p.status === 'FROZEN').length,
 closed: products.filter(p => p.status === 'CLOSED').length,
 users: users.length,
 };

 return (
 <div className="bg-slate-50 min-h-screen">
 {/* Page header */}
 <div className="bg-white border-b border-slate-200 ">
 <div className="max-w-5xl mx-auto px-4 py-6">
 <div className="flex items-center gap-2.5">
 <h1 className="text-2xl font-bold text-slate-900 ">Admin Dashboard</h1>
 <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-0.5 rounded-full">Admin</span>
 </div>
 <p className="text-sm text-slate-500 mt-0.5">Platform overview and controls</p>
 </div>
 </div>

 <div className="max-w-5xl mx-auto px-4 py-6">
 {/* Stat cards */}
 <div className="grid grid-cols-5 gap-4 mb-6">
 {[
 { label: 'Auctions', value: stats.total, bg: 'bg-white ', num: 'text-slate-800 ' },
 { label: 'Active', value: stats.active, bg: 'bg-emerald-50 ', num: 'text-emerald-700 ' },
 { label: 'Frozen', value: stats.frozen, bg: 'bg-amber-50 ', num: 'text-amber-700 ' },
 { label: 'Closed', value: stats.closed, bg: 'bg-slate-100 ', num: 'text-slate-600 ' },
 { label: 'Users', value: stats.users, bg: 'bg-indigo-50 ', num: 'text-indigo-700 ' },
 ].map(({ label, value, bg, num }) => (
 <div key={label} className={`${bg} rounded-xl border border-slate-200 px-4 py-4`}>
 <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
 <p className={`text-3xl font-bold ${num}`}>{value}</p>
 </div>
 ))}
 </div>

 {/* Tabs */}
 <div className="flex border-b border-slate-200 mb-5 bg-white rounded-t-xl px-2 pt-1">
 {['products', 'users'].map(t => (
 <button
 key={t}
 onClick={() => setTab(t)}
 className={`px-5 py-3 text-sm font-medium border-b-2 transition -mb-px ${
 tab === t
 ? 'border-indigo-600 text-indigo-600 '
 : 'border-transparent text-slate-500 hover:text-slate-700 '
 }`}
 >
 {t === 'products' ? `Auctions (${products.length})` : `Users (${users.length})`}
 </button>
 ))}
 </div>

 {loading ? (
 <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
 ) : tab === 'products' ? (
 <>
 <div className="mb-4 relative">
 <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
 </svg>
 <input
 type="text"
 value={search}
 onChange={e => setSearch(e.target.value)}
 placeholder="Search by title or seller…"
 className="w-full sm:w-80 pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
 />
 </div>
 <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
 {filteredProducts.map(p => (
 <div key={p.productId} className="px-4 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition">
 <div className="flex-1 min-w-0">
 <Link to={`/products/${p.productId}`} className="font-semibold text-slate-800 hover:text-indigo-600 transition text-sm truncate block">
 {p.title}
 </Link>
 <p className="text-xs text-slate-500 mt-0.5">{p.sellerName} · {p.categoryName} · {p.bidCount} bid{p.bidCount !== 1 ? 's' : ''}</p>
 </div>
 <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusStyles[p.status]}`}>{p.status}</span>
 <Link to={`/admin/reports/${p.productId}`} className="text-xs font-medium text-slate-500 hover:text-indigo-600 border border-slate-200 rounded-lg px-2.5 py-1 transition shrink-0">
 Report
 </Link>
 {p.status === 'ACTIVE' && (
 <button onClick={() => handleFreeze(p)} className="text-xs font-semibold bg-amber-500 text-white rounded-lg px-3 py-1.5 hover:bg-amber-600 transition shrink-0">
 Freeze
 </button>
 )}
 {p.status === 'FROZEN' && (
 <button onClick={() => handleUnfreeze(p)} className="text-xs font-semibold bg-emerald-600 text-white rounded-lg px-3 py-1.5 hover:bg-emerald-700 transition shrink-0">
 Unfreeze
 </button>
 )}
 {(p.status === 'ACTIVE' || p.status === 'FROZEN') && p.bidCount > 0 && (
 <button onClick={() => handleDeclareWinner(p)} className="text-xs font-semibold bg-indigo-600 text-white rounded-lg px-3 py-1.5 hover:bg-indigo-700 transition shrink-0">
 Declare Winner
 </button>
 )}
 </div>
 ))}
 {filteredProducts.length === 0 && (
 <p className="text-center text-slate-400 text-sm py-10">No auctions match your search.</p>
 )}
 </div>
 </>
 ) : (
 <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
 <table className="w-full text-sm">
 <thead>
 <tr className="bg-slate-50 border-b border-slate-200 ">
 {['Member', 'Email', 'Role'].map(h => (
 <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 ">
 {users.map(u => (
 <tr key={u.userId} className="hover:bg-slate-50 transition">
 <td className="px-4 py-3">
 <div className="flex items-center gap-3">
 <div className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${roleAvatarBg[u.role] || 'bg-slate-100 text-slate-600'}`}>
 {u.name?.[0]?.toUpperCase() || '?'}
 </div>
 <span className="font-medium text-slate-800 ">{u.name}</span>
 </div>
 </td>
 <td className="px-4 py-3 text-slate-500 text-sm">{u.email}</td>
 <td className="px-4 py-3">
 <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${roleBadge[u.role] || 'bg-slate-100 text-slate-600'}`}>{u.role}</span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>
 </div>
 );
}
