import { API_BASE, getAuthHeaders } from './apiConfig';

/**
 * Creates a Razorpay payment order for the Placement Ready subcourse (₹29)
 * @param {string} courseSlug - Subject track slug (e.g. 'dsa', 'java')
 * @returns {Promise<object>} Order response containing razorpayOrderId, keyId, amount
 */
export async function createPlacementReadyOrder(courseSlug) {
  const res = await fetch(`${API_BASE}/payments/placement-ready/order`, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: JSON.stringify({
      courseSlug: courseSlug?.trim()?.toLowerCase()
    })
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Failed to create payment order');
  }
  return json.data;
}

/**
 * Submits Razorpay payment signatures to backend for HMAC-SHA256 verification and entitlement granting
 * @param {object} payload - { orderNumber, razorpayOrderId, razorpayPaymentId, razorpaySignature }
 * @returns {Promise<object>} Verified payment summary
 */
export async function verifyPlacementReadyPayment(payload) {
  const res = await fetch(`${API_BASE}/payments/placement-ready/verify`, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Payment verification failed');
  }
  return json.data;
}

/**
 * Retrieves authenticated student's placement ready payment history
 * @returns {Promise<Array>} List of placement ready payments
 */
export async function getMyPayments() {
  const res = await fetch(`${API_BASE}/payments/my`, {
    method: 'GET',
    headers: getAuthHeaders(true)
  });

  if (!res.ok) {
    return [];
  }
  const json = await res.json();
  return json.data || [];
}

/**
 * Checks placement ready access and purchase status for a course
 * @param {string} courseSlug
 * @returns {Promise<object>}
 */
export async function getPlacementReadyStatus(courseSlug) {
  const res = await fetch(`${API_BASE}/payments/placement-ready/status/${courseSlug}`, {
    method: 'GET',
    headers: getAuthHeaders(true)
  });

  if (!res.ok) {
    return { hasAccess: false, priceInr: 29 };
  }
  const json = await res.json();
  return json.data;
}
