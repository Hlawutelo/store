import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { Product, ProductVariation } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { products, addProduct, updateProduct } = useProducts();
  
  const isEditing = Boolean(id);
  const existingProduct = isEditing ? products.find(p => p.id === id) : null;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    subcategory: '',
    brand: '',
    sku: '',
    stockQuantity: '',
    rating: '4.5',
    reviewCount: '0',
    tags: '',
    featured: false,
    onSale: false,
  });

  const [images, setImages] = useState<string[]>(['']);
  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>([
    { key: '', value: '' }
  ]);
  const [variations, setVariations] = useState<ProductVariation[]>([]);

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name,
        description: existingProduct.description,
        price: existingProduct.price.toString(),
        originalPrice: existingProduct.originalPrice?.toString() || '',
        category: existingProduct.category,
        subcategory: existingProduct.subcategory || '',
        brand: existingProduct.brand,
        sku: existingProduct.sku,
        stockQuantity: existingProduct.stockQuantity.toString(),
        rating: existingProduct.rating.toString(),
        reviewCount: existingProduct.reviewCount.toString(),
        tags: existingProduct.tags.join(', '),
        featured: existingProduct.featured || false,
        onSale: existingProduct.onSale || false,
      });
      setImages(existingProduct.images);
      setSpecifications(
        Object.entries(existingProduct.specifications).map(([key, value]) => ({ key, value }))
      );
      setVariations(existingProduct.variations || []);
    }
  }, [existingProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData: Omit<Product, 'id'> = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      category: formData.category,
      subcategory: formData.subcategory || undefined,
      images: images.filter(img => img.trim() !== ''),
      inStock: parseInt(formData.stockQuantity) > 0,
      stockQuantity: parseInt(formData.stockQuantity),
      sku: formData.sku,
      brand: formData.brand,
      rating: parseFloat(formData.rating),
      reviewCount: parseInt(formData.reviewCount),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      specifications: specifications.reduce((acc, spec) => {
        if (spec.key && spec.value) {
          acc[spec.key] = spec.value;
        }
        return acc;
      }, {} as Record<string, string>),
      variations: variations.length > 0 ? variations : undefined,
      featured: formData.featured,
      onSale: formData.onSale,
    };

    if (isEditing && id) {
      updateProduct(id, productData);
    } else {
      addProduct(productData);
    }

    navigate('/admin/products');
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImage = () => {
    setImages(prev => [...prev, '']);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSpecificationChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const addSpecification = () => {
    setSpecifications(prev => [...prev, { key: '', value: '' }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={() => navigate('/admin/products')}
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
        >
          Back to Products
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Product Name"
                value={formData.name}
                onChange={(value) => handleChange('name', value)}
                required
              />
              <Input
                label="Brand"
                value={formData.brand}
                onChange={(value) => handleChange('brand', value)}
                required
              />
              <Input
                label="SKU"
                value={formData.sku}
                onChange={(value) => handleChange('sku', value)}
                required
              />
              <Input
                label="Category"
                value={formData.category}
                onChange={(value) => handleChange('category', value)}
                required
              />
              <Input
                label="Subcategory"
                value={formData.subcategory}
                onChange={(value) => handleChange('subcategory', value)}
              />
              <Input
                label="Tags (comma separated)"
                value={formData.tags}
                onChange={(value) => handleChange('tags', value)}
                placeholder="wireless, premium, bestseller"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Detailed product description..."
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                label="Price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(value) => handleChange('price', value)}
                required
              />
              <Input
                label="Original Price (optional)"
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(value) => handleChange('originalPrice', value)}
              />
              <Input
                label="Stock Quantity"
                type="number"
                value={formData.stockQuantity}
                onChange={(value) => handleChange('stockQuantity', value)}
                required
              />
              <Input
                label="Review Count"
                type="number"
                value={formData.reviewCount}
                onChange={(value) => handleChange('reviewCount', value)}
              />
            </div>
            <div className="mt-4 flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Featured Product</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.onSale}
                  onChange={(e) => handleChange('onSale', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">On Sale</span>
              </label>
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
            <div className="space-y-3">
              {images.map((image, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Input
                    placeholder="Image URL"
                    value={image}
                    onChange={(value) => handleImageChange(index, value)}
                    className="flex-1"
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                onClick={addImage}
                variant="outline"
                size="sm"
                icon={Plus}
              >
                Add Image
              </Button>
            </div>
          </div>

          {/* Specifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
            <div className="space-y-3">
              {specifications.map((spec, index) => (
                <div key={index} className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Specification name"
                    value={spec.key}
                    onChange={(value) => handleSpecificationChange(index, 'key', value)}
                  />
                  <div className="flex items-center space-x-3">
                    <Input
                      placeholder="Specification value"
                      value={spec.value}
                      onChange={(value) => handleSpecificationChange(index, 'value', value)}
                      className="flex-1"
                    />
                    {specifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={addSpecification}
                variant="outline"
                size="sm"
                icon={Plus}
              >
                Add Specification
              </Button>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <Button type="submit" className="flex-1">
              {isEditing ? 'Update Product' : 'Create Product'}
            </Button>
            <Button
              type="button"
              onClick={() => navigate('/admin/products')}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;