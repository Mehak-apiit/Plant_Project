import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!token) { setCart({ items: [] }); setCartCount(0); return; }
    try {
      setLoading(true);
      const { data } = await api.get('/api/cart');
      setCart(data || { items: [] });
      setCartCount(data?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0);
    } catch { setCart({ items: [] }); setCartCount(0); }
    finally { setLoading(false); }
  };

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.post('/api/cart', { productId, quantity });
    await fetchCart();
    return data;
  };

  const updateCartItem = async (productId, quantity) => {
    const { data } = await api.put('/api/cart', { productId, quantity });
    await fetchCart();
    return data;
  };

  const removeFromCart = async (productId) => {
    const { data } = await api.delete(`/api/cart/${productId}`);
    await fetchCart();
    return data;
  };

  const clearCart = async () => {
    const { data } = await api.delete('/api/cart');
    setCart({ items: [] });
    setCartCount(0);
    return data;
  };

  useEffect(() => { fetchCart(); }, [token]);

  const cartTotal = cart?.items?.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, loading, addToCart, updateCartItem, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}
