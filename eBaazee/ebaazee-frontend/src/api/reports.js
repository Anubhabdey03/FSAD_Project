import api from './axios';

export const getReport = (productId) => api.get(`/reports/products/${productId}`);
