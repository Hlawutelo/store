import React, { useState } from 'react';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Address } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

const AccountAddresses: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  const [formData, setFormData] = useState({
    type: 'shipping' as 'shipping' | 'billing',
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    isDefault: false,
  });

  if (!user) return null;

  const addresses = user.addresses || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAddress: Address = {
      id: editingAddress?.id || Date.now().toString(),
      ...formData,
    };

    let updatedAddresses: Address[];
    if (editingAddress) {
      updatedAddresses = addresses.map(addr => 
        addr.id === editingAddress.id ? newAddress : addr
      );
    } else {
      updatedAddresses = [...addresses, newAddress];
    }

    // If this is set as default, remove default from others of same type
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => 
        addr.type === newAddress.type && addr.id !== newAddress.id
          ? { ...addr, isDefault: false }
          : addr
      );
    }

    updateUser({ addresses: updatedAddresses });
    setIsModalOpen(false);
    setEditingAddress(null);
    resetForm();
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData(address);
    setIsModalOpen(true);
  };

  const handleDelete = (addressId: string) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
    updateUser({ addresses: updatedAddresses });
  };

  const resetForm = () => {
    setFormData({
      type: 'shipping',
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      isDefault: false,
    });
  };

  const handleAddNew = () => {
    resetForm();
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
        <Button onClick={handleAddNew} icon={Plus}>
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
          <p className="text-gray-600 mb-6">
            Add addresses to make checkout faster and easier.
          </p>
          <Button onClick={handleAddNew} icon={Plus}>
            Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      address.type === 'shipping' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {address.type === 'shipping' ? 'Shipping' : 'Billing'}
                    </span>
                    {address.isDefault && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        Default
                      </span>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900">
                    {address.firstName} {address.lastName}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Address Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAddress(null);
          resetForm();
        }}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="shipping"
                  checked={formData.type === 'shipping'}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Shipping</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="billing"
                  checked={formData.type === 'billing'}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Billing</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(value) => handleChange('firstName', value)}
              required
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(value) => handleChange('lastName', value)}
              required
            />
          </div>

          <Input
            label="Street Address"
            value={formData.street}
            onChange={(value) => handleChange('street', value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              value={formData.city}
              onChange={(value) => handleChange('city', value)}
              required
            />
            <Input
              label="State"
              value={formData.state}
              onChange={(value) => handleChange('state', value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ZIP Code"
              value={formData.zipCode}
              onChange={(value) => handleChange('zipCode', value)}
              required
            />
            <Input
              label="Country"
              value={formData.country}
              onChange={(value) => handleChange('country', value)}
              required
            />
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => handleChange('isDefault', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Set as default {formData.type} address
              </span>
            </label>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button type="submit" className="flex-1">
              {editingAddress ? 'Update Address' : 'Add Address'}
            </Button>
            <Button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingAddress(null);
                resetForm();
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AccountAddresses;