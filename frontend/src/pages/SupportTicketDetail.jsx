import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SupportTicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/api/support/${id}`);
        setTicket(data.ticket || data);
      } catch (e) { console.error(e); toast.error('Ticket not found'); }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      const { data } = await api.post(`/api/support/${id}/reply`, { message: reply });
      setTicket(data.ticket || { ...ticket, replies: [...(ticket.replies || []), data.reply || { message: reply, sender: user, createdAt: new Date() }] });
      setReply('');
      toast.success('Reply sent!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setSending(false);
  };

  const statusColor = (s) => {
    const map = { open: 'bg-blue-100 text-blue-700', in_progress: 'bg-yellow-100 text-yellow-700', resolved: 'bg-green-100 text-green-700', closed: 'bg-gray-100 text-gray-700' };
    return map[s?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!ticket) return <div className="text-center py-20 text-gray-500">Ticket not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/support" className="text-green-600 hover:underline text-sm mb-4 inline-block">← Back to Tickets</Link>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{ticket.subject}</h1>
            <p className="text-sm text-gray-500">{ticket.ticketNumber || `#${ticket._id?.slice(-8).toUpperCase()}`}</p>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusColor(ticket.status)}`}>{ticket.status?.replace('_', ' ')}</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-gray-700 text-sm leading-relaxed">{ticket.message}</p>
        </div>
        <div className="flex gap-4 text-xs text-gray-400">
          <span>Category: {ticket.category}</span>
          <span>Priority: {ticket.priority}</span>
          <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Replies</h2>
      <div className="space-y-3 mb-6">
        {(ticket.replies || []).length === 0 ? (
          <p className="text-gray-500 text-sm">No replies yet.</p>
        ) : (
          ticket.replies.map((r, i) => (
            <div key={i} className={`rounded-xl p-4 ${r.sender?._id === user?._id || r.sender === user?._id ? 'bg-green-50 ml-8' : 'bg-gray-50 mr-8'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">{r.sender?.name || 'Support'}</span>
                <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-700">{r.message}</p>
            </div>
          ))
        )}
      </div>

      {ticket.status !== 'closed' && (
        <form onSubmit={handleReply} className="bg-white rounded-xl shadow-md p-4 flex gap-3">
          <input type="text" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type your reply..." required className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
          <button type="submit" disabled={sending} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-50">
            {sending ? '...' : 'Send'}
          </button>
        </form>
      )}
    </div>
  );
}
