import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import ProductQuickView from './ProductQuickView';

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showQuickView = true }) => {
  const { addToCart } = useCart();
  const { user, updateUser } = useAuth();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const isInWishlist = user?.wishlist.includes(product.id) || false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;

    const newWishlist = isInWishlist
      ? user.wishlist.filter(id => id !== product.id)
      : [...user.wishlist, product.id];

    updateUser({ wishlist: newWishlist });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200">
        {/* Product Image */}
        <Link to={`/product/${product.id}`} className="block relative">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
            <img
              src={product.images[imageIndex]}
              alt={product.name}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              onMouseEnter={() => setImageIndex(1 % product.images.length)}
              onMouseLeave={() => setImageIndex(0)}
            />
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 space-y-2">
            {product.onSale && (
              <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
                Sale
              </span>
            )}
            {!product.inStock && (
              <span className="bg-gray-500 text-white px-2 py-1 text-xs font-medium rounded">
                Out of Stock
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
            {user && (
              <button
                onClick={handleWishlist}
                className={`p-2 rounded-full shadow-md transition-colors ${
                  isInWishlist
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 hover:text-red-500'
                }`}
              >
                <Heart className="w-4 h-4" fill={isInWishlist ? 'currentColor' : 'none'} />
              </button>
            )}
            {showQuickView && (
              <button
                onClick={handleQuickView}
                className="p-2 bg-white text-gray-600 hover:text-blue-600 rounded-full shadow-md transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
              <Link to={`/product/${product.id}`}>{product.name}</Link>
            </h3>
            <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg font-semibold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full"
            size="sm"
            icon={ShoppingCart}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <ProductQuickView
          product={product}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
};

export default ProductCard;