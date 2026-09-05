import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import Marketplace from './pages/Marketplace.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import Placeholder from './pages/Placeholder.jsx';
import BottomNav from './components/BottomNav.jsx';

export default function App() {
  return <div className="app-shell"><div className="app-content"><Routes><Route path="/" element={<Navigate to="/shop" replace />} /><Route path="/home" element={<Home />} /><Route path="/shop" element={<Shop />} /><Route path="/shop/marketplace" element={<Marketplace />} /><Route path="/shop/marketplace/:id" element={<ProductDetail />} /><Route path="/shop/marketplace/:id/success" element={<OrderSuccess />} /><Route path="/emi-dues" element={<Placeholder title="EMI Dues" />} /><Route path="/limit" element={<Placeholder title="Your Limit" />} /><Route path="/profile" element={<Placeholder title="Profile" />} /><Route path="*" element={<Navigate to="/shop" replace />} /></Routes></div><BottomNav /></div>;
}
