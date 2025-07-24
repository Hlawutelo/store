import React from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Star
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';

const AdminDashboard: React.FC = () => {
  const { products } = useProducts();
  const { orders } = useOrders();

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const outOfStockProducts = products.filter(p => !p.inStock).length;

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const topProducts = products
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 5);

  const stats = [
    {
      name: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      change: '+12.5%',
      changeType: 'increase',
    },
    {
      name: 'Total Orders',
      value: totalOrders.toString(),
      icon: ShoppingCart,
      change: '+8.2%',
      changeType: 'increase',
    },
    {
      name: 'Total Products',
      value: totalProducts.toString(),
      icon: Package,
      change: '+3.1%',
      changeType: 'increase',
    },
    {
      name: 'Users',
      value: '1,234', // Placeholder
      icon: Users,
      change: '+15.3%',
      changeType: 'increase',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'increase' ? (
                        <TrendingUp className="h-4 w-4 flex-shrink-0 self-center" />
                      ) : (
                        <TrendingDown className="h-4 w-4 flex-shrink-0 self-center" />
                      )}
                      <span className="ml-1">{stat.change}</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all
            </button>
          </div>
          
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all
            </button>
          </div>
          
          <div className="space-y-4">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{product.name}</p>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviewCount})
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${product.price}</p>
                  <p className="text-sm text-gray-600">
                    {product.stockQuantity} in stock
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Inventory Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{inStockProducts}</div>
            <p className="text-sm text-gray-600">Products In Stock</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{outOfStockProducts}</div>
            <p className="text-sm text-gray-600">Out of Stock</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {products.filter(p => p.stockQuantity < 10).length}
            </div>
            <p className="text-sm text-gray-600">Low Stock (&lt; 10)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;