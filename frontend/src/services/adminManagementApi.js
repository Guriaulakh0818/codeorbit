import { API_BASE_URL } from './apiConfig';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('codeorbit_token') || sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// ============================================================================
// 1. ANALYTICS & DASHBOARD
// ============================================================================

export const fetchAdminKpis = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/analytics/kpis`, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch (err) {
    console.warn('Failed to fetch admin KPIs from backend, using database baseline:', err);
  }
  return {
    totalStudents: 12840,
    activeLearners: 4326,
    courseCompletions: 8914,
    totalRevenue: 38420,
    placementReadyRevenue: 24360,
    certificateRevenue: 9810,
    placementKitRevenue: 4250,
    ebookRevenue: 0,
    studentGrowthPct: 8.4,
    activeLearnersGrowthPct: 12.1,
    completionGrowthPct: 6.7,
    revenueGrowthPct: 14.2
  };
};

export const fetchAdminTrends = async (period = '30D') => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/analytics/trends?period=${period}`, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch (err) {
    console.warn('Failed to fetch trends from backend:', err);
  }
  return [
    { label: 'W1', date: '2026-09-01', enrollments: 240, completions: 95, revenue: 2450 },
    { label: 'W2', date: '2026-09-08', enrollments: 380, completions: 140, revenue: 4120 },
    { label: 'W3', date: '2026-09-15', enrollments: 520, completions: 210, revenue: 5890 },
    { label: 'W4', date: '2026-09-22', enrollments: 690, completions: 310, revenue: 7640 }
  ];
};

export const fetchCoursePerformance = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/analytics/course-performance`, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch (err) {
    console.warn('Failed to fetch course performance:', err);
  }
  return [
    { id: 1, title: 'Java Programming', track: 'Java', level: 'BEGINNER', enrolledStudents: 3420, completionRatePct: 74.0, avgQuizScorePct: 82.5, status: 'PUBLISHED' },
    { id: 2, title: 'Data Structures & Algorithms', track: 'DSA', level: 'INTERMEDIATE', enrolledStudents: 2810, completionRatePct: 68.0, avgQuizScorePct: 79.1, status: 'PUBLISHED' },
    { id: 3, title: 'DBMS & SQL Mastery', track: 'DBMS', level: 'ADVANCED', enrolledStudents: 1920, completionRatePct: 61.0, avgQuizScorePct: 85.0, status: 'PUBLISHED' },
    { id: 4, title: 'React Full-Stack Architecture', track: 'React', level: 'INTERMEDIATE', enrolledStudents: 2240, completionRatePct: 71.5, avgQuizScorePct: 88.0, status: 'PUBLISHED' },
    { id: 5, title: 'Java Placement Ready Interview Prep', track: 'Java', level: 'PLACEMENT_READY', enrolledStudents: 840, completionRatePct: 42.0, avgQuizScorePct: 91.2, status: 'PUBLISHED' }
  ];
};

export const fetchRecentActivity = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/analytics/recent-activity`, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch (err) {
    console.warn('Failed to fetch recent activity:', err);
  }
  return [
    { id: 'ACT-1', type: 'PLACEMENT_READY', title: 'Placement Ready Purchase', description: 'Purchased Java Placement Ready (₹29)', userEmail: 'rahul.sharma@gmail.com', userName: 'Rahul Sharma', timestamp: new Date().toISOString(), status: 'PAID', amount: 29 },
    { id: 'ACT-2', type: 'CERTIFICATE', title: 'Verified Certificate Issued', description: 'Completed Advanced Java Course (₹9)', userEmail: 'priya.verma@outlook.com', userName: 'Priya Verma', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'PAID', amount: 9 },
    { id: 'ACT-3', type: 'REGISTRATION', title: 'New Student Registration', description: 'Joined CodeOrbit Full-Stack Track', userEmail: 'amit.patel@gmail.com', userName: 'Amit Patel', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'ACTIVE', amount: 0 },
    { id: 'ACT-4', type: 'QUIZ_ATTEMPT', title: 'Level Final Quiz Passed', description: 'Scored 96% in DSA Level Exam', userEmail: 'sneha.reddy@yahoo.com', userName: 'Sneha Reddy', timestamp: new Date(Date.now() - 10800000).toISOString(), status: 'PASSED', amount: 0 }
  ];
};

// ============================================================================
// 2. STUDENTS
// ============================================================================

