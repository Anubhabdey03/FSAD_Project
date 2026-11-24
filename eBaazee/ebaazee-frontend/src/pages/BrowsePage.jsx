import { useEffect, useState, useMemo } from 'react';
import { getProducts } from '../api/products';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';

const CATEGORIES = [
 { id: null, name: 'All', icon: '◈' },
 { id: 1, name: 'Electronics', icon: '⌬' },
 { id: 2, name: 'Fashion', icon: '◉' },
 { id: 3, name: 'Books', icon: '▣' },
 { id: 4, name: 'Home & Garden', icon: '⬡' },
];

export default function BrowsePage() {
 const [products, setProducts] = useState([]);
 const [activeCat, setActiveCat] = useState(null);
 const [search, setSearch] = useState('');
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
 setLoading(true);
 setMounted(false);
 getProducts(activeCat)
 .then(r => { setProducts(r.data); setTimeout(() => setMounted(true), 50); })
 .catch(() => setError('Failed to load products.'))
 .finally(() => setLoading(false));
 }, [activeCat]);

 const filtered = useMemo(() =>
 products.filter(p => p.title.toLowerCase().includes(search.toLowerCase())),
 [products, search]
 );

 return (
 <div className="bg-slate-50 min-h-screen">
 {/* Top bar */}
 <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
 <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div>
 <h1 className="text-xl font-bold text-slate-900 ">Browse Auctions</h1>
 <p className="text-xs text-slate-500 mt-0.5">
 {loading ? 'Loading…' : `${filtered.length} listing${filtered.length !== 1 ? 's' : ''} available`}
 </p>
 </div>
 <div className="relative w-full sm:w-72">
 <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
 </svg>
 <input
 type="text" value={search} onChange={e => setSearch(e.target.value)}
 placeholder="Search auctions…"
 className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 bg-slate-50 transition"
 />
 {search && (
 <button onClick={() => setSearch('')}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 ">
 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 )}
 </div>
 </div>

 {/* Category pills */}
 <div className="max-w-7xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
 {CATEGORIES.map(c => (
 <button key={c.id} onClick={() => setActiveCat(c.id)}
 className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
 activeCat === c.id
 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105'
 : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:scale-105'
 }`}>
 {c.name}
 </button>
 ))}
 </div>
 </div>

 <div className="max-w-7xl mx-auto px-4 py-6">
 {error && <p className="text-red-500 text-center py-10">{error}</p>}

 {loading && (
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
 {Array.from({ length: 12 }).map((_, i) => (
 <Skeleton key={i} className="h-72 rounded-2xl" />
 ))}
 </div>
 )}

 {!loading && !error && filtered.length === 0 && (
 <div className="flex flex-col items-center justify-center py-28 text-slate-400 ">
 <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
 <svg className="w-7 h-7 text-slate-400 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
 </svg>
 </div>
 <p className="text-base font-semibold text-slate-600 ">No auctions found</p>
 <p className="text-sm mt-1">Try a different category or search term.</p>
 </div>
 )}

 {!loading && !error && filtered.length > 0 && (
 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 pb-10">
 {filtered.map((p, i) => (
 <div key={p.productId}
 style={{ transitionDelay: `${Math.min(i * 40, 400)}ms` }}
 className={`transition-all duration-500 ${
 mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
 }`}>
 <ProductCard product={p} />
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 );
}
