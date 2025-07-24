import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-lg text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button size="lg">
            <Link to="/products" className="flex items-center">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <Button
          onClick={clearCart}
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-800"
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${JSON.stringify(item.selectedVariations)}`}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-start space-x-4">
                <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </Link>
                
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.product.id}`}
                    className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">{item.product.brand}</p>
                  
                  {/* Variations */}
                  {item.selectedVariations && Object.entries(item.selectedVariations).length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      {Object.entries(item.selectedVariations).map(([key, value]) => (
                        <span key={key} className="mr-4 capitalize">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price and Quantity */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className="text-xl font-semibold text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({items.length} items)</span>
                <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {getTotalPrice() >= 99 ? 'Free' : '$9.99'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${(getTotalPrice() * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ${(getTotalPrice() + (getTotalPrice() >= 99 ? 0 : 9.99) + (getTotalPrice() * 0.08)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <Button className="w-full" size="lg">
                <Link to="/checkout">
                  Proceed to Checkout
                </Link>
              </Button>
              <Button variant="outline" className="w-full">
                <Link to="/products" className="flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
            </div>

            {/* Free Shipping Progress */}
            {getTotalPrice() < 99 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  Add ${(99 - getTotalPrice()).toFixed(2)} more for free shipping!
                </p>
                <div className="mt-2 bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((getTotalPrice() / 99) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;