import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const PLANT_PHOTOS = [
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1501004318855-cd2e3f8e5a34?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=100&h=100&fit=crop',
];

export default function Cart() {
  const { cart, cartTotal, updateCartItem, removeFromCart, clearCart } = useCart();
  const items = cart?.items || [];

  const handleUpdate = async (productId, qty) => {
    if (qty < 1) return;
    try { await updateCartItem(productId, qty); } catch (err) { toast.error('Failed to update'); }
  };

  const handleRemove = async (productId) => {
    try { await removeFromCart(productId); toast.success('Removed'); } catch (err) { toast.error('Failed'); }
  };

  const handleClear = async () => {
    if (!confirm('Clear entire cart?')) return;
    try { await clearCart(); toast.success('Cart cleared'); } catch (err) { toast.error('Failed'); }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Add some plants to your cart to get started!</p>
        <Link to="/products" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition inline-block">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <button onClick={handleClear} className="text-red-600 hover:text-red-700 text-sm font-medium transition">Clear Cart</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const product = item.product || {};
            const img = product.images?.find(i => i.isPrimary)?.url || product.images?.[0]?.url || PLANT_PHOTOS[Math.abs(product._id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % PLANT_PHOTOS.length];
            const price = item.price || 0;
            return (
              <div key={`${product._id}-${item.quantity}`} className="bg-white rounded-xl shadow-sm p-4 flex gap-4 items-center">
                <img src={img} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <Link to={`/products/${product._id}`} className="font-semibold text-gray-900 hover:text-green-700 transition">{product.name}</Link>
                  <p className="text-green-700 font-bold">₹{price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleUpdate(product._id, item.quantity - 1)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold transition">-</button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button onClick={() => handleUpdate(product._id, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold transition">+</button>
                </div>
                <p className="font-bold text-gray-900 w-24 text-right">₹{price * item.quantity}</p>
                <button onClick={() => handleRemove(product._id)} className="text-red-500 hover:text-red-700 text-xl ml-2 transition">×</button>
              </div>
            );
          })}
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span><span className="font-semibold">₹{cartTotal}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className="text-green-600 font-medium">₹50</span></div>
            <hr />
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-green-700">₹{cartTotal + 50}</span></div>
          </div>
          <Link to="/checkout" className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-lg font-semibold mt-6 transition">Proceed to Checkout</Link>
          <Link to="/products" className="block text-center text-green-600 hover:underline text-sm mt-3">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
