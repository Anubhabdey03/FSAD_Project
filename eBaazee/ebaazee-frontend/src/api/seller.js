import api from './axios';

export const listProduct = (data) => api.post('/seller/products', data);
export const getMyProducts = () => api.get('/seller/products');
export const updateProduct = (id, data) => api.put(`/seller/products/${id}`, data);