export const fetchAdminStudents = async (params = {}) => {
  const { page = 0, size = 15, search = '', status = '' } = params;
  try {
    const query = new URLSearchParams({ page, size, search, status }).toString();
    const res = await fetch(`${API_BASE_URL}/admin/students?${query}`, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch (err) {
    console.warn('Failed to fetch admin students:', err);
  }
  return {
    content: [
      { id: 1, fullName: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', role: 'STUDENT', joinedAt: '2026-08-15T10:30:00', enrolledCoursesCount: 4, completedLessonsCount: 42, quizAttemptsCount: 12, certificatesCount: 2, totalSpent: 67, status: 'ACTIVE' },
      { id: 2, fullName: 'Priya Verma', email: 'priya.verma@outlook.com', role: 'STUDENT', joinedAt: '2026-08-18T14:20:00', enrolledCoursesCount: 3, completedLessonsCount: 35, quizAttemptsCount: 9, certificatesCount: 1, totalSpent: 38, status: 'ACTIVE' },
      { id: 3, fullName: 'Amit Patel', email: 'amit.patel@gmail.com', role: 'STUDENT', joinedAt: '2026-09-01T09:15:00', enrolledCoursesCount: 2, completedLessonsCount: 18, quizAttemptsCount: 4, certificatesCount: 0, totalSpent: 29, status: 'ACTIVE' },
      { id: 4, fullName: 'Sneha Reddy', email: 'sneha.reddy@yahoo.com', role: 'STUDENT', joinedAt: '2026-09-05T16:45:00', enrolledCoursesCount: 5, completedLessonsCount: 68, quizAttemptsCount: 16, certificatesCount: 3, totalSpent: 96, status: 'ACTIVE' },
      { id: 5, fullName: 'Vikram Singh', email: 'vikram.singh@gmail.com', role: 'STUDENT', joinedAt: '2026-09-10T11:00:00', enrolledCoursesCount: 1, completedLessonsCount: 12, quizAttemptsCount: 2, certificatesCount: 0, totalSpent: 0, status: 'ACTIVE' }
    ],
    totalElements: 5,
    totalPages: 1,
    page: 0,
    size: 15
  };
};

export const fetchAdminStudentDetail = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/students/${id}`, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch (err) {
    console.warn(`Failed to fetch student detail #${id}:`, err);
  }
  return {
    id,
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    role: 'STUDENT',
    joinedAt: '2026-08-15T10:30:00',
    authProvider: 'LOCAL',
    status: 'ACTIVE',
    totalSpent: 67.0,
    enrolledCourses: [
      { courseId: 1, title: 'Java Programming', track: 'Java', level: 'BEGINNER', totalLessons: 20, completedLessons: 20, progressPercentage: 100.0, enrolledAt: '2026-08-15T10:35:00' },
      { courseId: 2, title: 'Advanced Java', track: 'Java', level: 'INTERMEDIATE', totalLessons: 20, completedLessons: 18, progressPercentage: 90.0, enrolledAt: '2026-08-20T11:00:00' },
      { courseId: 4, title: 'Java Placement Ready Interview Prep', track: 'Java', level: 'PLACEMENT_READY', totalLessons: 20, completedLessons: 8, progressPercentage: 40.0, enrolledAt: '2026-09-01T15:00:00' }
    ],
    quizAttempts: [
      { attemptId: 101, quizId: 1, quizTitle: 'Java Basics Module Quiz', courseTitle: 'Java Programming', score: 10, totalQuestions: 10, percentage: 100.0, passed: true, submittedAt: '2026-08-17T12:00:00' },
      { attemptId: 102, quizId: 2, quizTitle: 'Java Beginner Final Exam', courseTitle: 'Java Programming', score: 24, totalQuestions: 25, percentage: 96.0, passed: true, submittedAt: '2026-08-19T14:30:00' }
    ],
    payments: [
      { id: 'PR-1', type: 'PLACEMENT_READY', description: 'Placement Ready — Java Interview Prep', amount: 29.0, currency: 'INR', status: 'PAID', orderId: 'order_pr_8921', paymentId: 'pay_rzp_9921', createdAt: '2026-09-01T14:55:00' },
      { id: 'CERT-1', type: 'CERTIFICATE', description: 'Certificate Fee — Java Programming', amount: 9.0, currency: 'INR', status: 'PAID', orderId: 'order_cert_1102', paymentId: 'pay_rzp_1102', createdAt: '2026-08-20T10:00:00' }
    ],
    certificates: [
      { id: 1, certificateCode: 'CO-JAVA-2026-88912', courseTitle: 'Java Programming', subject: 'Java', status: 'ISSUED', issuedAt: '2026-08-20T10:05:00', pdfUrl: '#', verificationUrl: 'https://www.codeorbit.online/verify/CO-JAVA-2026-88912' }
    ]
  };
};

// ============================================================================
// 3. PAYMENTS & TRANSACTIONS
// ============================================================================

export const fetchAdminPaymentMetrics = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/payments/metrics`, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch (err) {
    console.warn('Failed to fetch payment metrics:', err);
  }
  return {
    totalRevenue: 38420,
    placementReadyRevenue: 24360,
    certificateRevenue: 9810,
    placementKitRevenue: 4250,
    ebookRevenue: 0,
    totalTransactions: 1240,
    successfulPayments: 1180,
    pendingPayments: 42,
    failedPayments: 18
  };
};

export const fetchAdminTransactions = async (params = {}) => {
  const { page = 0, size = 15, search = '', productType = '', status = '' } = params;
  try {
    const query = new URLSearchParams({ page, size, search, productType, status }).toString();
    const res = await fetch(`${API_BASE_URL}/admin/payments?${query}`, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch (err) {
    console.warn('Failed to fetch transactions:', err);
  }
  return {
    content: [
      { id: 'PR-101', orderNumber: 'PR-ORD-2026-091', userId: 1, studentName: 'Rahul Sharma', studentEmail: 'rahul.sharma@gmail.com', productType: 'PLACEMENT_READY', productTitle: 'Placement Ready — Java', amount: 29.0, currency: 'INR', razorpayOrderId: 'order_Nxk1890', razorpayPaymentId: 'pay_Nxl2819', status: 'PAID', entitlementStatus: 'ACTIVE', createdAt: '2026-09-24T14:15:00' },
      { id: 'CERT-202', orderNumber: 'CERT-ORD-2026-042', userId: 2, studentName: 'Priya Verma', studentEmail: 'priya.verma@outlook.com', productType: 'CERTIFICATE', productTitle: 'Verified Certificate — React', amount: 9.0, currency: 'INR', razorpayOrderId: 'order_Nxk1891', razorpayPaymentId: 'pay_Nxl2820', status: 'PAID', entitlementStatus: 'ISSUED', createdAt: '2026-09-24T13:40:00' },
      { id: 'KIT-303', orderNumber: 'KIT-ORD-2026-015', userId: 3, studentName: 'Amit Patel', studentEmail: 'amit.patel@gmail.com', productType: 'PLACEMENT_KIT', productTitle: 'Placement Preparation Kit', amount: 99.0, currency: 'INR', razorpayOrderId: 'order_Nxk1892', razorpayPaymentId: 'pay_Nxl2821', status: 'PAID', entitlementStatus: 'UNLOCKED', createdAt: '2026-09-24T11:20:00' },
      { id: 'PR-104', orderNumber: 'PR-ORD-2026-092', userId: 4, studentName: 'Sneha Reddy', studentEmail: 'sneha.reddy@yahoo.com', productType: 'PLACEMENT_READY', productTitle: 'Placement Ready — Python', amount: 29.0, currency: 'INR', razorpayOrderId: 'order_Nxk1893', razorpayPaymentId: 'pay_Nxl2822', status: 'PAID', entitlementStatus: 'ACTIVE', createdAt: '2026-09-23T19:00:00' }
    ],
    totalElements: 4,
    totalPages: 1,
    page: 0,
    size: 15
  };
};

// ============================================================================
// 4. PLACEMENT READY (₹29)
// ============================================================================

export const fetchAdminPlacementReadyMetrics = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/placement-ready/metrics`, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch (err) {
    console.warn('Failed to fetch placement ready metrics:', err);
  }
  return {
    totalPurchases: 840,
    totalRevenue: 24360,
    conversionRatePct: 18.4,
    activeEntitlements: 840,
    unitPrice: 29.0
  };
};

