import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getReport } from '../api/reports';
import { declareWinner } from '../api/admin';
import { useToast } from '../context/ToastContext';
import Skeleton from '../components/Skeleton';

const statusStyles = {
 ACTIVE: 'bg-emerald-100 text-emerald-700 ',
 FROZEN: 'bg-amber-100 text-amber-700 ',
 CLOSED: 'bg-slate-100 text-slate-500 ',
};

const medals = ['🥇', '🥈', '🥉'];

export default function AdminReportPage() {
 const { id } = useParams();
 const navigate = useNavigate();
 const { showToast } = useToast();
 const [report, setReport] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [declaring, setDeclaring] = useState(false);

 useEffect(() => {
 setLoading(true);
 setError('');
 getReport(id)
 .then(r => setReport(r.data))
 .catch(err => {
 const msg = err.response?.data?.message || err.response?.data || 'Failed to load report.';
 setError(typeof msg === 'string' ? msg : 'Failed to load report.');
 })
 .finally(() => setLoading(false));
 }, [id]);

 const handleDeclareWinner = async () => {
 if (!window.confirm(`Declare winner for "${report.product.title}"?\n\nThis will assign the highest bidder as the winner and close the auction immediately.`)) return;
 setDeclaring(true);
 try {
 await declareWinner(id);
 showToast('Winner declared — auction closed!', 'success');
 navigate('/admin/dashboard');
 } catch (err) {
 showToast(err.response?.data?.message || 'Failed to declare winner', 'error');
 setDeclaring(false);
 }
 };

 if (loading) return (
 <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
 <div className="grid grid-cols-4 gap-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
 <Skeleton className="h-64 rounded-xl" />
 </div>
 );

 if (error || !report) return (
 <div className="flex flex-col items-center justify-center min-h-64 text-slate-400 ">
 <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
 <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01M5.07 19H19a2 2 0 001.73-3L13.73 4a2 2 0 00-3.46 0L3.27 16A2 2 0 005.07 19z" />
 </svg>
 </div>
 <p className="text-sm font-semibold text-slate-600 mb-1">{error || 'Report not found'}</p>
 <Link to="/admin/dashboard" className="mt-2 text-indigo-600 text-sm font-medium hover:underline">← Back to Dashboard</Link>
 </div>
 );

 const { product, bidCount, highest, lowest, average, bids = [] } = report;

 const tiles = [
 { label: 'Total Bids', value: bidCount,
 colour: 'text-slate-800 ', bg: 'bg-white ' },
 { label: 'Highest Bid', value: highest != null ? `₹${Number(highest).toLocaleString()}` : '—',
 colour: 'text-emerald-700 ', bg: 'bg-emerald-50 ' },
 { label: 'Lowest Bid', value: lowest != null ? `₹${Number(lowest).toLocaleString()}` : '—',
 colour: 'text-blue-700 ', bg: 'bg-blue-50 ' },
 { label: 'Average Bid', value: average ? `₹${Number(average).toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '—',
 colour: 'text-indigo-700 ', bg: 'bg-indigo-50 ' },
 ];

 return (
 <div className="bg-slate-50 min-h-screen">
 {/* Header */}
 <div className="bg-white border-b border-slate-200 ">
 <div className="max-w-3xl mx-auto px-4 py-5">
 <Link
 to="/admin/dashboard"
 className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition mb-3"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
 </svg>
 Back to Dashboard
 </Link>
 <div className="flex items-start justify-between gap-4">
 <div>
 <h1 className="text-xl font-bold text-slate-900 ">Auction Report</h1>
 <p className="text-sm text-slate-600 mt-0.5 font-medium">{product.title}</p>
 </div>
 <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
 {product.status && (
 <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[product.status] || 'bg-slate-100 text-slate-600'}`}>
 {product.status}
 </span>
 )}
 {product.categoryName && (
 <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{product.categoryName}</span>
 )}
 {(product.status === 'ACTIVE' || product.status === 'FROZEN') && bids.length > 0 && (
 <button
 onClick={handleDeclareWinner}
 disabled={declaring}
 className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
 >
 {declaring ? 'Declaring…' : 'Declare Winner'}
 </button>
 )}
 </div>
 </div>
 </div>
 </div>

 <div className="max-w-3xl mx-auto px-4 py-6">
 {/* Stat tiles */}
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
 {tiles.map(({ label, value, colour, bg }) => (
 <div key={label} className={`${bg} rounded-xl border border-slate-200 px-4 py-4`}>
 <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
 <p className={`text-2xl font-bold ${colour}`}>{value}</p>
 </div>
 ))}
 </div>

 {/* Bids table */}
 <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">All Bids</h2>
 {bids.length === 0 ? (
 <div className="bg-white rounded-xl border border-slate-200 py-12 text-center">
 <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
 <svg className="w-5 h-5 text-slate-400 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
 </svg>
 </div>
 <p className="text-sm font-medium text-slate-500 ">No bids placed on this product yet.</p>
 </div>
 ) : (
 <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
 <table className="w-full text-sm">
 <thead>
 <tr className="bg-slate-50 border-b border-slate-200 ">
 {['Rank', 'Bidder', 'Amount', 'Time'].map(h => (
 <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 ">
 {[...bids]
 .sort((x, y) => y.amount - x.amount)
 .map((bid, i) => (
 <tr key={bid.bidId} className={`transition ${i === 0 ? 'bg-emerald-50/50 ' : 'hover:bg-slate-50 '}`}>
 <td className="px-4 py-3 text-sm">{medals[i] ?? <span className="text-slate-400 text-xs font-medium">{i + 1}</span>}</td>
 <td className="px-4 py-3 font-medium text-slate-800 ">{bid.userName}</td>
 <td className={`px-4 py-3 font-bold ${i === 0 ? 'text-emerald-700 ' : 'text-slate-700 '}`}>
 ₹{Number(bid.amount).toLocaleString()}
 </td>
 <td className="px-4 py-3 text-slate-500 text-xs">
 {bid.bidTime ? new Date(bid.bidTime).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
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
