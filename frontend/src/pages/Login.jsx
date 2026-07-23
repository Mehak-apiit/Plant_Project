import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex">
      {/* Left - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-green-700 relative overflow-hidden items-center justify-center">
        <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="relative z-10 text-white text-center px-10">
          <div className="text-6xl mb-6">🌿</div>
          <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-green-100 text-lg">Continue your journey with nature. Your plants are waiting for you.</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="text-3xl font-bold">🌿 PlantShop</Link>
          </div>
          <h2 className="text-3xl font-bold mb-2">Sign In</h2>
          <p className="text-gray-500 mb-8">Enter your credentials to access your account</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-sm" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-sm" placeholder="••••••••" />
            </div>
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-green-600 hover:underline font-medium">Forgot Password?</Link>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition disabled:opacity-50 shadow-lg shadow-green-200">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center mt-8 text-sm text-gray-600">
            Don't have an account? <Link to="/register" className="text-green-600 font-bold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
