import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const CATEGORY_DATA = [
  { name: 'Indoor', img: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&h=200&fit=crop' },
  { name: 'Outdoor', img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop' },
  { name: 'Succulents', img: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=200&h=200&fit=crop' },
  { name: 'Flowering', img: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=200&h=200&fit=crop' },
  { name: 'Bamboo', img: 'https://images.unsplash.com/photo-1585056845133-e0e7e8afcc61?w=200&h=200&fit=crop' },
  { name: 'Tropical', img: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=200&h=200&fit=crop' },
  { name: 'Herbs', img: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=200&h=200&fit=crop' },
  { name: 'Pots', img: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&h=200&fit=crop' },
];

const FEATURED_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1501004318855-cd2e3f8e5a34?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1596438459194-f275f413d6ff?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=300&fit=crop',
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [flashSale, setFlashSale] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [fRes, fbRes, bRes, cRes] = await Promise.all([
          api.get('/api/products/featured'),
          api.get('/api/products/flash'),
          api.get('/api/marketing/banner'),
          api.get('/api/categories'),
        ]);
        setFeatured(fRes.data.products || fRes.data || []);
        setFlashSale(fbRes.data.products || fbRes.data || []);
        setBanners(Array.isArray(bRes.data) ? bRes.data : bRes.data.banners || []);
        setCategories(Array.isArray(cRes.data) ? cRes.data : cRes.data.categories || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, []);

  const displayCategories = categories.length > 0 ? categories.filter(c => c.isActive !== false).slice(0, 8) : CATEGORY_DATA;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 z-10">
            <span className="inline-block bg-white/20 text-white text-sm px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm">Free delivery on orders above ₹999</span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">Bring Nature<br/>Into Your <span className="text-green-200">Home</span></h1>
            <p className="text-green-100 text-lg mb-8 max-w-lg leading-relaxed">Discover our premium collection of indoor and outdoor plants. Fresh, healthy, and delivered right to your doorstep.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="bg-white text-green-800 px-8 py-3.5 rounded-xl font-bold hover:bg-green-50 transition shadow-lg">Shop Now →</Link>
              <Link to="/vendor/apply" className="border-2 border-white/60 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 transition backdrop-blur-sm">Become a Vendor</Link>
            </div>
            <div className="flex gap-8 mt-10 text-sm">
              <div><p className="text-2xl font-bold">500+</p><p className="text-green-200">Plant Varieties</p></div>
              <div><p className="text-2xl font-bold">10K+</p><p className="text-green-200">Happy Customers</p></div>
              <div><p className="text-2xl font-bold">4.8★</p><p className="text-green-200">Average Rating</p></div>
            </div>
          </div>
          <div className="flex-1 z-10 hidden md:block">
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80" alt="Beautiful plants" className="rounded-3xl shadow-2xl w-full max-w-lg" />
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 rounded-2xl shadow-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">🌱</div>
                <div>
                  <p className="font-bold text-sm">Fresh Plants</p>
                  <p className="text-gray-500 text-xs">100% organic</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banners */}
      {banners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.slice(0, 2).map((b, i) => (
              <div key={b._id} className={`rounded-2xl p-8 text-white shadow-lg relative overflow-hidden ${i === 0 ? 'bg-gradient-to-r from-emerald-600 to-teal-500' : 'bg-gradient-to-r from-green-600 to-lime-500'}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
                <h3 className="text-2xl font-bold mb-2 relative z-10">{b.title || b.name}</h3>
                <p className="text-white/80 text-sm mb-4 max-w-xs relative z-10">{b.description || b.subtitle}</p>
                <Link to="/products" className="bg-white text-green-700 px-5 py-2 rounded-lg text-sm font-bold hover:bg-green-50 transition inline-block relative z-10 shadow">Shop Now</Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <p className="text-gray-500 text-sm mt-1">Find the perfect plant for your space</p>
          </div>
          <Link to="/products" className="text-green-600 hover:underline font-medium text-sm hidden md:block">View All →</Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {displayCategories.map((cat, i) => (
            <Link key={cat._id || i} to={cat._id ? `/products?category=${cat._id}` : '/products'} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 text-center group border border-gray-100">
              <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <img src={cat.image || CATEGORY_DATA[i % CATEGORY_DATA.length]?.img} alt={cat.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = CATEGORY_DATA[i % CATEGORY_DATA.length]?.img; }} />
              </div>
              <h3 className="font-semibold text-gray-900 text-xs group-hover:text-green-700 transition">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale */}
      {flashSale.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">LIMITED TIME</div>
              <h2 className="text-2xl font-bold">🔥 Flash Sale</h2>
            </div>
            <Link to="/products" className="text-green-600 hover:underline font-medium text-sm">View All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {flashSale.slice(0, 4).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">⭐ Featured Plants</h2>
            <p className="text-gray-500 text-sm mt-1">Handpicked by our experts</p>
          </div>
          <Link to="/products" className="text-green-600 hover:underline font-medium text-sm">View All →</Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-10"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.slice(0, 8).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FEATURED_PLACEHOLDERS.map((img, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <img src={img} alt="Plant" className="w-full h-56 object-cover" />
                <div className="p-4">
                  <p className="text-xs text-green-600 font-medium mb-1">Indoor Plant</p>
                  <h3 className="font-semibold text-gray-900">Beautiful Plant {i + 1}</h3>
                  <p className="text-green-700 font-bold mt-2">₹{299 + i * 100}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-white py-12 border-y">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹999' },
            { icon: '🌱', title: 'Fresh Plants', desc: '100% healthy & fresh' },
            { icon: '🔄', title: 'Easy Returns', desc: '7-day return policy' },
            { icon: '💬', title: '24/7 Support', desc: 'Expert plant care tips' },
          ].map((f, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">{f.icon}</div>
              <h3 className="font-bold text-sm">{f.title}</h3>
              <p className="text-gray-500 text-xs mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-green-900/80" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Selling?</h2>
          <p className="text-green-200 mb-8 max-w-lg mx-auto">Join our marketplace as a vendor and reach thousands of plant lovers across the country.</p>
          <Link to="/vendor/apply" className="bg-white text-green-700 px-10 py-3.5 rounded-xl font-bold hover:bg-green-50 transition inline-block shadow-lg">Apply as Vendor →</Link>
        </div>
      </section>
    </div>
  );
}
