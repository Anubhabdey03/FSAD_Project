import { useContext, useEffect, useState } from 'react';
import { ToastContext } from '../context/ToastContext';

const configs = {
 success: {
 bar: 'bg-emerald-500',
 icon: 'bg-emerald-100 text-emerald-600 ',
 text: 'text-emerald-900 ',
 wrap: 'bg-white border border-emerald-200 ',
 svg: (
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
 </svg>
 ),
 },
 error: {
 bar: 'bg-red-500',
 icon: 'bg-red-100 text-red-600 ',
 text: 'text-red-900 ',
 wrap: 'bg-white border border-red-200 ',
 svg: (
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
 </svg>
 ),
 },
 info: {
 bar: 'bg-indigo-500',
 icon: 'bg-indigo-100 text-indigo-600 ',
 text: 'text-indigo-900 ',
 wrap: 'bg-white border border-indigo-200 ',
 svg: (
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 ),
 },
};

const DURATION = 4000;

function ToastItem({ toast, onRemove }) {
 const [visible, setVisible] = useState(false);
 const [progress, setProgress] = useState(100);
 const cfg = configs[toast.type] || configs.info;

 useEffect(() => {
 // Trigger slide-in
 requestAnimationFrame(() => setVisible(true));

 // Progress bar countdown
 const start = Date.now();
 const id = setInterval(() => {
 const elapsed = Date.now() - start;
 const pct = Math.max(0, 100 - (elapsed / DURATION) * 100);
 setProgress(pct);
 if (pct === 0) clearInterval(id);
 }, 30);

 return () => clearInterval(id);
 }, []);

 const handleRemove = () => {
 setVisible(false);
 setTimeout(onRemove, 300);
 };

 return (
 <div
 className={`relative overflow-hidden rounded-xl shadow-lg ${cfg.wrap} transition-all duration-300 ${
 visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
 }`}
 style={{ transform: visible ? 'translateX(0)' : 'translateX(2rem)' }}
 >
 {/* Progress bar */}
 <div
 className={`absolute top-0 left-0 h-0.5 ${cfg.bar} transition-all`}
 style={{ width: `${progress}%`, transitionDuration: '30ms' }}
 />

 <div className="flex items-start gap-3 px-4 py-3 pt-3.5">
 <div className={`w-7 h-7 rounded-lg ${cfg.icon} flex items-center justify-center shrink-0 mt-0.5`}>
 {cfg.svg}
 </div>
 <p className={`flex-1 text-sm font-medium ${cfg.text} leading-snug`}>{toast.message}</p>
 <button
 onClick={handleRemove}
 className="text-slate-400 hover:text-slate-600 transition-colors mt-0.5 shrink-0"
 >
 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>
 </div>
 );
}

export default function Toast() {
 const ctx = useContext(ToastContext);
 if (!ctx) return null;
 const { toasts, removeToast } = ctx;

 return (
 <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 w-80">
 {toasts.map(t => (
 <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
 ))}
 </div>
 );
}