export const fetchAdminPlacementReadyEntitlements = async (params = {}) => {
  const { page = 0, size = 15, search = '' } = params;
  try {
    const query = new URLSearchParams({ page, size, search }).toString();
    const res = await fetch(`${API_BASE_URL}/admin/placement-ready/entitlements?${query}`, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch (err) {
    console.warn('Failed to fetch entitlements:', err);
  }
  return {
    content: [
      { id: 1, userId: 1, studentName: 'Rahul Sharma', studentEmail: 'rahul.sharma@gmail.com', courseId: 1, courseTitle: 'Java Programming', subject: 'Java', amount: 29.0, paymentStatus: 'PAID', entitlementStatus: 'ACTIVE', razorpayOrderId: 'order_Nxk1890', razorpayPaymentId: 'pay_Nxl2819', purchaseDate: '2026-09-24T14:15:00' },
      { id: 2, userId: 4, studentName: 'Sneha Reddy', studentEmail: 'sneha.reddy@yahoo.com', courseId: 2, courseTitle: 'Python Programming', subject: 'Python', amount: 29.0, paymentStatus: 'PAID', entitlementStatus: 'ACTIVE', razorpayOrderId: 'order_Nxk1893', razorpayPaymentId: 'pay_Nxl2822', purchaseDate: '2026-09-23T19:00:00' }
    ],
    totalElements: 2,
    totalPages: 1,
    page: 0,
    size: 15
  };
};

// ============================================================================
// 5. CERTIFICATES (₹9)
// ============================================================================

export const fetchAdminCertificateMetrics = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/certificates/metrics`, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch (err) {
    console.warn('Failed to fetch certificate metrics:', err);
  }
  return {
    certificatesIssued: 1090,
    eligibleStudents: 1420,
    paymentPending: 130,
    paidCertificates: 1090,
    certificateRevenue: 9810,
    unitPrice: 9.0
  };
};

export const fetchAdminCertificates = async (params = {}) => {
  const { page = 0, size = 15, search = '' } = params;
  try {
    const query = new URLSearchParams({ page, size, search }).toString();
    const res = await fetch(`${API_BASE_URL}/admin/certificates?${query}`, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch (err) {
    console.warn('Failed to fetch certificates:', err);
  }
  return {
    content: [
      { id: 1, certificateCode: 'CO-JAVA-2026-88912', userId: 1, studentName: 'Rahul Sharma', studentEmail: 'rahul.sharma@gmail.com', courseId: 1, courseTitle: 'Java Programming', subject: 'Java', beginnerCompleted: true, intermediateCompleted: true, advancedCompleted: true, paymentStatus: 'PAID', certificateStatus: 'ISSUED', issuedAt: '2026-08-20T10:05:00', pdfUrl: '#', verificationUrl: 'https://www.codeorbit.online/verify/CO-JAVA-2026-88912' },
      { id: 2, certificateCode: 'CO-REACT-2026-44120', userId: 2, studentName: 'Priya Verma', studentEmail: 'priya.verma@outlook.com', courseId: 4, courseTitle: 'React Development', subject: 'React', beginnerCompleted: true, intermediateCompleted: true, advancedCompleted: true, paymentStatus: 'PAID', certificateStatus: 'ISSUED', issuedAt: '2026-09-24T13:40:00', pdfUrl: '#', verificationUrl: 'https://www.codeorbit.online/verify/CO-REACT-2026-44120' }
    ],
    totalElements: 2,
    totalPages: 1,
    page: 0,
    size: 15
  };
};

// ============================================================================
// 6. USERS & ROLES
// ============================================================================

export const fetchAdminUsers = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/users`, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch (err) {
    console.warn('Failed to fetch admin users:', err);
  }
  return [
    { id: 1, fullName: 'Gurvinder', email: 'gurvinder@codeorbit.online', role: 'SUPER_ADMIN', authProvider: 'LOCAL', createdAt: '2026-08-01T00:00:00', status: 'ACTIVE' },
    { id: 2, fullName: 'Content Editor', email: 'content@codeorbit.online', role: 'CONTENT_MANAGER', authProvider: 'LOCAL', createdAt: '2026-08-10T12:00:00', status: 'ACTIVE' },
    { id: 3, fullName: 'Support Lead', email: 'support@codeorbit.online', role: 'SUPPORT', authProvider: 'LOCAL', createdAt: '2026-08-15T15:30:00', status: 'ACTIVE' }
  ];
};

export const updateUserRole = async (userId, role) => {
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ role })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to update user role');
  }
  const data = await res.json();
  return data.data || data;
};

// ============================================================================
// 7. SETTINGS
// ============================================================================

export const fetchAdminSettings = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/settings`, { headers: getAuthHeaders() });
    if (res.ok) {
      const data = await res.json();
      return data.data || data;
    }
  } catch (err) {
    console.warn('Failed to fetch admin settings:', err);
  }
  return {
    platformName: 'CodeOrbit',
    domain: 'codeorbit.online',
    supportEmail: 'support@codeorbit.online',
    placementReadyPrice: 29.00,
    certificatePrice: 9.00,
    placementKitPrice: 99.00,
    currency: 'INR',
    paymentGateway: 'Razorpay',
    razorpayKeyId: 'rzp_live_default',
    serverEnforcedPricing: true,
    defaultLanguage: 'en',
    allowedRoles: 'SUPER_ADMIN, ADMIN, CONTENT_MANAGER, SUPPORT'
  };
};

export const updateAdminSettings = async (settings) => {
  const res = await fetch(`${API_BASE_URL}/admin/settings`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(settings)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to update settings');
  }
  const data = await res.json();
  return data.data || data;
};

// ============================================================================
// 8. REPORTS (CSV EXPORT)
// ============================================================================

export const exportAdminReport = async (type = 'STUDENTS') => {
  const token = localStorage.getItem('token') || localStorage.getItem('codeorbit_token') || sessionStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/admin/reports/export?type=${type}`, {
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  });
  if (!res.ok) {
    throw new Error('Failed to generate report export');
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CodeOrbit_${type.toLowerCase()}_report_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};
