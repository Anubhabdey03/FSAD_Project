import api from './axios';

export const getProducts = (categoryId) =>
 api.get('/products', { params: categoryId ? { category: categoryId } : {} });

export const getProduct = (id) => api.get(`/products/${id}`);
export const getBidStats = (productId) => api.get(`/products/${productId}/bids/stats`);
