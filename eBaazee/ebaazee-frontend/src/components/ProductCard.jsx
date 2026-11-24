import { Link } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';

const statusConfig = {
 ACTIVE: { style: 'bg-emerald-100 text-emerald-700 ', dot: 'bg-emerald-500', pulse: true },
 FROZEN: { style: 'bg-amber-100 text-amber-700 ', dot: 'bg-amber-500', pulse: false },
 CLOSED: { style: 'bg-slate-100 text-slate-500 ', dot: 'bg-slate-400', pulse: false },
};

export default function ProductCard({ product }) {
 const { productId, title, imageUrl, minBid, maxBid, status, endTime, bidCount, categoryName } = product;
 const cfg = statusConfig[status] || statusConfig.CLOSED;

 return (
 <Link to={`/products/${productId}`} className="group block no-underline text-inherit h-full">
 <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden
 group-hover:shadow-xl group-hover:shadow-indigo-100 group-hover:-translate-y-1
 group-hover:border-indigo-200 
 transition-all duration-250 h-full flex flex-col">

 {/* Image */}
 <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-slate-100 overflow-hidden shrink-0">
 {imageUrl
 ? <img src={imageUrl} alt={title}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400" />
 : <div className="w-full h-full flex items-center justify-center">
 <span className="text-5xl font-bold text-slate-200 ">{categoryName?.[0] || '?'}</span>
 </div>
 }
 {/* Status badge */}
 <span className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1.5
 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${cfg.style}`}>
 <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${cfg.pulse ? 'animate-pulse' : ''}`} />
 {status}
 </span>
 {/* Bid count pill — bottom left */}
 <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1
 bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold
 px-2 py-0.5 rounded-full">
 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
 d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
 </svg>
 {bidCount} bid{bidCount !== 1 ? 's' : ''}
 </span>
 </div>

 {/* Content */}
 <div className="p-4 flex flex-col flex-1 gap-2">
 <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{categoryName}</span>

 <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 flex-1 group-hover:text-indigo-700 transition-colors">
 {title}
 </h3>

 <div className="flex items-center justify-between pt-2 border-t border-slate-100 ">
 <div>
 <p className="text-[10px] text-slate-400 mb-0.5">Bid range</p>
 <p className="text-sm font-bold text-indigo-600 ">
 ₹{minBid.toLocaleString()} – ₹{maxBid.toLocaleString()}
 </p>
 </div>
 <div className="text-right">
 <p className="text-[10px] text-slate-400 mb-0.5">
 {status === 'ACTIVE' ? 'Ends in' : 'Status'}
 </p>
 {status === 'ACTIVE'
 ? <CountdownTimer endTime={endTime} />
 : <span className="text-xs font-semibold text-slate-500 ">{status}</span>
 }
 </div>
 </div>
 </div>
 </div>
 </Link>
 );
}
