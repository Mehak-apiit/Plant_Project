import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const PLANT_PHOTOS = [
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1501004318855-cd2e3f8e5a34?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=300&h=200&fit=crop',
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=200&fit=crop',
];

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/api/wishlist');
        setItems(data.products || data.wishlist?.products || data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/api/wishlist/${productId}`);
      setItems(items.filter((p) => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch (err) { toast.error('Failed'); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">❤️</div>
        <h2 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h2>
        <Link to="/products" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition inline-block">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => {
          const img = p.images?.find(i => i.isPrimary)?.url || p.images?.[0]?.url || PLANT_PHOTOS[Math.abs(p._id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % PLANT_PHOTOS.length];
          return (
            <div key={p._id} className="bg-white rounded-xl shadow-md overflow-hidden group">
              <Link to={`/products/${p._id}`}>
                <img src={img} alt={p.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              </Link>
              <div className="p-4">
                <Link to={`/products/${p._id}`}><h3 className="font-semibold text-gray-900 hover:text-green-700 transition line-clamp-1">{p.name}</h3></Link>
                <p className="text-green-700 font-bold mt-1">₹{p.discountPrice || p.price}</p>
                <button onClick={() => handleRemove(p._id)} className="mt-2 text-red-500 hover:text-red-700 text-sm font-medium transition">Remove</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
