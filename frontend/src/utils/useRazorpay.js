/**
 * Dynamic script loader for Razorpay Checkout
 * @returns {Promise<boolean>}
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Failed to load Razorpay Checkout script from CDN.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Initiates Razorpay checkout flow with full event handlers
 * @param {object} options - Configuration options
 * @param {object} options.orderData - Data received from createPlacementReadyOrder
 * @param {Function} options.onSuccess - Callback upon successful verification (rzpResponse)
 * @param {Function} options.onError - Callback upon error
 * @param {Function} options.onDismiss - Callback upon modal closure
 */
export async function openRazorpayCheckout({ orderData, onSuccess, onError, onDismiss }) {
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded || !window.Razorpay) {
    if (onError) {
      onError(new Error('Razorpay SDK failed to load. Please check your network connection and try again.'));
    }
    return;
  }

  const options = {
    key: orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_dummy_key_id',
    amount: orderData.amountPaise || 2900,
    currency: orderData.currency || 'INR',
    name: 'CodeOrbit Academy',
    description: `${orderData.courseTitle || 'Subject'} — Placement Ready Kit (₹29)`,
    image: '/favicon.ico',
    order_id: orderData.razorpayOrderId,
    prefill: {
      name: orderData.userName || '',
      email: orderData.userEmail || '',
    },
    theme: {
      color: '#059669', // CodeOrbit Emerald brand tone
    },
    modal: {
      ondismiss: () => {
        if (onDismiss) onDismiss();
      }
    },
    handler: async (response) => {
      try {
        if (onSuccess) {
          await onSuccess({
            orderNumber: orderData.orderNumber,
            razorpayOrderId: response.razorpay_order_id || orderData.razorpayOrderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          });
        }
      } catch (err) {
        if (onError) onError(err);
      }
    }
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      if (onError) {
        onError(new Error(response?.error?.description || 'Payment transaction failed. Please try again.'));
      }
    });
    rzp.open();
  } catch (err) {
    if (onError) onError(err);
  }
}
