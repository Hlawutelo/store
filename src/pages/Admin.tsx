import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings,
  TrendingUp,
  DollarSign,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminProducts from '../components/admin/AdminProducts';
import AdminOrders from '../components/admin/AdminOrders';
import AdminUsers from '../components/admin/AdminUsers';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3, exact: true },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: Users },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600 mt-2">Manage your store and monitor performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = item.exact 
                  ? location.pathname === item.href
                  : location.pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-4">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/products/*" element={<AdminProducts />} />
            <Route path="/orders/*" element={<AdminOrders />} />
            <Route path="/users" element={<AdminUsers />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;