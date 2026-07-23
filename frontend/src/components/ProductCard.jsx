import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const PLANT_PHOTOS = [
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1501004318855-cd2e3f8e5a34?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1596438459194-f275f413d6ff?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1545241047-6083a3684587?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1525498128493-380d1990a112?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1604762524889-3e2fcc145683?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1530968033775-2c92736b131e?w=400&h=300&fit=crop',
];

function getPlantImage(product, index) {
  if (product.images?.length > 0) {
    const primary = product.images.find(i => i.isPrimary);
    if (primary?.url) return primary.url;
    if (product.images[0]?.url) return product.images[0].url;
  }
  const hash = (product._id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return PLANT_PHOTOS[(hash + index) % PLANT_PHOTOS.length];
}

export default function ProductCard({ product, index = 0 }) {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please login to add to cart'); return; }
    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const price = product.discountPrice || product.price;
  const img = getPlantImage(product, index);

  return (
    <Link to={`/products/${product._id}`} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
      <div className="relative overflow-hidden">
        <img src={img} alt={product.name} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" onError={(e) => { e.target.src = PLANT_PHOTOS[index % PLANT_PHOTOS.length]; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {product.isFlashSale && <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow">🔥 Flash</span>}
        {product.isFeatured && <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow">⭐ Featured</span>}
        {product.discountPrice && (
          <div className="absolute bottom-3 right-3 bg-green-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow">
            -{Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
          </div>
        )}
        <button onClick={handleAddToCart} className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-green-700 text-sm px-4 py-2 rounded-xl font-bold shadow-lg hover:bg-green-600 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
          + Add
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs text-green-600 font-semibold mb-1 uppercase tracking-wide">{product.category?.name || 'Plant'}</p>
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition min-h-[2.5rem]">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-green-700">₹{price}</span>
            {product.discountPrice && <span className="text-sm text-gray-400 line-through">₹{product.price}</span>}
          </div>
        </div>
        {(product.ratingsAverage > 0 || product.rating > 0) && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex text-yellow-400 text-xs">
              {'★'.repeat(Math.round(product.ratingsAverage || product.rating || 0))}{'☆'.repeat(5 - Math.round(product.ratingsAverage || product.rating || 0))}
            </div>
            <span className="text-gray-400 text-xs">({product.ratingsCount || product.numReviews || 0})</span>
          </div>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-orange-500 text-xs font-medium mt-2">Only {product.stock} left!</p>
        )}
      </div>
    </Link>
  );
}
