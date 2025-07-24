import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

const AccountProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            Edit Profile
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(value) => handleChange('firstName', value)}
            disabled={!isEditing}
            required
          />
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(value) => handleChange('lastName', value)}
            disabled={!isEditing}
            required
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(value) => handleChange('email', value)}
          disabled={!isEditing}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={(value) => handleChange('phone', value)}
          disabled={!isEditing}
          placeholder="(555) 123-4567"
        />

        {isEditing && (
          <div className="flex space-x-4">
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        )}
      </form>

      {/* Account Stats */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{user?.wishlist.length || 0}</div>
            <div className="text-sm text-blue-800">Wishlist Items</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-green-800">Total Orders</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
            </div>
            <div className="text-sm text-purple-800">Member Since</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;