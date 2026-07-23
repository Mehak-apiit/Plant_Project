import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, rRes] = await Promise.all([
          api.get(`/api/products/${id}`),
          api.get(`/api/reviews/${id}`),
        ]);
        setProduct(pRes.data.product || pRes.data);
        const revData = rRes.data.reviews || rRes.data || [];
        setReviews(Array.isArray(revData) ? revData : []);
        if (revData.length) {
          const avg = revData.reduce((s, r) => s + r.rating, 0) / revData.length;
          setAvgRating(avg.toFixed(1));
        }
      } catch (e) { console.error(e); toast.error('Product not found'); navigate('/products'); }
      setLoading(false);
    };
    load();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login'); return; }
    try {
      await addToCart(product._id, qty);
      toast.success('Added to cart!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login'); return; }
    setSubmitting(true);
    try {
      await api.post('/api/reviews', { product: product._id, rating, reviewText });
      toast.success('Review submitted!');
      setReviewText(''); setRating(5);
      const { data } = await api.get(`/api/reviews/${id}`);
      setReviews(data.reviews || data || []);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setSubmitting(false);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return null;

  const price = product.discountPrice || product.price;
  const PLANT_PHOTOS = [
    'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1501004318855-cd2e3f8e5a34?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=400&fit=crop',
  ];
  const hash = (product._id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const fallbackImg = PLANT_PHOTOS[hash % PLANT_PHOTOS.length];
  const img = product.images?.find(i => i.isPrimary)?.url || product.images?.[0]?.url || fallbackImg;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <img src={img} alt={product.name} className="w-full h-96 object-cover rounded-2xl shadow-lg" onError={(e) => { e.target.src = fallbackImg; }} />
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-4">
              {product.images.map((img, i) => (
                <img key={i} src={img.url} alt="" className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 hover:border-green-500 cursor-pointer transition" />
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-green-600 font-medium mb-1">{product.category?.name}</p>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          {avgRating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-500">{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</span>
              <span className="text-gray-500 text-sm">({avgRating} from {reviews.length} reviews)</span>
            </div>
          )}
          <div className="mb-4">
            <span className="text-3xl font-bold text-green-700">₹{price}</span>
            {product.discountPrice && <span className="text-lg text-gray-400 line-through ml-3">₹{product.price}</span>}
            {product.discountPrice && <span className="ml-3 bg-red-100 text-red-700 text-sm px-2 py-1 rounded-full font-semibold">-{Math.round((1 - product.discountPrice / product.price) * 100)}%</span>}
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">{product.description || product.shortDescription}</p>
          <div className="mb-4 text-sm">
            <p><span className="font-medium">Stock:</span> {product.stock > 0 ? <span className="text-green-600">{product.stock} available</span> : <span className="text-red-600">Out of stock</span>}</p>
            {product.sku && <p><span className="font-medium">SKU:</span> {product.sku}</p>}
          </div>
          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-medium">Qty:</label>
            <select value={qty} onChange={(e) => setQty(+e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
              {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
            </select>
          </div>
          <button onClick={handleAddToCart} disabled={product.stock === 0} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        {user && (
          <form onSubmit={handleReview} className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="font-semibold mb-3">Write a Review</h3>
            <div className="mb-3">
              <label className="text-sm font-medium mr-2">Rating:</label>
              {[1,2,3,4,5].map((r) => (
                <button key={r} type="button" onClick={() => setRating(r)} className={`text-2xl ${r <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</button>
              ))}
            </div>
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={3} required className="w-full px-3 py-2 border rounded-lg text-sm mb-3" placeholder="Share your experience..." />
            <button type="submit" disabled={submitting} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{rev.user?.name || 'Anonymous'}</span>
                  <span className="text-yellow-500 text-sm">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                </div>
                <p className="text-gray-600 text-sm">{rev.reviewText}</p>
                <p className="text-gray-400 text-xs mt-2">{new Date(rev.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
