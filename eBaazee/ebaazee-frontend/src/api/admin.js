import api from './axios';

export const getAllProducts = () => api.get('/admin/products');
export const getAllUsers = () => api.get('/admin/users');
export const freezeProduct = (id) => api.put(`/admin/products/${id}/freeze`);
export const unfreezeProduct = (id) => api.put(`/admin/products/${id}/unfreeze`);
export const declareWinner = (id) => api.post(`/admin/products/${id}/declare-winner`);
