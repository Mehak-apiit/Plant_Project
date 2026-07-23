import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', image: '', link: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get('/api/marketing/banner');
      setBanners(Array.isArray(data) ? data : data.banners || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try { await api.post('/api/marketing/banner', form); toast.success('Banner created!'); setForm({ title: '', description: '', image: '', link: '' }); setShowForm(false); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await api.delete(`/api/marketing/banner/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Banners</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold transition text-sm">{showForm ? 'Cancel' : '+ Add Banner'}</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-md p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" required className="px-4 py-2.5 border rounded-lg text-sm" />
          <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="px-4 py-2.5 border rounded-lg text-sm" />
          <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="md:col-span-2 px-4 py-2.5 border rounded-lg text-sm" />
          <input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="Link URL" className="md:col-span-2 px-4 py-2.5 border rounded-lg text-sm" />
          <button type="submit" disabled={submitting} className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold transition text-sm disabled:opacity-50">{submitting ? 'Creating...' : 'Create'}</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((b) => (
          <div key={b._id} className="bg-white rounded-xl shadow-md p-5 flex items-start justify-between">
            <div>
              <h3 className="font-bold">{b.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{b.description}</p>
              {b.link && <a href={b.link} className="text-green-600 text-xs hover:underline mt-2 inline-block">{b.link}</a>}
            </div>
            <button onClick={() => handleDelete(b._id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
