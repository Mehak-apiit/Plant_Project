import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  const handleLogout = () => { logout(); setUserMenu(false); navigate('/'); };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-extrabold text-green-700 whitespace-nowrap flex items-center gap-1.5">
          <span className="text-2xl">🌿</span> PlantShop
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search plants..." className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-l-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition" />
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-r-xl text-sm font-bold transition">Search</button>
        </form>

        <div className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link to="/products" className="px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-green-700 transition">Products</Link>
          {user ? (
            <>
              <Link to="/wishlist" className="px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-green-700 transition">♥ Wishlist</Link>
              <Link to="/cart" className="relative px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-green-700 transition">
                🛒 Cart
                {cartCount > 0 && <span className="absolute -top-0.5 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>}
              </Link>
              <div className="relative ml-1">
                <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm">{user.name?.charAt(0)}</div>
                  <span className="text-gray-700 text-sm max-w-[100px] truncate">{user.name}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {userMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-bold text-sm text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setUserMenu(false)} className="block px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition">👤 Profile</Link>
                      <Link to="/orders" onClick={() => setUserMenu(false)} className="block px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition">📦 My Orders</Link>
                      <Link to="/support" onClick={() => setUserMenu(false)} className="block px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition">💬 Support</Link>
                      <Link to="/vendor/apply" onClick={() => setUserMenu(false)} className="block px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 transition">🏪 Become a Vendor</Link>
                      {isAdmin && (
                        <>
                          <div className="border-t border-gray-100 my-1" />
                          <Link to="/admin" onClick={() => setUserMenu(false)} className="block px-4 py-2.5 hover:bg-green-50 text-sm text-green-700 font-semibold transition">⚡ Admin Dashboard</Link>
                        </>
                      )}
                      <div className="border-t border-gray-100 my-1" />
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 hover:bg-red-50 text-sm text-red-600 transition">🚪 Logout</button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2.5 rounded-xl hover:bg-gray-100 text-gray-700 transition font-medium">Sign In</Link>
              <Link to="/register" className="bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition font-bold shadow-sm">Sign Up</Link>
            </>
          )}
        </div>

        <button className="md:hidden text-2xl p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 space-y-1">
          <form onSubmit={handleSearch} className="flex mt-3 mb-3">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="flex-1 px-4 py-2.5 bg-gray-100 rounded-l-xl text-sm" />
            <button type="submit" className="bg-green-600 text-white px-5 py-2.5 rounded-r-xl text-sm font-bold">Search</button>
          </form>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">Products</Link>
          {user ? (
            <>
              <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">♥ Wishlist</Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">🛒 Cart ({cartCount})</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">👤 Profile</Link>
              <Link to="/orders" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">📦 My Orders</Link>
              <Link to="/support" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">💬 Support</Link>
              <Link to="/vendor/apply" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">🏪 Become a Vendor</Link>
              {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-lg hover:bg-green-50 text-green-700 font-bold">⚡ Admin Dashboard</Link>}
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block w-full text-left py-2.5 px-3 rounded-lg hover:bg-red-50 text-red-600 font-medium">🚪 Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-2.5 px-3 rounded-lg bg-green-600 text-white text-center font-bold">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
