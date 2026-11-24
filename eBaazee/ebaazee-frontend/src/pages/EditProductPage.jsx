import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct } from '../api/products';
import { updateProduct } from '../api/seller';
import { useToast } from '../context/ToastContext';

const CATEGORIES = [
 { id: 1, name: 'Electronics' },
 { id: 2, name: 'Fashion' },
 { id: 3, name: 'Books' },
 { id: 4, name: 'Home & Garden' },
];

function validate(form) {
 const e = {};
 if (form.title.trim().length < 3) e.title = 'Title must be at least 3 characters';
 if (!form.minBid || parseFloat(form.minBid) <= 0) e.minBid = 'Min bid must be greater than 0';
 if (!form.maxBid || parseFloat(form.maxBid) <= parseFloat(form.minBid)) e.maxBid = 'Max bid must be greater than min bid';
 if (!form.durationHours || Number(form.durationHours) < 1 || Number(form.durationHours) > 720) e.durationHours = 'Duration must be between 1 and 720 hours';
 return e;
}

export default function EditProductPage() {
 const { id } = useParams();
 const navigate = useNavigate();
 const { showToast } = useToast();
 const [form, setForm] = useState(null);
 const [errors, setErrors] = useState({});
 const [loading, setLoading] = useState(false);

 useEffect(() => {
 getProduct(id).then(r => {
 const p = r.data;
 const start = new Date(p.startTime || p.endTime);
 const end = new Date(p.endTime);
 const hours = Math.max(1, Math.round((end - start) / 3600000));
 setForm({
 title: p.title,
 description: p.description || '',
 imageUrl: p.imageUrl || '',
 categoryId: p.categoryId || 1,
 minBid: p.minBid,
 maxBid: p.maxBid,
 durationHours: hours,
 });
 }).catch(() => {
 showToast('Product not found.', 'error');
 navigate('/seller/dashboard');
 });
 }, [id]);

 const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

 const handleSubmit = async (e) => {
 e.preventDefault();
 const errs = validate(form);
 if (Object.keys(errs).length) { setErrors(errs); return; }
 setErrors({});
 setLoading(true);
 try {
 await updateProduct(Number(id), {
 ...form,
 categoryId: Number(form.categoryId),
 minBid: parseFloat(form.minBid),
 maxBid: parseFloat(form.maxBid),
 durationHours: Number(form.durationHours),
 });
 showToast('Listing updated!', 'success');
 navigate('/seller/dashboard');
 } catch (err) {
 showToast(err.response?.data?.message || err.response?.data || 'Failed to update listing.', 'error');
 } finally {
 setLoading(false);
 }
 };

 if (!form) return <div className="flex items-center justify-center min-h-64 text-slate-400">Loading…</div>;

 const fieldClass = (k) =>
 `w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition ${errors[k] ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white'}`;

 return (
 <div className="max-w-xl mx-auto px-4 py-8">
 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
 <h1 className="text-xl font-bold text-slate-800 mb-6">Edit Listing</h1>

 <form onSubmit={handleSubmit} className="space-y-5">
 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
 <input value={form.title} onChange={set('title')} className={fieldClass('title')} />
 {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
 <textarea value={form.description} onChange={set('description')} rows={3} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-vertical" />
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Image URL <span className="text-slate-400">(optional)</span></label>
 <input value={form.imageUrl} onChange={set('imageUrl')} className={fieldClass('imageUrl')} />
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
 <input type="number" step="0.01" value={form.minBid} onChange={set('minBid')} className={fieldClass('minBid')} />
 {errors.minBid && <p className="text-xs text-red-500 mt-1">{errors.minBid}</p>}
 </div>
 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Max Bid (₹)</label>
 <input type="number" step="0.01" value={form.maxBid} onChange={set('maxBid')} className={fieldClass('maxBid')} />
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
 {loading ? 'Saving…' : 'Save Changes'}
 </button>
 </div>
 </form>
 </div>
 </div>
 );
}
