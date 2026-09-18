import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('codeorbit_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    localStorage.setItem('codeorbit_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (ebook) => {
    if (!cartItems.some(item => item.id === ebook.id)) {
      setCartItems(prev => [...prev, ebook]);
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (ebookId) => {
    setCartItems(prev => prev.filter(item => item.id !== ebookId));
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscountPercent(0);
    setCouponCode('');
  };

  const applyCoupon = (code) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'ENGINEER50') {
      setDiscountPercent(50);
      setCouponCode(normalized);
      return { success: true, message: '50% Engineering discount applied!' };
    } else if (normalized === 'FIRST10' || normalized === 'CODEORBIT') {
      setDiscountPercent(15);
      setCouponCode(normalized);
      return { success: true, message: '15% Discount coupon applied!' };
    }
    return { success: false, message: 'Invalid coupon code. Try ENGINEER50 or CODEORBIT' };
  };

  const rawTotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const discountAmount = Math.round((rawTotal * discountPercent) / 100);
  const finalTotal = Math.max(0, rawTotal - discountAmount);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      couponCode,
      discountPercent,
      applyCoupon,
      rawTotal,
      discountAmount,
      finalTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    return {
      cartItems: [],
      addToCart: () => {},
      removeFromCart: () => {},
      clearCart: () => {},
      isCartOpen: false,
      setIsCartOpen: () => {},
      couponCode: '',
      discountPercent: 0,
      applyCoupon: () => ({ success: false, message: 'Cart not ready' }),
      rawTotal: 0,
      discountAmount: 0,
      finalTotal: 0
    };
  }
  return context;
};

