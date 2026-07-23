import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', discountType: 'percentage', discountAmount: '', minOrderAmount: '', maxDiscountAmount: '', startDate: '', endDate: '', maxUsageLimit: '', limitPerUser: '', isActive: true });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get('/api/coupen');
      setCoupons(data.coupons || data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await api.post('/api/coupen', { ...form, discountAmount: +form.discountAmount, minOrderAmount: +form.minOrderAmount, maxDiscountAmount: form.maxDiscountAmount ? +form.maxDiscountAmount : undefined, maxUsageLimit: form.maxUsageLimit ? +form.maxUsageLimit : undefined, limitPerUser: form.limitPerUser ? +form.limitPerUser : undefined });
      toast.success('Coupon created!');
      setForm({ code: '', discountType: 'percentage', discountAmount: '', minOrderAmount: '', maxDiscountAmount: '', startDate: '', endDate: '', maxUsageLimit: '', limitPerUser: '', isActive: true });
      setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await api.delete(`/api/coupen/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Coupons</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold transition text-sm">{showForm ? 'Cancel' : '+ Add Coupon'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-md p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="Code (e.g. SAVE10)" required className="px-4 py-2.5 border rounded-lg text-sm" />
          <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="px-4 py-2.5 border rounded-lg text-sm">
            <option value="percentage">Percentage</option><option value="fixed">Fixed</option>
          </select>
          <input type="number" value={form.discountAmount} onChange={(e) => setForm({ ...form, discountAmount: e.target.value })} placeholder="Discount Amount" required className="px-4 py-2.5 border rounded-lg text-sm" />
          <input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} placeholder="Min Order Amount" className="px-4 py-2.5 border rounded-lg text-sm" />
          <input type="number" value={form.maxDiscountAmount} onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })} placeholder="Max Discount (optional)" className="px-4 py-2.5 border rounded-lg text-sm" />
          <input type="number" value={form.maxUsageLimit} onChange={(e) => setForm({ ...form, maxUsageLimit: e.target.value })} placeholder="Max Usage Limit" className="px-4 py-2.5 border rounded-lg text-sm" />
          <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="px-4 py-2.5 border rounded-lg text-sm" />
          <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="px-4 py-2.5 border rounded-lg text-sm" />
          <button type="submit" disabled={submitting} className="md:col-span-3 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold transition text-sm disabled:opacity-50">{submitting ? 'Creating...' : 'Create Coupon'}</button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50"><tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Code</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Amount</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Min Order</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Valid Until</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
          </tr></thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-mono font-bold text-green-700">{c.code}</td>
                <td className="px-4 py-3 capitalize">{c.discountType}</td>
                <td className="px-4 py-3">{c.discountType === 'percentage' ? `${c.discountAmount}%` : `₹${c.discountAmount}`}</td>
                <td className="px-4 py-3">₹{c.minOrderAmount || 0}</td>
                <td className="px-4 py-3 text-gray-500">{c.endDate ? new Date(c.endDate).toLocaleDateString() : '—'}</td>
                <td className="px-4 py-3"><button onClick={() => handleDelete(c._id)} className="text-red-500 hover:text-red-700 text-xs font-medium transition">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
