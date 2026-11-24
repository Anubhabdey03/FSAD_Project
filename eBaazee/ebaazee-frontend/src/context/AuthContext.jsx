import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
 const [auth, setAuth] = useState(() => {
 const token = sessionStorage.getItem('token');
 const role = sessionStorage.getItem('role');
 const name = sessionStorage.getItem('name');
 const userId = sessionStorage.getItem('userId');
 return token ? { token, role, name, userId: Number(userId) } : null;
 });

 const login = (token, role, name, userId) => {
 sessionStorage.setItem('token', token);
 sessionStorage.setItem('role', role);
 sessionStorage.setItem('name', name);
 sessionStorage.setItem('userId', userId);
 setAuth({ token, role, name, userId: Number(userId) });
 };

 const logout = () => {
 sessionStorage.clear();
 setAuth(null);
 };

 const updateProfile = (name) => {
 sessionStorage.setItem('name', name);
 setAuth(prev => ({ ...prev, name }));
 };

 return (
 <AuthContext.Provider value={{ auth, login, logout, updateProfile }}>
 {children}
 </AuthContext.Provider>
 );
}

export const useAuth = () => useContext(AuthContext);
