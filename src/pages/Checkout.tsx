import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { Address } from '../types';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Checkout: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [billingAddress, setBillingAddress] = useState<Partial<Address>>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);

  const subtotal = getTotalPrice();
  const shipping = subtotal >= 99 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  if (!user) {
    navigate('/login?redirect=checkout');
    return null;
  }

  const handleAddressChange = (
    type: 'shipping' | 'billing',
    field: string,
    value: string
  ) => {
    if (type === 'shipping') {
      setShippingAddress(prev => ({ ...prev, [field]: value }));
      if (sameAsShipping) {
        setBillingAddress(prev => ({ ...prev, [field]: value }));
      }
    } else {
      setBillingAddress(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePaymentChange = (field: string, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = async () => {
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const orderId = createOrder({
        userId: user.id,
        items,
        total,
        subtotal,
        tax,
        shipping,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'Credit Card',
        shippingAddress: shippingAddress as Address,
        billingAddress: (sameAsShipping ? shippingAddress : billingAddress) as Address,
        trackingNumber: `TRK${Date.now()}`,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });

      clearCart();
      navigate(`/account/orders/${orderId}`);
    } catch (error) {
      console.error('Order submission error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isShippingValid = () => {
    return shippingAddress.firstName && 
           shippingAddress.lastName && 
           shippingAddress.street && 
           shippingAddress.city && 
           shippingAddress.state && 
           shippingAddress.zipCode;
  };

  const isPaymentValid = () => {
    return paymentInfo.cardNumber && 
           paymentInfo.expiryDate && 
           paymentInfo.cvv && 
           paymentInfo.cardName;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[
            { id: 'shipping', label: 'Shipping', icon: Truck },
            { id: 'payment', label: 'Payment', icon: CreditCard },
            { id: 'review', label: 'Review', icon: Lock },
          ].map((stepItem, index) => (
            <React.Fragment key={stepItem.id}>
              <div className={`flex items-center space-x-2 ${
                step === stepItem.id ? 'text-blue-600' : 
                ['shipping', 'payment', 'review'].indexOf(step) > index ? 'text-green-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === stepItem.id ? 'bg-blue-600 text-white' :
                  ['shipping', 'payment', 'review'].indexOf(step) > index ? 'bg-green-600 text-white' : 'bg-gray-200'
                }`}>
                  <stepItem.icon className="w-4 h-4" />
                </div>
                <span className="font-medium">{stepItem.label}</span>
              </div>
              {index < 2 && (
                <div className={`w-12 h-0.5 ${
                  ['shipping', 'payment', 'review'].indexOf(step) > index ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {/* Shipping Address */}
          {step === 'shipping' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={shippingAddress.firstName || ''}
                  onChange={(value) => handleAddressChange('shipping', 'firstName', value)}
                  required
                />
                <Input
                  label="Last Name"
                  value={shippingAddress.lastName || ''}
                  onChange={(value) => handleAddressChange('shipping', 'lastName', value)}
                  required
                />
                <div className="md:col-span-2">
                  <Input
                    label="Street Address"
                    value={shippingAddress.street || ''}
                    onChange={(value) => handleAddressChange('shipping', 'street', value)}
                    required
                  />
                </div>
                <Input
                  label="City"
                  value={shippingAddress.city || ''}
                  onChange={(value) => handleAddressChange('shipping', 'city', value)}
                  required
                />
                <Input
                  label="State"
                  value={shippingAddress.state || ''}
                  onChange={(value) => handleAddressChange('shipping', 'state', value)}
                  required
                />
                <Input
                  label="ZIP Code"
                  value={shippingAddress.zipCode || ''}
                  onChange={(value) => handleAddressChange('shipping', 'zipCode', value)}
                  required
                />
                <Input
                  label="Country"
                  value={shippingAddress.country || ''}
                  onChange={(value) => handleAddressChange('shipping', 'country', value)}
                  required
                />
              </div>
              <div className="mt-6">
                <Button
                  onClick={() => setStep('payment')}
                  disabled={!isShippingValid()}
                  className="w-full"
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {/* Payment Information */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
                <div className="space-y-4">
                  <Input
                    label="Card Number"
                    value={paymentInfo.cardNumber}
                    onChange={(value) => handlePaymentChange('cardNumber', value)}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      value={paymentInfo.expiryDate}
                      onChange={(value) => handlePaymentChange('expiryDate', value)}
                      placeholder="MM/YY"
                      required
                    />
                    <Input
                      label="CVV"
                      value={paymentInfo.cvv}
                      onChange={(value) => handlePaymentChange('cvv', value)}
                      placeholder="123"
                      required
                    />
                  </div>
                  <Input
                    label="Cardholder Name"
                    value={paymentInfo.cardName}
                    onChange={(value) => handlePaymentChange('cardName', value)}
                    required
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Billing Address</h2>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => {
                        setSameAsShipping(e.target.checked);
                        if (e.target.checked) {
                          setBillingAddress(shippingAddress);
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Same as shipping address</span>
                  </label>
                </div>
                
                {!sameAsShipping && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={billingAddress.firstName || ''}
                      onChange={(value) => handleAddressChange('billing', 'firstName', value)}
                      required
                    />
                    <Input
                      label="Last Name"
                      value={billingAddress.lastName || ''}
                      onChange={(value) => handleAddressChange('billing', 'lastName', value)}
                      required
                    />
                    <div className="md:col-span-2">
                      <Input
                        label="Street Address"
                        value={billingAddress.street || ''}
                        onChange={(value) => handleAddressChange('billing', 'street', value)}
                        required
                      />
                    </div>
                    <Input
                      label="City"
                      value={billingAddress.city || ''}
                      onChange={(value) => handleAddressChange('billing', 'city', value)}
                      required
                    />
                    <Input
                      label="State"
                      value={billingAddress.state || ''}
                      onChange={(value) => handleAddressChange('billing', 'state', value)}
                      required
                    />
                    <Input
                      label="ZIP Code"
                      value={billingAddress.zipCode || ''}
                      onChange={(value) => handleAddressChange('billing', 'zipCode', value)}
                      required
                    />
                    <Input
                      label="Country"
                      value={billingAddress.country || ''}
                      onChange={(value) => handleAddressChange('billing', 'country', value)}
                      required
                    />
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => setStep('shipping')}
                  variant="outline"
                  className="flex-1"
                >
                  Back to Shipping
                </Button>
                <Button
                  onClick={() => setStep('review')}
                  disabled={!isPaymentValid()}
                  className="flex-1"
                >
                  Review Order
                </Button>
              </div>
            </div>
          )}

          {/* Order Review */}
          {step === 'review' && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.product.id}-${JSON.stringify(item.selectedVariations)}`} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      {item.selectedVariations && Object.entries(item.selectedVariations).length > 0 && (
                        <p className="text-sm text-gray-600">
                          {Object.entries(item.selectedVariations).map(([key, value]) => (
                            <span key={key} className="mr-2 capitalize">
                              {key}: {value}
                            </span>
                          ))}
                        </p>
                      )}
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => setStep('payment')}
                  variant="outline"
                  className="flex-1"
                >
                  Back to Payment
                </Button>
                <Button
                  onClick={handleSubmitOrder}
                  loading={isProcessing}
                  className="flex-1"
                  icon={Lock}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({items.length} items)</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Secure 256-bit SSL encryption
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;