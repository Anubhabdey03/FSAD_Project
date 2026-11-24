import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listProduct } from '../api/seller';
import { useToast } from '../context/ToastContext';

const CATEGORIES = [
 { id: 1, name: 'Electronics' },
 { id: 2, name: 'Fashion' },
 { id: 3, name: 'Books' },
 { id: 4, name: 'Home & Garden' },
];

const TIPS = [
 {
 text: 'Add an image URL for better visibility',
 icon: (
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
 </svg>
 ),
 },
 {
 text: 'Set a realistic min bid to attract buyers',
 icon: (
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 ),
 },
 {
 text: '24–72 hours works best for most auctions',
 icon: (
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 ),
 },
 {
 text: 'Write a clear, honest description',
 icon: (
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
 </svg>
 ),
 },
];

function validate(form) {
 const e = {};
 if (form.title.trim().length < 3) e.title = 'Title must be at least 3 characters';
 if (!form.minBid || parseFloat(form.minBid) <= 0) e.minBid = 'Min bid must be greater than 0';
 if (!form.maxBid || parseFloat(form.maxBid) <= parseFloat(form.minBid)) e.maxBid = 'Max bid must be greater than min bid';
 if (!form.durationHours || Number(form.durationHours) < 1 || Number(form.durationHours) > 720) e.durationHours = 'Duration must be between 1 and 720 hours';
 return e;
}

export default function NewProductPage() {
 const navigate = useNavigate();
 const { showToast } = useToast();
 const [form, setForm] = useState({ title: '', description: '', imageUrl: '', categoryId: 1, minBid: '', maxBid: '', durationHours: 24 });
 const [errors, setErrors] = useState({});
 const [loading, setLoading] = useState(false);

 const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

 const handleSubmit = async (e) => {
 e.preventDefault();
 const errs = validate(form);
 if (Object.keys(errs).length) { setErrors(errs); return; }
 setErrors({});
 setLoading(true);
 try {
 await listProduct({
 ...form,
 categoryId: Number(form.categoryId),
 minBid: parseFloat(form.minBid),
 maxBid: parseFloat(form.maxBid),
 durationHours: Number(form.durationHours),
 });
 showToast('Listing created!', 'success');
 navigate('/seller/dashboard');
 } catch (err) {
 showToast(err.response?.data?.message || err.response?.data || 'Failed to create listing.', 'error');
 } finally {
 setLoading(false);
 }
 };

 const fieldClass = (k) =>
 `w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition ${errors[k] ? 'border-red-400 bg-red-50 ' : 'border-slate-300 bg-white '}`;

 return (
 <div className="max-w-4xl mx-auto px-4 py-8">
 <div className="flex flex-col lg:flex-row gap-6 items-start">
 {/* Tips panel */}
 <div className="w-full lg:w-5/12 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white rounded-2xl p-8">
 <h2 className="text-lg font-bold mb-6">Listing Tips</h2>
 <div className="space-y-5">
 {TIPS.map(t => (
 <div key={t.text} className="flex items-start gap-3">
 <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
 {t.icon}
 </div>
 <p className="text-sm text-indigo-100 leading-relaxed pt-1.5">{t.text}</p>
 </div>
 ))}
 </div>
 </div>

 {/* Form panel */}
 <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-8">
 <h1 className="text-xl font-bold text-slate-800 mb-6">New Auction Listing</h1>

 <form onSubmit={handleSubmit} className="space-y-5">
 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
 <input value={form.title} onChange={set('title')} className={fieldClass('title')} placeholder="e.g. Vintage Camera" />
 {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
 <textarea value={form.description} onChange={set('description')} rows={3} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-vertical" placeholder="Describe your item…" />
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Image URL <span className="text-slate-400">（optional）</span></label>
 <input value={form.imageUrl} onChange={set('imageUrl')} className={fieldClass('imageUrl')} placeholder="https://..." />
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
 <select value={form.categoryId} onChange={set('categoryId')} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white">
 {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
 </select>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Min Bid (₹)</label>
 <input type="number" step="0.01" value={form.minBid} onChange={set('minBid')} className={fieldClass('minBid')} placeholder="500" />
 {errors.minBid && <p className="text-xs text-red-500 mt-1">{errors.minBid}</p>}
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Max Bid (₹)</label>
 <input type="number" step="0.01" value={form.maxBid} onChange={set('maxBid')} className={fieldClass('maxBid')} placeholder="2000" />
 {errors.maxBid && <p className="text-xs text-red-500 mt-1">{errors.maxBid}</p>}
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Duration (hours)</label>
 <input type="number" min={1} max={720} value={form.durationHours} onChange={set('durationHours')} className={fieldClass('durationHours')} />
 {errors.durationHours && <p className="text-xs text-red-500 mt-1">{errors.durationHours}</p>}
 </div>

 <div className="flex gap-3 pt-2">
 <button type="button" onClick={() => navigate('/seller/dashboard')} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition">
 Cancel
 </button>
 <button type="submit" disabled={loading} className="flex-[2] py-2.5 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-60">
 {loading ? 'Creating…' : 'Create Listing'}
 </button>
 </div>
 </form>
 </div>
 </div>
 </div>
 );
}
