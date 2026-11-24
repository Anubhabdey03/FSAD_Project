import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEMO_ACCOUNTS = [
 {
 label: 'Admin',
 name: 'Administrator',
 role: 'ADMIN',
 email: 'admin@ebaazee.com',
 password: 'Admin@123',
 iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
 badge: 'bg-red-100 text-red-600 ',
 ring: 'ring-red-200 hover:ring-red-400 ',
 avatar: 'bg-red-500',
 },
 {
 label: 'Seller 1',
 name: 'Anubhab Dey',
 role: 'SELLER',
 email: 'Anubhab@gmail.com',
 password: 'Admin@123',
 iconPath: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
 badge: 'bg-indigo-100 text-indigo-600 ',
 ring: 'ring-indigo-200 hover:ring-indigo-400 ',
 avatar: 'bg-indigo-500',
 },
 {
 label: 'Seller 2',
 name: 'Priya Patel',
 role: 'SELLER',
 email: 'Priya@gmail.com',
 password: 'Admin@123',
 iconPath: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
 badge: 'bg-violet-100 text-violet-600 ',
 ring: 'ring-violet-200 hover:ring-violet-400 ',
 avatar: 'bg-violet-500',
 },
 {
 label: 'Buyer 1',
 name: 'Rituparna Debnath',
 role: 'BUYER',
 email: 'Rituparna@gmail.com',
 password: 'Admin@123',
 iconPath: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
 badge: 'bg-emerald-100 text-emerald-600 ',
 ring: 'ring-emerald-200 hover:ring-emerald-400 ',
 avatar: 'bg-emerald-500',
 },
 {
 label: 'Buyer 2',
 name: 'Rahul Sharma',
 role: 'BUYER',
 email: 'Rahul@gmail.com',
 password: 'Admin@123',
 iconPath: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
 badge: 'bg-teal-100 text-teal-600 ',
 ring: 'ring-teal-200 hover:ring-teal-400 ',
 avatar: 'bg-teal-500',
 },
];

export default function LoginPage() {
 const [form, setForm] = useState({ email: '', password: '' });
 const [errors, setErrors] = useState({});
 const [loading, setLoading] = useState(false);
 const [activeDemo, setActiveDemo] = useState(null);
 const { login } = useAuth();
 const { showToast } = useToast();
 const navigate = useNavigate();

 const validate = () => {
 const e = {};
 if (!emailRegex.test(form.email)) e.email = 'Enter a valid email address';
 if (!form.password) e.password = 'Password is required';
 return e;
 };

 const doLogin = async (email, password, demoLabel = null) => {
 setErrors({});
 setLoading(true);
 setActiveDemo(demoLabel);
 try {
 const res = await loginApi({ email, password });
 const { token, role, name, userId } = res.data;
 login(token, role, name, userId);
 showToast(`Welcome back, ${name}!`, 'success');
 if (role === 'ADMIN') navigate('/admin/dashboard');
 else if (role === 'SELLER') navigate('/seller/dashboard');
 else navigate('/browse');
 } catch (err) {
 showToast(err.response?.data?.error || 'Login failed', 'error');
 } finally {
 setLoading(false);
 setActiveDemo(null);
 }
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 const e2 = validate();
 if (Object.keys(e2).length) { setErrors(e2); return; }
 doLogin(form.email, form.password);
 };

 return (
 <div className="min-h-screen flex">
 {/* Left panel — branding */}
 <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-indigo-600 to-indigo-900 flex-col justify-between p-12 text-white">
 <div>
 <span className="text-2xl font-extrabold tracking-tight">eBaazee</span>
 </div>
 <div>
 <h2 className="text-4xl font-extrabold leading-tight mb-4">
 Bid. Win.<br />Own.
 </h2>
 <p className="text-indigo-200 text-base leading-relaxed max-w-xs">
 The online auction platform where every bid tells a story. Sealed auctions, live stats, instant wins.
 </p>
 <div className="mt-10 space-y-4">
 {[
 { path: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', text: 'Sealed bidding — one bid per buyer' },
 { path: 'M13 10V3L4 14h7v7l9-11h-7z', text: 'Live WebSocket bid stats' },
 { path: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', text: 'Admin-controlled auction lifecycle' },
 ].map(f => (
 <div key={f.text} className="flex items-center gap-3 text-sm text-indigo-100">
 <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
 <svg className="w-3.5 h-3.5 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.path} />
 </svg>
 </div>
 <span>{f.text}</span>
 </div>
 ))}
 </div>
 </div>
 <p className="text-indigo-400 text-xs">FSAD Project · KT_eBaazee.Com_021</p>
 </div>

 {/* Right panel — form */}
 <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50 ">
 <div className="w-full max-w-md">

 {/* Header */}
 <div className="mb-8">
 <h1 className="text-3xl font-extrabold text-slate-800 ">Welcome back</h1>
 <p className="text-slate-500 text-sm mt-1">Sign in to your eBaazee account</p>
 </div>

 {/* Demo quick-login */}
 <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
 <div className="flex items-center gap-2 mb-4">
 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
 <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Demo accounts — one click login</p>
 </div>
 <div className="grid grid-cols-2 gap-3">
 {DEMO_ACCOUNTS.map(acc => (
 <button
 key={acc.label}
 type="button"
 disabled={loading}
 onClick={() => doLogin(acc.email, acc.password, acc.label)}
 className={`flex items-center gap-3 p-3 rounded-xl border-2 ring-2 ring-transparent transition-all text-left disabled:opacity-50 bg-white ${acc.ring}`}
 >
 <div className={`w-9 h-9 rounded-full ${acc.avatar} text-white flex items-center justify-center text-sm font-bold shrink-0`}>
 {activeDemo === acc.label ? (
 <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
 </svg>
 ) : acc.name[0]}
 </div>
 <div className="min-w-0">
 <div className="text-xs font-bold text-slate-800 truncate">{acc.name}</div>
 <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${acc.badge}`}>
 <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={acc.iconPath} />
 </svg>
 {acc.label}
 </span>
 </div>
 </button>
 ))}
 </div>
 </div>

 {/* Divider */}
 <div className="flex items-center gap-3 mb-6">
 <div className="flex-1 h-px bg-slate-200 " />
 <span className="text-xs text-slate-400 font-medium">or continue with email</span>
 <div className="flex-1 h-px bg-slate-200 " />
 </div>

 {/* Manual form */}
 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
 <input
 type="email"
 value={form.email}
 onChange={e => setForm({ ...form, email: e.target.value })}
 placeholder="you@example.com"
 className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition ${errors.email ? 'border-red-400 bg-red-50 ' : 'border-slate-300 bg-white '}`}
 />
 {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
 <input
 type="password"
 value={form.password}
 onChange={e => setForm({ ...form, password: e.target.value })}
 placeholder="••••••••"
 className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition ${errors.password ? 'border-red-400 bg-red-50 ' : 'border-slate-300 bg-white '}`}
 />
 {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-sm"
 >
 {loading && !activeDemo ? 'Signing in…' : 'Sign in'}
 </button>
 </form>

 <p className="text-center text-sm text-slate-500 mt-6">
 Don't have an account?{' '}
 <Link to="/register" className="text-primary font-semibold hover:underline">Create one</Link>
 </p>
 </div>
 </div>
 </div>
 );
}
