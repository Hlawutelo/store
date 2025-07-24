import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import ProductCard from '../product/ProductCard';
import Button from '../ui/Button';

const AccountWishlist: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { products } = useProducts();
  const { addToCart } = useCart();

  if (!user) return null;

  const wishlistProducts = products.filter(product => 
    user.wishlist.includes(product.id)
  );

  const removeFromWishlist = (productId: string) => {
    const newWishlist = user.wishlist.filter(id => id !== productId);
    updateUser({ wishlist: newWishlist });
  };

  const addAllToCart = () => {
    wishlistProducts.forEach(product => {
      if (product.inStock) {
        addToCart(product);
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
        {wishlistProducts.length > 0 && (
          <Button onClick={addAllToCart} icon={ShoppingCart}>
            Add All to Cart
          </Button>
        )}
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">
            Save items you love to your wishlist and they'll appear here.
          </p>
          <Button>
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} showQuickView={false} />
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
              >
                <Heart className="w-4 h-4" fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountWishlist;