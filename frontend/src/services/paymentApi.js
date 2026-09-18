import { API_BASE, getAuthHeaders } from './apiConfig';

export const paymentApi = {
  // 1. Create Internal Pending Order from E-book IDs
  async createOrder(ebookIds) {
    const res = await fetch(`${API_BASE}/student/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ebookIds })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to create internal order');
    }
    return data.data;
  },

  // 2. Request Razorpay Order Creation from Backend
  async createRazorpayOrder(orderId) {
    const res = await fetch(`${API_BASE}/payments/create-order`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderId })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to initialize Razorpay order');
    }
    return data.data;
  },

  // 3. Verify Razorpay Payment Signature on Backend
  async verifyPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    const res = await fetch(`${API_BASE}/payments/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Payment signature verification failed');
    }
    return data.data;
  },

  // 4. Fetch Student Order History
  async getStudentOrders() {
    const res = await fetch(`${API_BASE}/student/orders`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch student orders');
    }
    return data.data || [];
  },

  // 5. Fetch Single Order Details
  async getStudentOrderById(orderId) {
    const res = await fetch(`${API_BASE}/student/orders/${orderId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch order details');
    }
    return data.data;
  },

  // 6. Fetch Student Purchased E-books Library
  async getStudentLibrary() {
    const res = await fetch(`${API_BASE}/student/library`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch student library');
    }
    return data.data || [];
  },

  // 7. Secure PDF Download / Streaming
  async downloadEbookPdf(ebookId, fallbackTitle = 'ebook') {
    const token = localStorage.getItem('codeorbit_jwt');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await fetch(`${API_BASE}/student/ebooks/${ebookId}/download`, {
      method: 'GET',
      headers
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.message || `Download failed with status ${res.status}`);
    }

    // Extract filename from Content-Disposition header if available
    const disposition = res.headers.get('Content-Disposition');
    let filename = `${fallbackTitle.replace(/[^a-zA-Z0-9.-]/g, '_')}.pdf`;
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) {
        filename = match[1].replace(/['"]/g, '').trim();
      }
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true, filename };
  },

  // 8. Check if user purchased ebook
  async checkEbookAccess(ebookId) {
    const res = await fetch(`${API_BASE}/student/ebooks/${ebookId}/access`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    return res.ok && data.data === true;
  }
};
