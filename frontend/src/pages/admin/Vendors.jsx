import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/api/v1/vendor/all');
        setVendors(data.vendors || data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/api/v1/vendor/status/${id}`, { status });
      toast.success('Status updated');
      setVendors(vendors.map((v) => v._id === id ? { ...v, status } : v));
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const statusColor = (s) => {
    const map = { approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', pending: 'bg-yellow-100 text-yellow-700' };
    return map[s?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Vendors</h1>
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-50"><tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Shop</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Owner</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
          </tr></thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v._id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium">{v.shopName}</td>
                <td className="px-4 py-3 text-gray-500">{v.user?.name || '—'}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(v.status)}`}>{v.status}</span></td>
                <td className="px-4 py-3 flex gap-2">
                  {v.status !== 'approved' && <button onClick={() => handleStatus(v._id, 'approved')} className="text-green-600 hover:text-green-700 text-xs font-medium">Approve</button>}
                  {v.status !== 'rejected' && <button onClick={() => handleStatus(v._id, 'rejected')} className="text-red-500 hover:text-red-700 text-xs font-medium">Reject</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
