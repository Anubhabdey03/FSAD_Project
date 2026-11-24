import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../api/products';
import { placeBid, purchaseProduct, getMyBids } from '../api/bids';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CountdownTimer from '../components/CountdownTimer';
import BidStatsPanel from '../components/BidStatsPanel';
import Skeleton from '../components/Skeleton';

const statusStyles = {
 ACTIVE: 'bg-emerald-100 text-emerald-700 ',
 FROZEN: 'bg-amber-100 text-amber-700 ',
 CLOSED: 'bg-red-100 text-red-700 ',
};

export default function ProductDetailPage() {
 const { id } = useParams();
 const { auth } = useAuth();
 const { showToast } = useToast();
 const role = auth?.role;

 const [product, setProduct] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [bidAmount, setBidAmount] = useState('');
 const [bidError, setBidError] = useState('');
 const [bidPlaced, setBidPlaced] = useState(false);
 const [myBids, setMyBids] = useState([]);

 const loadProduct = () =>
 getProduct(id).then(r => setProduct(r.data)).catch(() => setError('Product not found.'));

 useEffect(() => {
 setLoading(true);
 const promises = [loadProduct()];
 if (role === 'BUYER') {
 promises.push(getMyBids().then(r => setMyBids(r.data)).catch(() => {}));
 }
 Promise.all(promises).finally(() => setLoading(false));
 }, [id, role]);

 const handleBid = async (e) => {
 e.preventDefault();
 setBidError('');
 const amount = parseFloat(bidAmount);
 if (isNaN(amount) || amount < product.minBid || amount > product.maxBid) {
 setBidError(`Amount must be between ₹${product.minBid} and ₹${product.maxBid}`);
 return;
 }
 try {
 await placeBid(id, amount);
 showToast('Bid placed successfully!', 'success');
 setBidAmount('');
 setBidPlaced(true);
 loadProduct();
 } catch (err) {
 showToast(err.response?.data?.error || err.response?.data?.message || 'Failed to place bid.', 'error');
 }
 };

 const handlePurchase = async () => {
 try {
 await purchaseProduct(id);
 showToast('Purchase confirmed! Check your email.', 'success');
 loadProduct();
 } catch (err) {
 showToast(err.response?.data?.error || err.response?.data?.message || 'Failed to purchase.', 'error');
 }
 };

 if (loading) return (
 <div className="max-w-5xl mx-auto px-4 py-8">
 <Skeleton className="h-4 w-48 mb-6 rounded" />
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div><Skeleton className="h-80 w-full mb-4 rounded-2xl" /><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-4 w-full mb-1" /><Skeleton className="h-4 w-5/6" /></div>
 <div><Skeleton className="h-48 w-full mb-4 rounded-2xl" /><Skeleton className="h-12 w-full rounded-xl" /></div>
 </div>
 </div>
 );

 if (error || !product) return (
 <div className="flex flex-col items-center justify-center min-h-64 text-slate-400 ">
 <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
 <svg className="w-7 h-7 text-slate-400 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 </div>
 <p className="text-base font-semibold text-slate-600 ">{error || 'Product not found'}</p>
 <Link to="/browse" className="mt-3 text-indigo-600 text-sm font-medium hover:underline">Back to Browse</Link>
 </div>
 );

 const { title, description, imageUrl, minBid, maxBid, status, endTime, categoryName, sellerName, sellerId } = product;
 const isOwnProduct = role === 'SELLER' && sellerId === auth?.userId;
 const myBidOnThis = myBids.find(b => b.productId === product.productId);
 const isLikelyWinner = myBidOnThis != null;

 return (
 <div className="bg-slate-50 min-h-screen">
 {/* Breadcrumb */}
 <div className="bg-white border-b border-slate-200 ">
 <div className="max-w-5xl mx-auto px-4 py-3">
 <nav className="flex items-center gap-1.5 text-sm text-slate-500 ">
 <Link to="/browse" className="hover:text-indigo-600 transition-colors font-medium">Browse</Link>
 <svg className="w-3.5 h-3.5 text-slate-300 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
 </svg>
 <span className="text-slate-800 font-medium truncate max-w-xs">{title}</span>
 </nav>
 </div>
 </div>

 <div className="max-w-5xl mx-auto px-4 py-8">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
 {/* Left: image + info */}
 <div>
 <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-slate-200 h-80 flex items-center justify-center mb-6 shadow-sm">
 {imageUrl
 ? <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
 : <span className="text-6xl font-bold text-indigo-300 ">{categoryName?.[0] || '?'}</span>
 }
 </div>

 <div className="flex items-center gap-2 mb-3">
 <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${statusStyles[status] || 'bg-slate-100 text-slate-600 '}`}>
 {status === 'ACTIVE' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
 {status}
 </span>
 <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{categoryName}</span>
 </div>

 <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
 {description && <p className="text-slate-600 text-sm mb-5 leading-relaxed">{description}</p>}

 <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 text-sm">
 {[
 ['Seller', sellerName],
 ['Bid range', `₹${minBid} – ₹${maxBid}`],
 ['Ends', <CountdownTimer endTime={endTime} />],
 ].map(([k, v]) => (
 <div key={k} className="flex items-center px-4 py-3 gap-4">
 <span className="text-slate-500 w-20 shrink-0 text-xs font-medium uppercase tracking-wide">{k}</span>
 <span className="font-medium text-slate-800 ">{v}</span>
 </div>
 ))}
 </div>
 </div>

 {/* Right: stats + actions */}
 <div className="space-y-5">
 <BidStatsPanel productId={id} />

 {/* Seller viewing own product */}
 {isOwnProduct && (
 <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 text-sm text-indigo-700 ">
 You listed this product — bidding is not available on your own auctions.
 </div>
 )}

 {/* Buyer bid form */}
 {role === 'BUYER' && status === 'ACTIVE' && !bidPlaced && (
 <div className="bg-white rounded-xl border border-slate-200 p-5">
 <h3 className="font-bold text-slate-800 mb-1">Place Your Bid</h3>
 <p className="text-xs text-slate-500 mb-4">Enter any amount between ₹{minBid.toLocaleString()} and ₹{maxBid.toLocaleString()}</p>

 {/* Live range indicator */}
 {bidAmount && !isNaN(parseFloat(bidAmount)) && (() => {
 const amt = parseFloat(bidAmount);
 const pct = Math.min(100, Math.max(0, ((amt - minBid) / (maxBid - minBid)) * 100));
 const inRange = amt >= minBid && amt <= maxBid;
 return (
 <div className="mb-3">
 <div className="flex justify-between text-[10px] text-slate-400 mb-1">
 <span>₹{minBid.toLocaleString()}</span>
 <span className={`font-semibold ${inRange ? 'text-indigo-600 ' : 'text-red-500'}`}>
 ₹{amt.toLocaleString()}
 </span>
 <span>₹{maxBid.toLocaleString()}</span>
 </div>
 <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
 <div className={`h-full rounded-full transition-all duration-150 ${inRange ? 'bg-indigo-500' : 'bg-red-400'}`}
 style={{ width: `${pct}%` }} />
 </div>
 </div>
 );
 })()}

 <form onSubmit={handleBid} className="flex gap-2">
 <input
 type="number" step="0.01"
 value={bidAmount}
 onChange={e => setBidAmount(e.target.value)}
 placeholder={`e.g. ₹${Math.round((minBid + maxBid) / 2).toLocaleString()}`}
 className="flex-1 px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition"
 />
 <button type="submit"
 className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 active:scale-95 transition-all">
 Place Bid
 </button>
 </form>
 {bidError && <p className="text-xs text-red-500 mt-2">{bidError}</p>}
 </div>
 )}

 {role === 'BUYER' && status === 'ACTIVE' && bidPlaced && (
 <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-4 flex items-start gap-3">
 <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
 <svg className="w-4 h-4 text-emerald-600 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
 </svg>
 </div>
 <div>
 <p className="text-sm font-bold text-emerald-800 ">Bid placed!</p>
 <p className="text-xs text-emerald-600 mt-0.5">You'll be notified if you win when the auction closes.</p>
 </div>
 </div>
 )}

 {role === 'BUYER' && status === 'FROZEN' && (
 isLikelyWinner ? (
 <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
 <div className="flex items-center gap-2 mb-3">
 <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
 <svg className="w-4 h-4 text-amber-600 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 </div>
 <p className="text-sm font-bold text-slate-800 ">Auction frozen</p>
 </div>
 <p className="text-xs text-slate-600 mb-4">You placed a bid. If you're the highest bidder, you can purchase now.</p>
 <button
 onClick={handlePurchase}
 className="w-full py-2.5 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 active:scale-95 transition-all">
 Purchase Now
 </button>
 </div>
 ) : (
 <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 ">
 This auction is frozen. Only the highest bidder can purchase.
 </div>
 )
 )}

 {status === 'CLOSED' && (
 <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-slate-500 ">
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
 </svg>
 This auction has closed.
 </div>
 )}

 {!role && (
 <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600 ">
 <Link to="/login" className="text-primary font-medium hover:underline">Login</Link> to place a bid.
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 );
}
