import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Loader2, Sparkles, ExternalLink, RefreshCw, Smartphone, CreditCard } from 'lucide-react';
import { triggerConfetti } from '../utils/confettiHelper';
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
  const [testModeOrderData, setTestModeOrderData] = useState(null);

  const itemsToBuy = singleEbook ? [singleEbook] : cartItems;
  const totalAmount = singleEbook ? singleEbook.price : finalTotal;

  if (!isOpen || itemsToBuy.length === 0) return null;

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
        return;
      }

      // 4. Test Sandbox Mode / Simulated Mode when keys are placeholder
      setTestModeOrderData(rzpOrderData);
      setIsProcessing(false);

    } catch (err) {
      console.error('Checkout error:', err);
      setErrorStatus(err.message || 'Could not initialize Razorpay checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleSimulatedPayment = async (status = 'SUCCESS') => {
    if (!testModeOrderData) return;
    setIsProcessing(true);
    setErrorStatus(null);

    try {
      if (status === 'SUCCESS') {
        const mockPaymentId = `pay_sim_${Date.now()}`;
        const mockSignature = `sig_sim_${Date.now()}`;

        const verificationResult = await paymentApi.verifyPayment({
          razorpayOrderId: testModeOrderData.razorpayOrderId,
          razorpayPaymentId: mockPaymentId,
          razorpaySignature: mockSignature
        });

        handlePaymentComplete(verificationResult);
      } else {
        setIsProcessing(false);
        setErrorStatus('Simulated payment was cancelled or failed.');
      }
    } catch (err) {
      setIsProcessing(false);
      setErrorStatus(err.message || 'Verification failed in simulator.');
    }
  };

  const handlePaymentComplete = (orderResult) => {
    setIsProcessing(false);
    setTestModeOrderData(null);
    setVerifiedOrder(orderResult);
    clearCart();
    triggerConfetti();
  };

  const handleClose = () => {
    if (isProcessing) return;
    setErrorStatus(null);
    setVerifiedOrder(null);
    setTestModeOrderData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-4 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Razorpay Secure Checkout</h3>
              <p className="text-xs text-slate-400">Instant Automated E-Book Delivery</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {verifiedOrder ? (
            /* Success State */
            <div className="flex flex-col items-center text-center space-y-4 py-2">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm animate-pulse" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                  Payment Successful! <Sparkles className="h-5 w-5 text-amber-400" />
                </h4>
                <p className="text-sm text-slate-300">
                  Thank you for your purchase. Your e-books are now unlocked!
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="w-full rounded-2xl bg-slate-800/60 border border-slate-700/60 p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Order Number:</span>
                  <span className="font-mono font-semibold text-white">{verifiedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Razorpay Payment ID:</span>
                  <span className="font-mono text-slate-200">{verifiedOrder.razorpayPaymentId || 'pay_verified'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Total Paid:</span>
                  <span className="font-bold text-emerald-400 text-sm">₹{Number(verifiedOrder.totalAmount || totalAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300 border-t border-slate-700/60 pt-2">
                  <span className="text-slate-400">Delivery Method:</span>
                  <span className="text-sky-400 font-medium">Instant Digital Access & PDF Download</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    handleClose();
                    navigate('/dashboard');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-medium shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:from-sky-400 hover:to-indigo-500 transition text-sm flex items-center justify-center gap-2"
                >
                  Go to My Library
                </button>
                <button
                  onClick={handleClose}
                  className="py-3 px-4 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition text-sm font-medium"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          ) : testModeOrderData ? (
            /* Razorpay Test Mode Simulator (Frictionless Sandbox Testing) */
            <div className="space-y-4">
              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs text-amber-200 flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block text-amber-300">Razorpay Sandbox / Simulator Mode</strong>
                  Live keys not configured on backend. You can test instant payment completion or failure without real money.
                </div>
              </div>

              <div className="rounded-2xl bg-slate-800/40 border border-slate-700/50 p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Order Ref:</span>
                  <span className="font-mono text-white">{testModeOrderData.orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Amount to Pay:</span>
                  <span className="font-bold text-white text-base">₹{Number(testModeOrderData.amountInRupees || totalAmount).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Select Test Action:</p>
                <button
                  onClick={() => handleSimulatedPayment('SUCCESS')}
                  disabled={isProcessing}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Simulate Successful Payment (Instant Unlock)
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleSimulatedPayment('FAILED')}
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 transition text-xs font-medium"
                >
                  Simulate Payment Failure
                </button>
              </div>
            </div>
          ) : (
            /* Initial Checkout Summary */
            <div className="space-y-5">
              {/* E-Books Summary List */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Order Items ({itemsToBuy.length})</span>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {itemsToBuy.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-xl bg-slate-800/40 border border-slate-800 p-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.coverImageUrl ? (
                          <img src={item.coverImageUrl} alt={item.title} className="h-10 w-8 rounded object-cover shrink-0" />
                        ) : (
                          <div className="h-10 w-8 rounded bg-sky-500/20 flex items-center justify-center text-[10px] text-sky-400 font-bold shrink-0">
                            PDF
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                          <p className="text-[11px] text-slate-400 truncate">{item.authorName}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-sky-400 ml-2 shrink-0">₹{Number(item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="rounded-2xl bg-slate-800/40 border border-slate-700/60 p-3.5 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>₹{Number(totalAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Platform Fee & Taxes</span>
                  <span className="text-emerald-400 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm border-t border-slate-700/80 pt-2">
                  <span>Total Payable</span>
                  <span className="text-sky-400 text-base">₹{Number(totalAmount).toFixed(2)}</span>
                </div>
              </div>

              {/* Supported Payment Methods Badges */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 border-t border-slate-800/80 pt-3">
                <span className="flex items-center gap-1"><Smartphone className="h-3.5 w-3.5 text-sky-400" /> UPI (GPay / PhonePe / Paytm)</span>
                <span className="flex items-center gap-1"><CreditCard className="h-3.5 w-3.5 text-indigo-400" /> Cards & NetBanking</span>
              </div>

              {/* Error Message if any */}
              {errorStatus && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="flex-1">{errorStatus}</p>
                </div>
              )}

              {/* Pay Now Button */}
              <button
                onClick={handleStartCheckout}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Initializing Razorpay Checkout...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Pay ₹{Number(totalAmount).toFixed(2)} via Razorpay
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
