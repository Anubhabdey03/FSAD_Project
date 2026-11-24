import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
 const [form, setForm] = useState({ name: '', email: '', password: '', role: 'BUYER' });
 const [errors, setErrors] = useState({});
 const [loading, setLoading] = useState(false);
 const { login } = useAuth();
 const { showToast } = useToast();
 const navigate = useNavigate();

 const validate = () => {
 const e = {};
 if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
 if (!emailRegex.test(form.email)) e.email = 'Enter a valid email address';
 if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
 return e;
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 const e2 = validate();
 if (Object.keys(e2).length) { setErrors(e2); return; }
 setErrors({});
 setLoading(true);
 try {
 const res = await registerApi(form);
 const { token, role, name, userId } = res.data;
 login(token, role, name, userId);
 showToast('Account created!', 'success');
 if (role === 'SELLER') navigate('/seller/dashboard');
 else navigate('/browse');
 } catch (err) {
 showToast(err.response?.data?.error || 'Registration failed', 'error');
 } finally {
 setLoading(false);
 }
 };

 const fieldClass = (k) =>
 `w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition ${errors[k] ? 'border-red-400 bg-red-50 ' : 'border-slate-300 bg-white '}`;

 return (
 <div className="min-h-screen flex">
 {/* Left branding panel */}
 <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-indigo-600 to-indigo-900 flex-col justify-between p-12 text-white">
 <div>
 <span className="text-2xl font-extrabold tracking-tight">eBaazee</span>
 </div>
 <div>
 <h2 className="text-4xl font-extrabold leading-tight mb-4">
 Join the<br />auction.
 </h2>
 <p className="text-indigo-200 text-base leading-relaxed max-w-xs mb-10">
 Create a free account and start buying or selling on India's sealed-bid auction platform.
 </p>
 <div className="space-y-4">
 {[
 {
 text: 'Browse & bid on live auctions',
 icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m5-9l2 9" /></svg>,
 },
 {
 text: 'List your items and reach buyers',
 icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
 },
 {
 text: 'Sealed bids — fair for everyone',
 icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
 },
 ].map(f => (
 <div key={f.text} className="flex items-center gap-3 text-sm text-indigo-100">
 <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
 {f.icon}
 </div>
 <span>{f.text}</span>
 </div>
 ))}
 </div>
 </div>
 <p className="text-indigo-400 text-xs">FSAD Project · KT_eBaazee.Com_021</p>
 </div>

 {/* Right form panel */}
 <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50 ">
 <div className="w-full max-w-md">
 <div className="mb-8">
 <h1 className="text-3xl font-extrabold text-slate-800 ">Create your account</h1>
 <p className="text-slate-500 text-sm mt-1">Join eBaazee and start bidding today.</p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-5">
 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
 <input
 value={form.name}
 onChange={e => setForm({ ...form, name: e.target.value })}
 placeholder="Your full name"
 className={fieldClass('name')}
 />
 {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
 <input
 type="email"
 value={form.email}
 onChange={e => setForm({ ...form, email: e.target.value })}
 placeholder="you@example.com"
 className={fieldClass('email')}
 />
 {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
 <input
 type="password"
 value={form.password}
 onChange={e => setForm({ ...form, password: e.target.value })}
 placeholder="Min. 6 characters"
 className={fieldClass('password')}
 />
 {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 mb-2">I want to</label>
 <div className="grid grid-cols-2 gap-3">
 {[
 {
 role: 'BUYER',
 label: 'Buy',
 sub: 'Browse & bid on auctions',
 icon: (
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m5-9l2 9" />
 </svg>
 ),
 },
 {
 role: 'SELLER',
 label: 'Sell',
 sub: 'List items & reach buyers',
 icon: (
 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
 </svg>
 ),
 },
 ].map(({ role: r, label, sub, icon }) => (
 <button
 key={r}
 type="button"
 onClick={() => setForm({ ...form, role: r })}
 className={`py-4 px-4 rounded-xl border-2 text-left transition-all ${
 form.role === r
 ? 'border-indigo-500 bg-indigo-50 shadow-sm'
 : 'border-slate-200 bg-white hover:border-slate-300 '
 }`}
 >
 <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 ${
 form.role === r ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 '
 }`}>
 {icon}
 </div>
 <p className={`text-sm font-bold mb-0.5 ${form.role === r ? 'text-indigo-700 ' : 'text-slate-700 '}`}>{label}</p>
 <p className="text-xs text-slate-400 leading-tight">{sub}</p>
 </button>
 ))}
 </div>
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-sm"
 >
 {loading ? 'Creating account…' : 'Create account'}
 </button>
 </form>

 <p className="text-center text-sm text-slate-500 mt-6">
 Already have an account?{' '}
 <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
 </p>
 </div>
 </div>
 </div>
 );
}
