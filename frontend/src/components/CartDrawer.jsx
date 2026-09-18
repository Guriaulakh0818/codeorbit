import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export const CartDrawer = ({ onProceedToCheckout }) => {
  const {
    cartItems,
    removeFromCart,
    isCartOpen,
    setIsCartOpen,
    couponCode,
    discountPercent,
    applyCoupon,
    rawTotal,
    discountAmount,
    finalTotal
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [couponStatus, setCouponStatus] = useState(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyCoupon(inputCode);
    setCouponStatus(res);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0b132b] border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-400" />
              <h2 className="text-base font-bold text-white">Your Cart ({cartItems.length})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Your cart is empty</h3>
                  <p className="text-xs text-slate-400 mt-1">Explore our engineering e-books and kickstart your preparation.</p>
                </div>
                <Link
                  to="/catalog"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-brand-500/20 transition-all"
                >
                  Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 relative group"
                    >
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-14 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 pr-6">
                        <span className="text-[10px] text-brand-400 font-semibold uppercase">{item.categoryName}</span>
                        <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">PDF • {item.pages} pages</p>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-xs font-bold text-sky-300">₹{item.price}</span>
                          <span className="text-[10px] text-slate-400 line-through">₹{item.originalPrice}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="absolute right-3 top-3 p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Coupon Box */}
                <div className="pt-4 border-t border-slate-800">
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-brand-400" /> Have a Promo Code?
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. ENGINEER50"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white uppercase placeholder-slate-400 focus:outline-none focus:border-brand-500 font-mono"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-slate-800 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                      >
                        Apply
                      </button>
                    </div>

                    {couponStatus && (
                      <p className={`text-xs ${couponStatus.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {couponStatus.message}
                      </p>
                    )}
                  </form>
                </div>
              </>
            )}
          </div>

          {/* Checkout Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-slate-900/90 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{rawTotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Coupon ({couponCode} - {discountPercent}%)</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>GST & Processing</span>
                  <span className="text-emerald-400">FREE</span>
                </div>

                <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-bold text-white">
                  <span>Total Amount</span>
                  <span className="text-base text-brand-400">₹{finalTotal}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3 bg-brand-600 hover:bg-brand-500 active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Razorpay Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted & Instant Access</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
