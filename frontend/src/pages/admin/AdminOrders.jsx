import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  const load = async (p = 1) => {
    try {
      const params = new URLSearchParams({ page: p });
      if (statusFilter) params.set('status', statusFilter);
      const { data } = await api.get(`/api/orders?${params.toString()}`);
      setOrders(data.orders || data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(page); }, [page, statusFilter]);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/api/orders/${id}/status`, { status });
      toast.success('Status updated');
      load(page);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const statusColor = (s) => {
    const map = { pending: 'bg-yellow-100 text-yellow-700', paid: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
    return map[s?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <div className="flex gap-2 mb-4">
        {['', 'pending', 'paid', 'shipped', 'delivered'].map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${statusFilter === s ? 'bg-green-600 text-white' : 'bg-white border text-gray-700 hover:bg-gray-100'}`}>{s || 'All'}</button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-50"><tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Order</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Total</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
          </tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3"><Link to={`/orders/${o._id}`} className="font-medium text-green-700 hover:underline">#{o._id?.slice(-8).toUpperCase()}</Link></td>
                <td className="px-4 py-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-semibold">₹{o.totalAmount}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(o.status)}`}>{o.status}</span></td>
                <td className="px-4 py-3">
                  <select value={o.status} onChange={(e) => handleStatus(o._id, e.target.value)} className="px-2 py-1 border rounded text-xs">
                    {['pending', 'paid', 'shipped', 'delivered'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
