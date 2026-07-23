import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function VendorDashboard() {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/api/v1/vendor/me');
        setVendor(data.vendor || data);
        setForm(data.vendor || data);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/api/v1/vendor/update', form);
      toast.success('Profile updated!');
      setEditMode(false);
      const { data } = await api.get('/api/v1/vendor/me');
      setVendor(data.vendor || data);
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!vendor) return <div className="text-center py-20 text-gray-500">No vendor profile found. Apply first!</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Vendor Dashboard</h1>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{vendor.shopName}</h2>
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${vendor.status === 'approved' ? 'bg-green-100 text-green-700' : vendor.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{vendor.status}</span>
        </div>
        {!editMode ? (
          <div className="space-y-3 text-sm">
            <p><span className="font-medium">Shop Slug:</span> {vendor.shopSlug}</p>
            <p><span className="font-medium">Description:</span> {vendor.shopDescription || 'N/A'}</p>
            <p><span className="font-medium">Balance:</span> ₹{vendor.balance || 0}</p>
            <button onClick={() => setEditMode(true)} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold transition mt-4 text-sm">Edit Profile</button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">
            <input type="text" value={form.shopName || ''} onChange={(e) => setForm({ ...form, shopName: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg text-sm" placeholder="Shop Name" />
            <input type="text" value={form.shopSlug || ''} onChange={(e) => setForm({ ...form, shopSlug: e.target.value })} className="w-full px-4 py-2.5 border rounded-lg text-sm" placeholder="Shop Slug" />
            <textarea value={form.shopDescription || ''} onChange={(e) => setForm({ ...form, shopDescription: e.target.value })} rows={3} className="w-full px-4 py-2.5 border rounded-lg text-sm" placeholder="Description" />
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold transition text-sm">{saving ? 'Saving...' : 'Save'}</button>
              <button type="button" onClick={() => setEditMode(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg font-semibold transition text-sm">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
