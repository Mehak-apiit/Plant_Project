import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get('/api/settings');
      setSettings(data.settings || data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpsert = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await api.post('/api/settings', { key, value });
      toast.success('Setting saved!');
      setKey(''); setValue('');
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setSubmitting(false);
  };

  const handleDelete = async (k) => {
    if (!confirm(`Delete setting "${k}"?`)) return;
    try { await api.delete(`/api/settings/${k}`); toast.success('Deleted'); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <form onSubmit={handleUpsert} className="bg-white rounded-xl shadow-md p-6 mb-6 flex gap-3">
        <input type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Key" required className="flex-1 px-4 py-2.5 border rounded-lg text-sm" />
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value" required className="flex-1 px-4 py-2.5 border rounded-lg text-sm" />
        <button type="submit" disabled={submitting} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold transition text-sm disabled:opacity-50">{submitting ? '...' : 'Save'}</button>
      </form>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Key</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Value</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
          </tr></thead>
          <tbody>
            {settings.map((s) => (
              <tr key={s.key || s._id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-mono font-medium">{s.key}</td>
                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{s.value}</td>
                <td className="px-4 py-3"><button onClick={() => handleDelete(s.key)} className="text-red-500 hover:text-red-700 text-xs font-medium transition">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
