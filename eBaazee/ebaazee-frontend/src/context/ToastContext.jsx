import { createContext, useContext, useState, useCallback } from 'react';

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
 const [toasts, setToasts] = useState([]);

 const removeToast = useCallback((id) => {
 setToasts(prev => prev.filter(t => t.id !== id));
 }, []);

 const showToast = useCallback((message, type = 'info') => {
 const id = Date.now() + Math.random();
 setToasts(prev => {
 const updated = [...prev, { id, message, type }];
 return updated.length > 3 ? updated.slice(updated.length - 3) : updated;
 });
 const delay = type === 'error' ? 5000 : 3000;
 setTimeout(() => removeToast(id), delay);
 }, [removeToast]);

 return (
 <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
 {children}
 </ToastContext.Provider>
 );
}

export const useToast = () => useContext(ToastContext);
