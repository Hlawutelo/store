import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Truck, Shield, RefreshCcw, ChevronLeft } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import Button from '../components/ui/Button';
import ProductCard from '../components/product/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { user, updateUser } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  const isInWishlist = user?.wishlist.includes(product?.id || '') || false;

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(0);
      setSelectedVariations({});
    } else {
      navigate('/products');
    }
  }, [id, products, navigate]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <Button onClick={() => navigate('/products')} className="mt-4">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariations);
  };

  const handleWishlist = () => {
    if (!user) {
      navigate('/login');
      return;
    }

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
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

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-lg text-gray-600">{product.brand}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-600">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4">
            <span className="text-4xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-2xl text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            {product.onSale && (
              <span className="bg-red-500 text-white px-3 py-1 text-sm font-medium rounded-full">
                Sale
              </span>
            )}
          </div>

          {/* Variations */}
          {product.variations && (
            <div className="space-y-4">
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
                    {type}: {selectedVariations[type] && (
                      <span className="font-normal text-gray-600">{selectedVariations[type]}</span>
                    )}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variations.map((variation) => (
                      <button
                        key={variation.id}
                        onClick={() => handleVariationChange(type, variation.value)}
                        disabled={!variation.inStock}
                        className={`px-4 py-2 border rounded-lg transition-all ${
                          selectedVariations[type] === variation.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        } ${
                          !variation.inStock ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {variation.value}
                        {!variation.inStock && <span className="ml-1 text-xs">(Out of stock)</span>}
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
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[...Array(Math.min(10, product.stockQuantity))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1"
              size="lg"
              icon={ShoppingCart}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button
              onClick={handleWishlist}
              variant={isInWishlist ? 'primary' : 'outline'}
              size="lg"
              icon={Heart}
            >
              {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </Button>
          </div>

          {/* Stock Status & Features */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <div className="text-sm">
              {product.inStock ? (
                <span className="text-green-600 font-medium">
                  ✓ In stock ({product.stockQuantity} available)
                </span>
              ) : (
                <span className="text-red-600 font-medium">✗ Out of stock</span>
              )}
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span>Free shipping over $99</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Secure payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <RefreshCcw className="w-4 h-4" />
                <span>30-day returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mb-16">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'reviews', label: 'Reviews' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-900">{key}</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-8">
              <p className="text-gray-600">Reviews feature coming soon!</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;