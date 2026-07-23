import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/api/support');
        setTickets(data.tickets || data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/api/support/${id}/status`, { status });
      toast.success('Status updated');
      setTickets(tickets.map((t) => t._id === id ? { ...t, status } : t));
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const statusColor = (s) => {
    const map = { open: 'bg-blue-100 text-blue-700', in_progress: 'bg-yellow-100 text-yellow-700', resolved: 'bg-green-100 text-green-700', closed: 'bg-gray-100 text-gray-700' };
    return map[s?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Support Tickets</h1>
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50"><tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Ticket</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Subject</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">User</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
          </tr></thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t._id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-mono text-xs">{t.ticketNumber || t._id?.slice(-8).toUpperCase()}</td>
                <td className="px-4 py-3"><Link to={`/support/${t._id}`} className="font-medium text-green-700 hover:underline">{t.subject}</Link></td>
                <td className="px-4 py-3 text-gray-500">{t.user?.name || '—'}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(t.status)}`}>{t.status?.replace('_', ' ')}</span></td>
                <td className="px-4 py-3">
                  <select value={t.status} onChange={(e) => handleStatus(t._id, e.target.value)} className="px-2 py-1 border rounded text-xs">
                    {['open', 'in_progress', 'resolved', 'closed'].map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
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
