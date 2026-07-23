import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await api.get('/api/categories');
        setCategories(Array.isArray(data) ? data : data.categories || []);
      } catch {}
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (sort) params.set('sort', sort);
        params.set('page', page);

        const { data } = await api.get(`/api/products?${params.toString()}`);
        setProducts(data.products || data || []);
        setTotalPages(data.totalPages || data.pages || 1);
      } catch (e) { console.error(e); setProducts([]); }
      setLoading(false);
    };
    loadProducts();
  }, [page, search, category, minPrice, maxPrice, sort]);

  const handleFilter = () => {
    setPage(1);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sort) params.sort = sort;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice(''); setSort(''); setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">All Plants</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products found</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold">
          Filters {showFilters ? '✕' : '☰'}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 shrink-0`}>
          <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Filters</h3>
              <button onClick={clearFilters} className="text-green-600 text-xs font-medium hover:underline">Clear all</button>
            </div>

            {/* Search */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Search</label>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search plants..." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none" />
            </div>

            {/* Categories */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none">
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Price Range</label>
              <div className="flex gap-2">
                <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min ₹" className="w-1/2 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max ₹" className="w-1/2 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              </div>
            </div>

            {/* Sort */}
            <div className="mb-5">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Sort By</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none">
                <option value="">Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <button onClick={handleFilter} className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-semibold transition text-sm">Apply Filters</button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-bold mb-2">No plants found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or search term</p>
              <button onClick={clearFilters} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-semibold transition text-sm">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${page === p ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}>{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
