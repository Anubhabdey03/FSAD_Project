import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
 {
 title: 'Sealed Bidding',
 desc: 'One bid per buyer. Place your best offer — no second-guessing, no bid wars, no last-second sniping.',
 icon: (
 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
 </svg>
 ),
 accent: 'bg-indigo-600 text-white',
 },
 {
 title: 'Live Bid Stats',
 desc: 'Real-time WebSocket updates — bid count, highest, lowest, and average refresh instantly for every viewer.',
 icon: (
 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
 </svg>
 ),
 accent: 'bg-emerald-600 text-white',
 },
 {
 title: 'Admin Control',
 desc: 'Administrators freeze auctions, generate bid reports, and manage all users on the platform.',
 icon: (
 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
 </svg>
 ),
 accent: 'bg-amber-500 text-white',
 },
];

const steps = [
 { n: '01', title: 'Create an account', desc: 'Register as a Buyer or Seller in under a minute.' },
 { n: '02', title: 'Browse or list', desc: 'Find an auction you love, or list your own item.' },
 { n: '03', title: 'Place your bid', desc: 'One sealed bid per product — make it count.' },
 { n: '04', title: 'Win & purchase', desc: 'Highest bidder wins when the admin freezes the auction.' },
];

export default function HomePage() {
 const { auth } = useAuth();

 if (auth) {
 if (auth.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
 if (auth.role === 'SELLER') return <Navigate to="/seller/dashboard" replace />;
 return <Navigate to="/browse" replace />;
 }

 return (
 <div className="bg-white ">

 {/* ── Hero ─────────────────────────────────────────────── */}
 <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-800 text-white">
 <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
 <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />

 <div className="relative max-w-5xl mx-auto px-4 py-28 text-center">
 <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
 Auctions are live right now
 </div>

 <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-none mb-6">
 Bid.<span className="text-indigo-200"> Win.</span><br />Own.
 </h1>

 <p className="text-indigo-200 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
 eBaazee is a sealed-bid online auction platform. Browse unique listings, place your best offer, and win.
 </p>

 <div className="flex items-center justify-center gap-4 flex-wrap">
 <Link
 to="/browse"
 className="px-8 py-3.5 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition text-sm shadow-xl"
 >
 Browse Auctions
 </Link>
 <Link
 to="/register"
 className="px-8 py-3.5 border-2 border-white/40 text-white font-bold rounded-xl hover:bg-white/10 transition text-sm"
 >
 Create Free Account
 </Link>
 </div>
 </div>

 <div className="absolute bottom-0 left-0 right-0">
 <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block ">
 <path d="M0 48h1440V24C1200 0 960 48 720 24S240 0 0 24V48z" fill="white" />
 </svg>
 <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full hidden ">
 <path d="M0 48h1440V24C1200 0 960 48 720 24S240 0 0 24V48z" fill="#0f172a" />
 </svg>
 </div>
 </section>

 {/* ── Stats strip ──────────────────────────────────────── */}
 <section className="bg-white pt-4 pb-14 px-4">
 <div className="max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
 {[
 { value: '14+', label: 'Active Listings' },
 { value: 'Sealed', label: 'Bid Format' },
 { value: 'Live', label: 'WebSocket Stats' },
 ].map(s => (
 <div key={s.label}>
 <p className="text-3xl font-extrabold text-slate-900 ">{s.value}</p>
 <p className="text-sm text-slate-500 mt-1">{s.label}</p>
 </div>
 ))}
 </div>
 </section>

 {/* ── Features ─────────────────────────────────────────── */}
 <section className="bg-slate-50 py-20 px-4 border-t border-slate-100 ">
 <div className="max-w-5xl mx-auto">
 <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest text-center mb-3">Why eBaazee</p>
 <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-14">Built for fair auctions</h2>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
 {features.map(({ title, desc, icon, accent }) => (
 <div key={title} className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-md transition-shadow">
 <div className={`w-12 h-12 rounded-xl ${accent} flex items-center justify-center mb-5`}>
 {icon}
 </div>
 <h3 className="text-base font-bold text-slate-800 mb-2">{title}</h3>
 <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* ── How it works ─────────────────────────────────────── */}
 <section className="bg-white py-20 px-4 border-t border-slate-100 ">
 <div className="max-w-4xl mx-auto">
 <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest text-center mb-3">How it works</p>
 <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-14">Four simple steps</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
 {steps.map(({ n, title, desc }) => (
 <div key={n}>
 <p className="text-5xl font-extrabold text-slate-100 mb-3 leading-none select-none">{n}</p>
 <h3 className="text-sm font-bold text-slate-800 mb-1">{title}</h3>
 <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* ── CTA ──────────────────────────────────────────────── */}
 <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 py-20 px-4 text-white text-center">
 <h2 className="text-3xl font-extrabold mb-3">Ready to start bidding?</h2>
 <p className="text-indigo-200 text-sm mb-8 max-w-md mx-auto leading-relaxed">
 Join eBaazee for free. Browse live auctions or list your own item in minutes.
 </p>
 <div className="flex items-center justify-center gap-4 flex-wrap">
 <Link to="/register" className="px-8 py-3.5 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition text-sm shadow-lg">
 Get Started Free
 </Link>
 <Link to="/browse" className="px-8 py-3.5 border-2 border-white/40 text-white font-bold rounded-xl hover:bg-white/10 transition text-sm">
 Browse First
 </Link>
 </div>
 </section>

 {/* ── Footer ───────────────────────────────────────────── */}
 <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center text-xs">
 <p className="font-semibold text-slate-300 mb-1">eBaazee</p>
 <p>FSAD Project · KT_eBaazee.Com_021 · Rituparna Debnath & Anubhab Dey</p>
 </footer>
 </div>
 );
}
