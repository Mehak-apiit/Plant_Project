import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await api.post('/api/marketing/subscribe', { email });
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter */}
      <div className="bg-green-700">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">🌿 Stay in the loop</h3>
            <p className="text-green-100 text-sm mt-1">Get updates on new plants, deals, and plant care tips.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="flex-1 md:w-72 px-4 py-3 rounded-l-xl text-gray-900 text-sm focus:outline-none" required />
            <button type="submit" className="bg-green-900 hover:bg-green-800 px-6 py-3 rounded-r-xl text-sm font-bold transition">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <h3 className="text-2xl font-bold mb-4">🌿 PlantShop</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">Your trusted online plant store. Bringing nature closer to you, one plant at a time.</p>
          <div className="flex gap-3">
            {['📘', '🐦', '📷', '🎵'].map((icon, i) => (
              <a key={i} href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-sm hover:bg-green-600 transition">{icon}</a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li><Link to="/" className="hover:text-green-400 transition">Home</Link></li>
            <li><Link to="/products" className="hover:text-green-400 transition">All Plants</Link></li>
            <li><Link to="/cart" className="hover:text-green-400 transition">Cart</Link></li>
            <li><Link to="/wishlist" className="hover:text-green-400 transition">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Account</h4>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li><Link to="/profile" className="hover:text-green-400 transition">Profile</Link></li>
            <li><Link to="/orders" className="hover:text-green-400 transition">My Orders</Link></li>
            <li><Link to="/support" className="hover:text-green-400 transition">Support</Link></li>
            <li><Link to="/vendor/apply" className="hover:text-green-400 transition">Become a Vendor</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li>📧 support@plantshop.com</li>
            <li>📞 +91 98765 43210</li>
            <li>📍 New Delhi, India</li>
            <li>⏰ Mon-Sat: 9AM - 8PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-5 text-sm text-gray-500">
        © {new Date().getFullYear()} PlantShop. All rights reserved.
      </div>
    </footer>
  );
}
