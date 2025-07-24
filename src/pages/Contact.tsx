import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'support@elitestore.com',
      description: 'Send us an email anytime',
    },
    {
      icon: Phone,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri 9am-6pm EST',
    },
    {
      icon: MapPin,
      title: 'Address',
      details: '123 Commerce Street, New York, NY 10001',
      description: 'Visit our headquarters',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Monday - Friday: 9:00 AM - 6:00 PM',
      description: 'Saturday: 10:00 AM - 4:00 PM',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Have a question, suggestion, or need help? We're here to assist you. 
          Reach out to us through any of the channels below.
        </p>
      </div>

      {/* Contact Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {contactInfo.map((info, index) => (
          <div key={index} className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
              <info.icon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
            <p className="text-gray-900 font-medium mb-1">{info.details}</p>
            <p className="text-sm text-gray-600">{info.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
          
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-600">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                className="mt-4"
                variant="outline"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  value={formData.name}
                  onChange={(value) => handleChange('name', value)}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(value) => handleChange('email', value)}
                  required
                />
              </div>

              <Input
                label="Subject"
                value={formData.subject}
                onChange={(value) => handleChange('subject', value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  rows={6}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <Button
                type="submit"
                loading={isSubmitting}
                className="w-full"
                size="lg"
                icon={Send}
              >
                Send Message
              </Button>
            </form>
          )}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What is your return policy?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day return policy for all items in original condition. 
                Returns are free for defective items, while customer returns incur a small restocking fee.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How long does shipping take?
              </h3>
              <p className="text-gray-600">
                Standard shipping takes 3-7 business days. Express shipping (1-2 days) is available 
                for an additional fee. Free shipping is available on orders over $99.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you ship internationally?
              </h3>
              <p className="text-gray-600">
                Currently, we ship within the United States only. We're working on expanding 
                international shipping and will update customers when available.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How can I track my order?
              </h3>
              <p className="text-gray-600">
                Once your order ships, you'll receive a tracking number via email. 
                You can also view tracking information in your account under "Order History."
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, MasterCard, American Express), 
                PayPal, and Apple Pay for secure checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;