import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PLANT_PHOTOS = [
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=60&h=60&fit=crop',
  'https://images.unsplash.com/photo-1501004318855-cd2e3f8e5a34?w=60&h=60&fit=crop',
  'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=60&h=60&fit=crop',
  'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=60&h=60&fit=crop',
];

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const items = cart?.items || [];

  const [address, setAddress] = useState({ name: user?.name || '', phone: '', street: '', city: '', state: '', postalCode: '', country: 'India' });
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const shipping = 50;
  const finalTotal = cartTotal + shipping - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const { data } = await api.post('/api/coupen/apply', { code: couponCode, cartTotal });
      setDiscount(data.discount);
      setCouponApplied(true);
      toast.success(`Coupon applied! You save ₹${data.discount}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
      setDiscount(0);
      setCouponApplied(false);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Cart is empty'); return; }
    setLoading(true);
    try {
      const { data: orderData } = await api.post('/api/orders/checkout', {
        shippingAddress: address,
        paymentMethod: 'Razorpay',
        couponCode: couponApplied ? couponCode : undefined,
      });
      const orderId = orderData._id;

      const { data: rpOrder } = await api.post('/api/payment/create-order', { orderId });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rpOrder.amount || rpOrder.order?.amount,
        currency: rpOrder.currency || 'INR',
        name: 'PlantShop',
        description: 'Order Payment',
        order_id: rpOrder.id || rpOrder.order?.id,
        handler: async (response) => {
          setProcessing(true);
          try {
            await api.post('/api/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });
            await clearCart();
            toast.success('Payment successful!');
            navigate(`/orders/${orderId}`);
          } catch {
            toast.error('Payment verification failed');
            setProcessing(false);
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: '#16a34a' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (res) => {
        toast.error('Payment failed: ' + (res.error?.description || 'Unknown error'));
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    }
    setLoading(false);
  };

  if (items.length === 0 && !processing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">No items to checkout</h2>
        <button onClick={() => navigate('/products')} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition">Shop Now</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} placeholder="Full Name" required className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              <input type="text" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="Phone" required className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              <input type="text" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="Street Address" required className="md:col-span-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="City" required className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              <input type="text" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} placeholder="State" required className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              <input type="text" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} placeholder="Postal Code" required className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
              <input type="text" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} placeholder="Country" required className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-3">
              {items.map((item) => {
                const product = item.product || {};
                const img = product.images?.find(i => i.isPrimary)?.url || product.images?.[0]?.url || PLANT_PHOTOS[Math.abs(product._id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % PLANT_PHOTOS.length];
                const price = item.price || 0;
                return (
                  <div key={item._id || product._id} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                    <img src={img} alt="" className="w-14 h-14 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{price * item.quantity}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Coupon</h2>
            <div className="flex gap-2">
              <input type="text" value={couponCode} onChange={(e) => { setCouponCode(e.target.value); setCouponApplied(false); setDiscount(0); }} placeholder="Enter coupon code" className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none" disabled={couponApplied} />
              <button type="button" onClick={handleApplyCoupon} disabled={couponApplied} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50">
                {couponApplied ? 'Applied' : 'Apply'}
              </button>
            </div>
            {couponApplied && <p className="text-green-600 text-sm mt-2">Coupon applied! You save ₹{discount}</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold mb-4">Payment Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">₹{cartTotal}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className="font-medium">₹{shipping}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Coupon Discount</span><span className="font-semibold">-₹{discount}</span></div>}
            <hr />
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-green-700">₹{finalTotal}</span></div>
          </div>
          <button type="submit" disabled={loading || processing} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold mt-6 transition disabled:opacity-50">
            {processing ? 'Processing Payment...' : loading ? 'Placing Order...' : `Pay ₹${finalTotal}`}
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">Secured by Razorpay</p>
        </div>
      </form>
    </div>
  );
}
