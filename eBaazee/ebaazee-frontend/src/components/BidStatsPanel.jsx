import { useEffect, useRef, useState } from 'react';
import { getBidStats } from '../api/bids';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

function AnimatedNumber({ value, prefix = '' }) {
 const [display, setDisplay] = useState(value);
 const prevRef = useRef(value);

 useEffect(() => {
 if (value == null || value === prevRef.current) return;
 const from = prevRef.current ?? 0;
 const to = Number(value);
 prevRef.current = value;
 const steps = 20;
 let i = 0;
 const id = setInterval(() => {
 i++;
 const progress = i / steps;
 const eased = 1 - Math.pow(1 - progress, 3);
 setDisplay(+(from + (to - from) * eased).toFixed(0));
 if (i >= steps) { setDisplay(to); clearInterval(id); }
 }, 20);
 return () => clearInterval(id);
 }, [value]);

 if (display == null) return <span className="text-slate-200 animate-pulse">——</span>;
 return <span>{prefix}{Number(display).toLocaleString()}</span>;
}

const tileConfig = [
 { key: 'count', label: 'Total Bids', prefix: '', valueClass: 'text-slate-800' },
 { key: 'highest', label: 'Highest', prefix: '₹', valueClass: 'text-emerald-600' },
 { key: 'lowest', label: 'Lowest', prefix: '₹', valueClass: 'text-blue-600' },
 { key: 'average', label: 'Average', prefix: '₹', valueClass: 'text-indigo-600',
 transform: v => v != null ? Math.round(Number(v)) : null },
];

export default function BidStatsPanel({ productId }) {
 const [stats, setStats] = useState(null);
 const [flash, setFlash] = useState(false);
 const clientRef = useRef(null);

 useEffect(() => {
 getBidStats(productId).then(r => setStats(r.data)).catch(() => {});

 const client = new Client({
 webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
 onConnect: () => {
 client.subscribe(`/topic/products/${productId}`, msg => {
 setStats(JSON.parse(msg.body));
 setFlash(true);
 setTimeout(() => setFlash(false), 600);
 });
 },
 });
 client.activate();
 clientRef.current = client;
 return () => client.deactivate();
 }, [productId]);

 return (
 <div className={`bg-white rounded-2xl border overflow-hidden transition-colors duration-300 ${
 flash ? 'border-indigo-300 shadow-md shadow-indigo-100 ' : 'border-slate-200 '
 }`}>
 <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 ">
 <h3 className="text-sm font-bold text-slate-800 ">Live Bid Statistics</h3>
 <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
 Live
 </div>
 </div>

 <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 ">
 {tileConfig.map(({ key, label, prefix, valueClass, transform }) => {
 const raw = stats?.[key];
 const val = transform ? transform(raw) : (raw != null ? Number(raw) : null);
 return (
 <div key={key} className="px-5 py-4 hover:bg-slate-50/60 transition-colors">
 <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">{label}</p>
 <p className={`text-2xl font-extrabold ${valueClass}`}>
 {val != null
 ? <AnimatedNumber value={val} prefix={prefix} />
 : <span className="text-slate-200 ">—</span>
 }
 </p>
 </div>
 );
 })}
 </div>
 </div>
 );
}
