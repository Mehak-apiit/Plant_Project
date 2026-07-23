import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', discountPrice: '', stock: '', category: '', isFeatured: false, isFlashSale: false });
  const [submitting, setSubmitting] = useState(false);

  const loadProducts = async (p = 1) => {
    try {
      const { data } = await api.get(`/api/products?page=${p}`);
      setProducts(data.products || data || []);
      setTotalPages(data.totalPages || data.pages || 1);
    } catch (e) { console.error(e); }
  };

  const loadCategories = async () => {
    try {
      const { data } = await api.get('/api/categories');
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch {}
  };

  useEffect(() => { loadProducts(page); loadCategories(); setLoading(false); }, [page]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/products', { ...form, price: +form.price, discountPrice: form.discountPrice ? +form.discountPrice : undefined, stock: +form.stock });
      toast.success('Product created!');
      setForm({ name: '', description: '', price: '', discountPrice: '', stock: '', category: '', isFeatured: false, isFlashSale: false });
      setShowForm(false);
      loadProducts(page);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await api.delete(`/api/products/${id}`); toast.success('Deleted'); loadProducts(page); } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold transition text-sm">
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow-md p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product Name" required className="px-4 py-2.5 border rounded-lg text-sm" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="px-4 py-2.5 border rounded-lg text-sm">
            <option value="">Select Category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price (₹)" required className="px-4 py-2.5 border rounded-lg text-sm" />
          <input type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} placeholder="Discount Price (optional)" className="px-4 py-2.5 border rounded-lg text-sm" />
          <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Stock" required className="px-4 py-2.5 border rounded-lg text-sm" />
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFlashSale} onChange={(e) => setForm({ ...form, isFlashSale: e.target.checked })} /> Flash Sale</label>
          </div>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className="md:col-span-2 px-4 py-2.5 border rounded-lg text-sm" />
          <button type="submit" disabled={submitting} className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold transition text-sm disabled:opacity-50">{submitting ? 'Creating...' : 'Create Product'}</button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left font-medium text-gray-600">Name</th><th className="px-4 py-3 text-left font-medium text-gray-600">Price</th><th className="px-4 py-3 text-left font-medium text-gray-600">Stock</th><th className="px-4 py-3 text-left font-medium text-gray-600">Category</th><th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-green-700 font-semibold">₹{p.discountPrice || p.price}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3 text-gray-500">{p.category?.name || '—'}</td>
                <td className="px-4 py-3"><button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700 font-medium transition text-xs">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${page === p ? 'bg-green-600 text-white' : 'bg-white border text-gray-700 hover:bg-gray-100'}`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
