import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const roleBadge = {
 BUYER: 'bg-emerald-100 text-emerald-700 ',
 SELLER: 'bg-indigo-100 text-indigo-700 ',
 ADMIN: 'bg-red-100 text-red-700 ',
};

export default function ProfilePage() {
 const { auth, updateProfile } = useAuth();
 const { showToast } = useToast();
 const [name, setName] = useState(auth?.name || '');
 const [nameError, setNameError] = useState('');
 const [saving, setSaving] = useState(false);

 const handleSave = (e) => {
 e.preventDefault();
 if (name.trim().length < 2) {
 setNameError('Name must be at least 2 characters');
 return;
 }
 setNameError('');
 setSaving(true);
 updateProfile(name.trim());
 setTimeout(() => {
 setSaving(false);
 showToast('Profile updated', 'success');
 }, 300);
 };

 return (
 <div className="max-w-lg mx-auto px-4 py-10">
 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
 {/* Avatar */}
 <div className="flex flex-col items-center mb-8">
 <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold mb-3">
 {auth?.name?.[0]?.toUpperCase() || '?'}
 </div>
 <h2 className="text-lg font-bold text-slate-800 ">{auth?.name}</h2>
 <span className={`mt-1 text-xs font-semibold px-2.5 py-1 rounded-full ${roleBadge[auth?.role] || 'bg-slate-100 text-slate-600'}`}>
 {auth?.role}
 </span>
 </div>

 <form onSubmit={handleSave} className="space-y-5">
 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
 <input
 value={name}
 onChange={e => setName(e.target.value)}
 className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition ${nameError ? 'border-red-400 bg-red-50 ' : 'border-slate-300 bg-white '}`}
 />
 {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
 <input
 value={auth?.email || '—'}
 readOnly
 className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-500 cursor-not-allowed"
 />
 <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
 <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 ">
 <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${roleBadge[auth?.role] || 'bg-slate-100 text-slate-600'}`}>
 {auth?.role}
 </span>
 <span className="text-xs text-slate-400 ">Role cannot be changed.</span>
 </div>
 </div>

 <button
 type="submit"
 disabled={saving}
 className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-60 text-sm"
 >
 {saving ? 'Saving…' : 'Save Changes'}
 </button>
 </form>
 </div>
 </div>
 );
}
