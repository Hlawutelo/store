export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  sku: string;
  brand: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  specifications: Record<string, string>;
  variations?: ProductVariation[];
  featured?: boolean;
  onSale?: boolean;
}

export interface ProductVariation {
  id: string;
  type: 'color' | 'size' | 'style';
  name: string;
  value: string;
  price?: number;
  inStock: boolean;
  stockQuantity: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariations?: Record<string, string>;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  wishlist: string[];
  isAdmin: boolean;
  createdAt: string;
}

export interface Address {
  id: string;
  type: 'billing' | 'shipping';
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  subcategories?: Category[];
}

export interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
  onSale: boolean;
}