import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/api/orders/${id}`);
        setOrder(data.order || data);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [id]);

  const statusColor = (s) => {
    const map = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', processing: 'bg-indigo-100 text-indigo-700', paid: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
    return map[s?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!order) return <div className="text-center py-20 text-gray-500">Order not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/orders" className="text-green-600 hover:underline text-sm mb-4 inline-block">← Back to Orders</Link>
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="font-bold">{order.orderNumber || `#${order._id?.slice(-8).toUpperCase()}`}</p>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusColor(order.status)}`}>{order.status}</span>
        </div>
        <p className="text-sm text-gray-500 mb-2">Placed on: {new Date(order.createdAt).toLocaleString()}</p>
        {order.paymentDetails?.paymentDate && <p className="text-sm text-green-600 mb-2">Paid on: {new Date(order.paymentDetails.paymentDate).toLocaleString()}</p>}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="font-bold mb-3">Items</h2>
        <div className="space-y-3">
          {(order.orderItems || []).map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-xl shrink-0">🌱</div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name || 'Product'}</p>
                <p className="text-gray-500 text-xs">Qty: {item.quantity} × ₹{item.price}</p>
              </div>
              <p className="font-semibold">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      {order.shippingAddress && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="font-bold mb-3">Shipping Address</h2>
          <p className="text-gray-600 text-sm">{order.shippingAddress.name}</p>
          <p className="text-gray-600 text-sm">{order.shippingAddress.street}</p>
          <p className="text-gray-600 text-sm">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
          <p className="text-gray-600 text-sm">{order.shippingAddress.country}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="font-bold mb-3">Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span className="font-medium">₹{order.subtotal}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span className="font-medium">₹{order.shippingFee || 0}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span className="font-medium">-₹{order.discount}</span></div>}
          {order.tax > 0 && <div className="flex justify-between"><span>Tax</span><span className="font-medium">₹{order.tax}</span></div>}
          <hr />
          <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-green-700">₹{order.totalAmount}</span></div>
        </div>
        <p className="text-xs text-gray-400 mt-3">Payment: {order.paymentMethod}</p>
      </div>
    </div>
  );
}
