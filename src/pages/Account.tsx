import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { User, Package, Heart, MapPin, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AccountProfile from '../components/account/AccountProfile';
import AccountOrders from '../components/account/AccountOrders';
import AccountWishlist from '../components/account/AccountWishlist';
import AccountAddresses from '../components/account/AccountAddresses';

const Account: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navigation = [
    { name: 'Profile', href: '/account', icon: User, exact: true },
    { name: 'Orders', href: '/account/orders', icon: Package },
    { name: 'Wishlist', href: '/account/wishlist', icon: Heart },
    { name: 'Addresses', href: '/account/addresses', icon: MapPin },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>

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
              
              <button
                onClick={logout}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Routes>
            <Route path="/" element={<AccountProfile />} />
            <Route path="/orders/*" element={<AccountOrders />} />
            <Route path="/wishlist" element={<AccountWishlist />} />
            <Route path="/addresses" element={<AccountAddresses />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Account;