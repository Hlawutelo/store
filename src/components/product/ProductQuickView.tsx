import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, X } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface ProductQuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addToCart } = useCart();
  const { user, updateUser } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});

  const isInWishlist = user?.wishlist.includes(product.id) || false;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariations);
    onClose();
  };

  const handleWishlist = () => {
    if (!user) return;

    const newWishlist = isInWishlist
      ? user.wishlist.filter(id => id !== product.id)
      : [...user.wishlist, product.id];

    updateUser({ wishlist: newWishlist });
  };

  const handleVariationChange = (type: string, value: string) => {
    setSelectedVariations(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
            <p className="text-gray-600 mt-1">{product.brand}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600">{product.description}</p>

          {/* Variations */}
          {product.variations && (
            <div className="space-y-3">
              {Object.entries(
                product.variations.reduce((acc, variation) => {
                  if (!acc[variation.type]) {
                    acc[variation.type] = [];
                  }
                  acc[variation.type].push(variation);
                  return acc;
                }, {} as Record<string, typeof product.variations>)
              ).map(([type, variations]) => (
                <div key={type}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {type}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variations.map((variation) => (
                      <button
                        key={variation.id}
                        onClick={() => handleVariationChange(type, variation.value)}
                        disabled={!variation.inStock}
                        className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                          selectedVariations[type] === variation.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        } ${
                          !variation.inStock ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {variation.value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[...Array(Math.min(10, product.stockQuantity))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1"
              icon={ShoppingCart}
            >
              Add to Cart
            </Button>
            {user && (
              <Button
                onClick={handleWishlist}
                variant={isInWishlist ? 'primary' : 'outline'}
                icon={Heart}
              >
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </Button>
            )}
          </div>

          {/* Stock Status */}
          <div className="text-sm">
            {product.inStock ? (
              <span className="text-green-600">
                ✓ In stock ({product.stockQuantity} available)
              </span>
            ) : (
              <span className="text-red-600">✗ Out of stock</span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductQuickView;