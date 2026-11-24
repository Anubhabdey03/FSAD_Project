import { useEffect, useState } from 'react';

export default function CountdownTimer({ endTime }) {
 const [remaining, setRemaining] = useState('');
 const [urgency, setUrgency] = useState('normal');

 useEffect(() => {
 const tick = () => {
 const diff = new Date(endTime) - Date.now();
 if (diff <= 0) { setRemaining('Ended'); setUrgency('ended'); return; }
 const d = Math.floor(diff / 86400000);
 const h = Math.floor((diff % 86400000) / 3600000);
 const m = Math.floor((diff % 3600000) / 60000);
 const s = Math.floor((diff % 60000) / 1000);
 setRemaining(d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`);
 if (diff < 3600000) setUrgency('critical');
 else if (diff < 86400000) setUrgency('warning');
 else setUrgency('normal');
 };
 tick();
 const id = setInterval(tick, 1000);
 return () => clearInterval(id);
 }, [endTime]);

 if (urgency === 'ended') return <span className="text-slate-400 text-xs">Ended</span>;

 return (
 <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
 urgency === 'critical' ? 'text-red-600' :
 urgency === 'warning' ? 'text-amber-600' :
 'text-slate-600'
 }`}>
 {urgency !== 'normal' && (
 <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
 urgency === 'critical' ? 'bg-red-500' : 'bg-amber-500'
 }`} />
 )}
 {remaining}
 </span>
 );
}
