import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { paymentApi } from '../services/paymentApi';
import { loadRazorpayScript } from '../utils/loadRazorpay';

export const RazorpayCheckoutModal = ({ isOpen, onClose, singleEbook = null }) => {
  const { cartItems, finalTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);
  const [verifiedOrder, setVerifiedOrder] = useState(null);

  const itemsToBuy = singleEbook ? [singleEbook] : cartItems;
  const totalAmount = singleEbook ? singleEbook.price : finalTotal;

  if (!isOpen || itemsToBuy.length === 0) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Confetti fallback
    }
  };

  const handleStartCheckout = async () => {
    if (!isAuthenticated) {
      onClose();
      navigate('/login');
      return;
    }

    setErrorStatus(null);
    setIsProcessing(true);

    try {
      // 1. Create internal pending order from e-book IDs (Server calculates total amount strictly from DB)
      const ebookIds = itemsToBuy.map(i => i.id);
      const internalOrder = await paymentApi.createOrder(ebookIds);

      // 2. Request backend to create Razorpay Order
      const rzpOrderData = await paymentApi.createRazorpayOrder(internalOrder.id);

      // 3. Load official Razorpay Checkout script
      const isScriptLoaded = await loadRazorpayScript();

      if (isScriptLoaded && window.Razorpay && rzpOrderData.razorpayKeyId && !rzpOrderData.razorpayKeyId.includes('placeholder')) {
        // Standard Live / Test Mode Razorpay Modal Flow
        const options = {
          key: rzpOrderData.razorpayKeyId,
          amount: rzpOrderData.amountInPaise,
          currency: rzpOrderData.currency || 'INR',
          name: 'CodeOrbit Store',
          description: `Order #${internalOrder.orderNumber} - ${itemsToBuy.length} E-Book(s)`,
          order_id: rzpOrderData.razorpayOrderId,
          prefill: {
            name: user?.name || user?.fullName || 'Student',
            email: user?.email || 'student@codeorbit.dev',
          },
          theme: {
            color: '#0284c7'
          },
          handler: async function (response) {
            setIsProcessing(true);
            try {
              // Verify HMAC-SHA256 signature on backend
              const verificationResult = await paymentApi.verifyPayment({
                razorpayOrderId: response.razorpay_order_id || rzpOrderData.razorpayOrderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              });

              handlePaymentComplete(verificationResult);
            } catch (err) {
              setErrorStatus(err.message || 'Payment signature verification failed on server.');
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              setErrorStatus('Payment was cancelled or closed. You can retry anytime.');
            }
          }
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on('payment.failed', function (resp) {
          setIsProcessing(false);
          setErrorStatus(resp.error?.description || 'Payment failed with your bank. Please try again.');
        });
        razorpayInstance.open();
      } else {
        // Gateway Key not configured or offline
        setIsProcessing(false);
        setErrorStatus('Razorpay payment gateway credentials are not configured on the server. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
      }
    } catch (err) {
      setIsProcessing(false);
      setErrorStatus(err.message || 'Failed to initiate checkout with payment gateway.');
    }
  };

  const handlePaymentComplete = (orderData) => {
    setIsProcessing(false);
    setVerifiedOrder(orderData);
    triggerConfetti();

    if (!singleEbook) {
      clearCart();
    }

    // Auto navigate to student orders in 2.5 seconds
    setTimeout(() => {
      onClose();
      navigate('/student/dashboard');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#0b132b] border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#02042b] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0c2340] border border-[#0284c7]/40 flex items-center justify-center shadow-lg shadow-sky-500/10">
              <span className="font-black text-[#0ea5e9] text-base italic">R</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">Razorpay Checkout</span>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 font-semibold px-2 py-0.5 rounded-full border border-sky-500/30">
                  TEST MODE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Secure 256-Bit SSL Encrypted Payment</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {verifiedOrder ? (
          <div className="p-8 text-center space-y-4 bg-slate-900/90 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Payment Verified & Complete!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Order Number: <span className="font-mono text-sky-400 font-bold">{verifiedOrder.orderNumber || 'ORD-CONFIRMED'}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
              <p className="text-slate-400 font-semibold">Purchased Engineering Items ({itemsToBuy.length}):</p>
              {itemsToBuy.map((b) => (
                <p key={b.id} className="font-medium text-slate-200 truncate flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                  <span>{b.title}</span>
                </p>
              ))}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">₹{totalAmount}</span>
              </div>
            </div>

            <p className="text-xs text-sky-300 animate-pulse font-medium">
              Redirecting to your student dashboard & orders...
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Error Alert */}
            {errorStatus && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-rose-200">Checkout Notice</p>
                  <p className="mt-0.5">{errorStatus}</p>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Order Summary</span>
                  <h4 className="text-xs font-bold text-white mt-0.5">
                    {itemsToBuy.length} Item(s) Selected
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Payable Amount</span>
                  <span className="text-lg font-black text-sky-400 font-mono">₹{totalAmount}</span>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-800/80 text-xs">
                {itemsToBuy.map(item => (
                  <div key={item.id} className="flex justify-between text-slate-300 text-[11px]">
                    <span className="truncate max-w-[260px]">• {item.title}</span>
                    <span className="font-mono text-slate-400">₹{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User Details Notice */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
              <p className="font-semibold text-slate-200">Student Account</p>
              <p className="text-slate-400 text-[11px]">
                {isAuthenticated ? (
                  <>Logged in as <strong className="text-sky-300">{user?.email}</strong> ({user?.name || user?.fullName})</>
                ) : (
                  <span className="text-amber-400">Please login to proceed with order placement.</span>
                )}
              </p>
            </div>

            {/* Razorpay Test Mode Banner */}
            <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/20 text-[11px] text-sky-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Razorpay Test Mode:</strong> Real money will not be deducted. You can test with Razorpay sandbox cards, UPI, or test credentials.
              </span>
            </div>

            {/* Pay Button */}
            <button
              onClick={handleStartCheckout}
              disabled={isProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-brand-600 via-sky-500 to-sky-600 hover:from-brand-500 hover:to-sky-400 text-white font-bold text-xs rounded-2xl shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Razorpay Checkout & Verification...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pay ₹{totalAmount} via Razorpay</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
