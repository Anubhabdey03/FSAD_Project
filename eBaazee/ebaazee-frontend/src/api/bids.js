import api from './axios';

export const placeBid = (productId, amount) =>
 api.post(`/products/${productId}/bid`, { amount });

export const purchaseProduct = (productId) =>
 api.post(`/products/${productId}/purchase`);

export const getBidStats = (productId) =>
 api.get(`/products/${productId}/bids/stats`);

export const getMyBids = () => api.get('/buyer/bids');
export const getMyPurchases = () => api.get('/buyer/purchases');
