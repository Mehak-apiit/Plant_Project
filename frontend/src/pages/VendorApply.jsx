import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function VendorApply() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ shopName: '', shopSlug: '', shopDescription: '' });
  const [loading, setLoading] = useState(false);
  const [existing, setExisting] = useState(null);

  useEffect(() => {
    const check = async () => {
      try {
        const { data } = await api.get('/api/v1/vendor/me');
        setExisting(data.vendor || data);
      } catch {}
    };
    check();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/v1/vendor/apply', form);
      toast.success('Application submitted!');
      navigate('/vendor/dashboard');
    } catch (err) { toast.error(err.response?.data?.message || 'Application failed'); }
    setLoading(false);
  };

  if (existing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="text-5xl mb-4">🏪</div>
          <h2 className="text-2xl font-bold mb-3">Vendor Application Status</h2>
          <p className="text-gray-600 mb-4">Your application is currently: <span className={`font-semibold px-2 py-1 rounded-full text-sm ${existing.status === 'approved' ? 'bg-green-100 text-green-700' : existing.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{existing.status}</span></p>
          <button onClick={() => navigate('/vendor/dashboard')} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold transition">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Become a Vendor</h1>
        <p className="text-gray-500">Sell your plants to thousands of customers</p>
      </div>
      <form onSubmit={handleApply} className="bg-white rounded-2xl shadow-lg p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
          <input type="text" value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" placeholder="My Plant Shop" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shop Slug (URL friendly name)</label>
          <input type="text" value={form.shopSlug} onChange={(e) => setForm({ ...form, shopSlug: e.target.value })} required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" placeholder="my-plant-shop" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shop Description</label>
          <textarea value={form.shopDescription} onChange={(e) => setForm({ ...form, shopDescription: e.target.value })} rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition" placeholder="Tell us about your shop..." />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}
