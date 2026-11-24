import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BrowsePage from './pages/BrowsePage';
import ProductDetailPage from './pages/ProductDetailPage';
import BuyerBidsPage from './pages/BuyerBidsPage';
import BuyerPurchasesPage from './pages/BuyerPurchasesPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import NewProductPage from './pages/NewProductPage';
import EditProductPage from './pages/EditProductPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminReportPage from './pages/AdminReportPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';

export default function App() {
 return (
 <BrowserRouter>
 <AuthProvider>
 <Navbar />
 <Routes>
 <Route path="/" element={<HomePage />} />
 <Route path="/browse" element={<BrowsePage />} />
 <Route path="/login" element={<LoginPage />} />
 <Route path="/register" element={<RegisterPage />} />
 <Route path="/products/:id" element={<ProductDetailPage />} />

 <Route path="/buyer/bids" element={
 <ProtectedRoute role="BUYER"><BuyerBidsPage /></ProtectedRoute>
 } />
 <Route path="/buyer/purchases" element={
 <ProtectedRoute role="BUYER"><BuyerPurchasesPage /></ProtectedRoute>
 } />

 <Route path="/seller/dashboard" element={
 <ProtectedRoute role="SELLER"><SellerDashboardPage /></ProtectedRoute>
 } />
 <Route path="/seller/products/new" element={
 <ProtectedRoute role="SELLER"><NewProductPage /></ProtectedRoute>
 } />
 <Route path="/seller/products/:id/edit" element={
 <ProtectedRoute role="SELLER"><EditProductPage /></ProtectedRoute>
 } />

 <Route path="/admin/dashboard" element={
 <ProtectedRoute role="ADMIN"><AdminDashboardPage /></ProtectedRoute>
 } />
 <Route path="/admin/reports/:id" element={
 <ProtectedRoute role="ADMIN"><AdminReportPage /></ProtectedRoute>
 } />
 <Route path="/profile" element={
 <ProtectedRoute><ProfilePage /></ProtectedRoute>
 } />
 </Routes>
 </AuthProvider>
 </BrowserRouter>
 );
}
