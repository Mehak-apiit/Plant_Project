import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminFlashSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', discountPercentage: '', startDate: '', endDate: '', products: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get('/api/marketing/flash-sale');
      setSales(Array.isArray(data) ? data : data.flashSales || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      const body = { ...form, discountPercentage: +form.discountPercentage, products: form.products ? form.products.split(',').map(s => s.trim()) : [] };
      await api.post('/api/marketing/flash-sale', body);
      toast.success('Flash sale created!');
      setForm({ name: '', discountPercentage: '', startDate: '', endDate: '', products: '' });
      setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await api.delete(`/api/marketing/flash-sale/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Flash Sales</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold transition text-sm">{showForm ? 'Cancel' : '+ Add Flash Sale'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-md p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Sale Name" required className="px-4 py-2.5 border rounded-lg text-sm" />
          <input type="number" value={form.discountPercentage} onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })} placeholder="Discount %" required className="px-4 py-2.5 border rounded-lg text-sm" />
          <input type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="px-4 py-2.5 border rounded-lg text-sm" />
          <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="px-4 py-2.5 border rounded-lg text-sm" />
          <input type="text" value={form.products} onChange={(e) => setForm({ ...form, products: e.target.value })} placeholder="Product IDs (comma separated, optional)" className="md:col-span-2 px-4 py-2.5 border rounded-lg text-sm" />
          <button type="submit" disabled={submitting} className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold transition text-sm disabled:opacity-50">{submitting ? 'Creating...' : 'Create'}</button>
        </form>
      )}

      <div className="space-y-3">
        {sales.map((s) => (
          <div key={s._id} className="bg-white rounded-xl shadow-md p-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold">{s.name}</h3>
              <p className="text-sm text-green-600 font-semibold">{s.discountPercentage}% off</p>
              <p className="text-xs text-gray-500 mt-1">{s.startDate ? new Date(s.startDate).toLocaleDateString() : '—'} — {s.endDate ? new Date(s.endDate).toLocaleDateString() : '—'}</p>
            </div>
            <button onClick={() => handleDelete(s._id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
