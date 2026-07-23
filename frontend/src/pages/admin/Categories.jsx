import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCatForm, setShowCatForm] = useState(false);
  const [showSubForm, setShowSubForm] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', description: '' });
  const [subForm, setSubForm] = useState({ name: '', description: '', category: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const [cRes, sRes] = await Promise.all([api.get('/api/categories'), api.get('/api/subcategories')]);
      setCategories(Array.isArray(cRes.data) ? cRes.data : cRes.data.categories || []);
      setSubcategories(Array.isArray(sRes.data) ? sRes.data : sRes.data.subcategories || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreateCat = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try { await api.post('/api/categories', catForm); toast.success('Category created!'); setCatForm({ name: '', description: '' }); setShowCatForm(false); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setSubmitting(false);
  };

  const handleCreateSub = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try { await api.post('/api/subcategories', subForm); toast.success('Subcategory created!'); setSubForm({ name: '', description: '', category: '' }); setShowSubForm(false); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setSubmitting(false);
  };

  const handleDeleteCat = async (id) => {
    if (!confirm('Delete?')) return;
    try { await api.delete(`/api/categories/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  const handleDeleteSub = async (id) => {
    if (!confirm('Delete?')) return;
    try { await api.delete(`/api/subcategories/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Categories & Subcategories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Categories</h2>
            <button onClick={() => setShowCatForm(!showCatForm)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">{showCatForm ? 'Cancel' : '+ Add'}</button>
          </div>
          {showCatForm && (
            <form onSubmit={handleCreateCat} className="bg-white rounded-xl shadow-md p-4 mb-4 space-y-3">
              <input type="text" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} placeholder="Name" required className="w-full px-3 py-2 border rounded-lg text-sm" />
              <input type="text" value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} placeholder="Description" className="w-full px-3 py-2 border rounded-lg text-sm" />
              <button type="submit" disabled={submitting} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50">{submitting ? '...' : 'Create'}</button>
            </form>
          )}
          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c._id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.description || 'No description'}</p>
                </div>
                <button onClick={() => handleDeleteCat(c._id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
              </div>
            ))}
          </div>
        </div>

        {/* Subcategories */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Subcategories</h2>
            <button onClick={() => setShowSubForm(!showSubForm)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">{showSubForm ? 'Cancel' : '+ Add'}</button>
          </div>
          {showSubForm && (
            <form onSubmit={handleCreateSub} className="bg-white rounded-xl shadow-md p-4 mb-4 space-y-3">
              <select value={subForm.category} onChange={(e) => setSubForm({ ...subForm, category: e.target.value })} required className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="">Select Parent Category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <input type="text" value={subForm.name} onChange={(e) => setSubForm({ ...subForm, name: e.target.value })} placeholder="Name" required className="w-full px-3 py-2 border rounded-lg text-sm" />
              <input type="text" value={subForm.description} onChange={(e) => setSubForm({ ...subForm, description: e.target.value })} placeholder="Description" className="w-full px-3 py-2 border rounded-lg text-sm" />
              <button type="submit" disabled={submitting} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50">{submitting ? '...' : 'Create'}</button>
            </form>
          )}
          <div className="space-y-2">
            {subcategories.map((s) => (
              <div key={s._id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.category?.name || '—'}</p>
                </div>
                <button onClick={() => handleDeleteSub(s._id)} className="text-red-500 hover:text-red-700 text-xs font-medium">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
