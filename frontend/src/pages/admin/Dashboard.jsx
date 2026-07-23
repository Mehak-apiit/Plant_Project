import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/api/admin/dashboard');
        setStats(data);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>;

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: '📦', color: 'bg-purple-500' },
    { label: 'Total Revenue', value: `₹${stats?.totalRevenue || 0}`, icon: '💰', color: 'bg-green-500' },
  ];

  const links = [
    { to: '/admin/products', label: 'Products', icon: '🌱' },
    { to: '/admin/categories', label: 'Categories', icon: '🏷️' },
    { to: '/admin/orders', label: 'Orders', icon: '📋' },
    { to: '/admin/users', label: 'Users', icon: '👤' },
    { to: '/admin/vendors', label: 'Vendors', icon: '🏪' },
    { to: '/admin/coupons', label: 'Coupons', icon: '🎟️' },
    { to: '/admin/banners', label: 'Banners', icon: '🖼️' },
    { to: '/admin/flash-sales', label: 'Flash Sales', icon: '⚡' },
    { to: '/admin/support', label: 'Support', icon: '💬' },
    { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((c, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
            <div className={`w-14 h-14 ${c.color} rounded-xl flex items-center justify-center text-2xl`}>{c.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{c.label}</p>
              <p className="text-2xl font-bold">{c.value}</p>
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-bold mb-4">Management</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="bg-white rounded-xl shadow-md p-5 text-center hover:shadow-lg transition group">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{l.icon}</div>
            <p className="font-semibold text-gray-900 group-hover:text-green-700 transition text-sm">{l.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
