import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle, 
  Eye, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Info, 
  LogOut, 
  ShoppingBag, 
  PlusCircle, 
  FileText, 
  DollarSign, 
  Trash2, 
  Lock, 
  Layers, 
  Sparkles, 
  ToggleLeft, 
  ToggleRight,
  Search,
  Filter,
  Edit3,
  Upload,
  AlertTriangle,
  CheckCircle2,
  X,
  FileCheck,
  Server,
  RefreshCw,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { CATEGORIES } from '../data/ebooksData';
import { PdfPreviewModal } from '../components/PdfPreviewModal';
import { adminApi } from '../services/adminApi';
import { AdminCurriculumManager } from '../components/admin/AdminCurriculumManager';

export const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const { allEbooks, submitNewEbook, updateEbookStatus } = useLibrary();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('manage-ebooks'); // 'overview' | 'manage-ebooks' | 'orders' | 'students'
  const [storeEbooks, setStoreEbooks] = useState(allEbooks || []);
  const [previewEbook, setPreviewEbook] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [apiSource, setApiSource] = useState('INITIALIZING');

  // Real Database Metrics State
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalEbooks: 0,
    publishedEbooks: 0,
    unpublishedEbooks: 0,
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    failedOrders: 0,
    totalRevenue: 0,
    totalStudents: 0
  });
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState(null);

  // Real Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [ordersSearch, setOrdersSearch] = useState('');
  const [ordersStatus, setOrdersStatus] = useState('ALL');
  const [ordersPage, setOrdersPage] = useState(0);
  const [ordersTotalPages, setOrdersTotalPages] = useState(0);
  const [ordersTotalElements, setOrdersTotalElements] = useState(0);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Search & Filter state for E-book management table
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'published' | 'draft'

  // Modal State (Add or Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('ADD'); // 'ADD' | 'EDIT'
  const [editingBookId, setEditingBookId] = useState(null);

  // Form State
  const initialFormState = {
    title: '',
    author: 'CodeOrbit Editorial Team',
    authorTitle: 'Senior Engineering Board',
    category: 'java',
    categoryName: 'Core Java',
    price: 199,
    originalPrice: 499,
    pages: 250,
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    pdfStoragePath: 'storage/private/pdfs/sample-guide.pdf',
    shortDescription: '',
    description: '',
    format: 'PDF • Printable Notes',
    level: 'Beginner to Intermediate',
    active: true
  };

  const [formData, setFormData] = useState(initialFormState);
  const [selectedPdfFile, setSelectedPdfFile] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [studentsList] = useState([
    { id: 's1', name: 'Aman Sharma', email: 'aman.student@codeorbit.dev', college: 'NIT Trichy', purchases: 2, joined: '14 Jan 2026' },
    { id: 's2', name: 'Riya Sen', email: 'riya.sen@college.edu', college: 'DTU Delhi', purchases: 3, joined: '10 Feb 2026' },
    { id: 's3', name: 'Kartik Iyer', email: 'kartik.iyer@university.edu', college: 'BITS Pilani', purchases: 1, joined: '01 Mar 2026' },
    { id: 's4', name: 'Sneha Patel', email: 'sneha.patel@engineering.edu', college: 'VJTI Mumbai', purchases: 4, joined: '18 Dec 2025' }
  ]);

  // Load metrics from backend
  const fetchMetrics = async () => {
    setMetricsLoading(true);
    setMetricsError(null);
    const res = await adminApi.getMetrics();
    if (res.success && res.data) {
      setDashboardMetrics(res.data);
    } else {
      setMetricsError(res.message || 'Failed to load store metrics');
    }
    setMetricsLoading(false);
  };

  // Load orders with filters from backend
  const fetchOrders = async (page = ordersPage, search = ordersSearch, status = ordersStatus) => {
    setOrdersLoading(true);
    setOrdersError(null);
    const res = await adminApi.getOrders({
      page,
      size: 10,
      search,
      status: status === 'ALL' ? '' : status
    });
    if (res.success && res.data) {
      setOrders(res.data);
      setOrdersTotalElements(res.totalElements || 0);
      setOrdersTotalPages(res.totalPages || 0);
      setOrdersPage(res.page || 0);
    } else {
      setOrdersError(res.message || 'Failed to load orders from server');
      setOrders([]);
    }
    setOrdersLoading(false);
  };

  // Load e-books and metrics on mount
  useEffect(() => {
    async function loadData() {
      const res = await adminApi.getEbooks({}, storeEbooks);
      if (res.source === 'BACKEND' && Array.isArray(res.data) && res.data.length > 0) {
        setStoreEbooks(res.data);
        setApiSource('BACKEND (Connected: API Server)');
      } else {
        setApiSource('LOCAL STORE (Offline Dev Mode)');
      }
      fetchMetrics();
    }
    loadData();
  }, []);

  // Fetch orders when orders tab becomes active or on filter changes
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders(ordersPage, ordersSearch, ordersStatus);
    }
    if (activeTab === 'overview') {
      fetchMetrics();
    }
  }, [activeTab, ordersPage, ordersStatus]);

  const handleSearchOrders = (e) => {
    e.preventDefault();
    setOrdersPage(0);
    fetchOrders(0, ordersSearch, ordersStatus);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Live Metrics summary
  const metrics = useMemo(() => {
    const total = dashboardMetrics.totalEbooks || storeEbooks.length;
    const published = dashboardMetrics.publishedEbooks || storeEbooks.filter(b => b.active !== false && b.status !== 'UNPUBLISHED').length;
    const unpublished = dashboardMetrics.unpublishedEbooks !== undefined ? dashboardMetrics.unpublishedEbooks : (total - published);
    const totalOrders = dashboardMetrics.totalOrders;
    const paidOrders = dashboardMetrics.paidOrders;
    const pendingOrders = dashboardMetrics.pendingOrders;
    const failedOrders = dashboardMetrics.failedOrders;
    const totalRevenue = dashboardMetrics.totalRevenue || 0;
    const totalStudents = dashboardMetrics.totalStudents || 0;

    return { total, published, unpublished, totalOrders, paidOrders, pendingOrders, failedOrders, totalRevenue, totalStudents };
  }, [dashboardMetrics, storeEbooks]);

  // Filtered E-books list for management table
  const filteredEbooks = useMemo(() => {
    return storeEbooks.filter(book => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = book.title?.toLowerCase().includes(q);
        const matchAuthor = book.author?.toLowerCase().includes(q);
        const matchCat = book.categoryName?.toLowerCase().includes(q);
        if (!matchTitle && !matchAuthor && !matchCat) return false;
      }

      // Category
      if (filterCategory !== 'all' && book.category !== filterCategory) {
        return false;
      }

      // Status
      const isPublished = book.active !== false && book.status !== 'UNPUBLISHED';
      if (filterStatus === 'published' && !isPublished) return false;
      if (filterStatus === 'draft' && isPublished) return false;

      return true;
    });
  }, [storeEbooks, searchQuery, filterCategory, filterStatus]);

  // Open Add Modal
  const openAddModal = () => {
    setModalMode('ADD');
    setEditingBookId(null);
    setFormData(initialFormState);
    setSelectedPdfFile(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (book) => {
    setModalMode('EDIT');
    setEditingBookId(book.id);
    setFormData({
      title: book.title || '',
      author: book.author || 'CodeOrbit Editorial Team',
      authorTitle: book.authorTitle || 'Senior Engineering Board',
      category: book.category || 'java',
      categoryName: book.categoryName || 'Core Java',
      price: book.price || 199,
      originalPrice: book.originalPrice || 499,
      pages: book.pages || book.pageCount || 200,
      coverImage: book.coverImage || book.coverImageUrl || '',
      pdfStoragePath: book.pdfStoragePath || book.pdfStorageKey || 'storage/private/pdfs/handbook.pdf',
      shortDescription: book.shortDescription || book.description || '',
      description: book.description || '',
      format: book.format || 'PDF • Printable Notes',
      level: book.level || 'Beginner to Intermediate',
      active: book.active !== false && book.status !== 'UNPUBLISHED'
    });
    setSelectedPdfFile(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.author.trim()) errors.author = 'Author name is required';
    if (!formData.category) errors.category = 'Category selection is required';
    if (formData.price === '' || isNaN(formData.price) || Number(formData.price) < 0) {
      errors.price = 'Price must be a valid non-negative number (>= ₹0)';
    }
    if (!formData.pages || isNaN(formData.pages) || Number(formData.pages) < 1) {
      errors.pages = 'Page count must be at least 1';
    }
    if (selectedPdfFile && !selectedPdfFile.name.toLowerCase().endsWith('.pdf')) {
      errors.pdf = 'Only PDF (.pdf) files are supported';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Save (Add or Update)
  const handleSaveEbook = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const catObj = CATEGORIES.find(c => c.id === formData.category) || CATEGORIES[1];

    if (modalMode === 'ADD') {
      const newBook = {
        ...formData,
        id: 'ebook-' + Date.now(),
        categoryName: catObj.name,
        rating: 5.0,
        reviewCount: 0,
        isBestseller: false,
        isFeatured: false,
        active: formData.active,
        status: formData.active ? 'APPROVED' : 'UNPUBLISHED',
        pdfStoragePath: selectedPdfFile 
          ? `storage/private/pdfs/${Date.now()}_${selectedPdfFile.name}`
          : formData.pdfStoragePath,
        lastUpdated: 'Just now'
      };

      // Try Backend POST
      await adminApi.createEbook({
        title: newBook.title,
        authorName: newBook.author,
        category: newBook.category,
        description: newBook.description || newBook.shortDescription,
        price: Number(newBook.price),
        pageCount: Number(newBook.pages),
        coverImageUrl: newBook.coverImage,
        active: newBook.active,
        pdfFileName: selectedPdfFile?.name || 'sample.pdf',
        pdfStorageKey: newBook.pdfStoragePath
      });

      // Update Local State & Context
      setStoreEbooks(prev => [newBook, ...prev]);
      submitNewEbook(newBook);

      setFeedbackMessage(`E-book "${newBook.title}" added and ${newBook.active ? 'Published' : 'Saved as Draft'} successfully.`);
    } else {
      // EDIT MODE
      const updatedBook = {
        ...formData,
        id: editingBookId,
        categoryName: catObj.name,
        active: formData.active,
        status: formData.active ? 'APPROVED' : 'UNPUBLISHED',
        pdfStoragePath: selectedPdfFile 
          ? `storage/private/pdfs/${Date.now()}_${selectedPdfFile.name}`
          : formData.pdfStoragePath,
        lastUpdated: 'Updated just now'
      };

      await adminApi.updateEbook(editingBookId, {
        title: updatedBook.title,
        authorName: updatedBook.author,
        category: updatedBook.category,
        description: updatedBook.description || updatedBook.shortDescription,
        price: Number(updatedBook.price),
        pageCount: Number(updatedBook.pages),
        coverImageUrl: updatedBook.coverImage,
        active: updatedBook.active,
        pdfFileName: selectedPdfFile?.name,
        pdfStorageKey: updatedBook.pdfStoragePath
      });

      setStoreEbooks(prev => prev.map(b => b.id === editingBookId ? { ...b, ...updatedBook } : b));
      setFeedbackMessage(`E-book "${updatedBook.title}" updated successfully.`);
    }

    setIsModalOpen(false);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Toggle Publish / Unpublish
  const handleTogglePublish = async (id) => {
    const book = storeEbooks.find(b => b.id === id);
    if (!book) return;

    const newActiveState = !(book.active !== false && book.status !== 'UNPUBLISHED');

    await adminApi.toggleStatus(id, newActiveState);

    setStoreEbooks(prev => prev.map(b => {
      if (b.id === id) {
        return {
          ...b,
          active: newActiveState,
          status: newActiveState ? 'APPROVED' : 'UNPUBLISHED'
        };
      }
      return b;
    }));

    updateEbookStatus(id, newActiveState ? 'APPROVED' : 'UNPUBLISHED');

    setFeedbackMessage(`E-book "${book.title}" is now ${newActiveState ? 'Published' : 'Draft (Unpublished)'}.`);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Delete E-book
  const handleDeleteEbook = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently remove "${title}" from the store catalog?`)) {
      await adminApi.deleteEbook(id);
      setStoreEbooks(prev => prev.filter(b => b.id !== id));
      setFeedbackMessage(`E-book "${title}" has been deleted.`);
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-[#0b132b] border border-purple-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-inner">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-semibold text-purple-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Store Owner & Admin Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Store Management Console
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage e-book catalog, upload master PDFs, set pricing, and oversee student purchases.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New E-Book</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Backend / Dev Sync Status Badge */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-sky-400" />
          <span>API Connection: <strong className="text-slate-200">{apiSource}</strong></span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">Single-Owner Architecture v1.0</span>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2 text-xs font-semibold overflow-x-auto pb-1">
        {[
          { id: 'curriculum', label: 'Curriculum & Tracks (Courses/Lessons/Quizzes)', count: null },
          { id: 'manage-ebooks', label: 'E-Book Management', count: storeEbooks.length },
          { id: 'overview', label: 'Store Overview & Metrics', count: null },
          { id: 'orders', label: 'Student Orders & PDF Licenses', count: metrics.totalOrders },
          { id: 'students', label: 'Registered Students', count: metrics.totalStudents || studentsList.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-3 transition-colors relative flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-white border-b-2 border-brand-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 0: CURRICULUM & COURSE TRACKS MANAGEMENT */}
      {activeTab === 'curriculum' && (
        <AdminCurriculumManager />
      )}

      {/* TAB 1: E-BOOK MANAGEMENT */}
      {activeTab === 'manage-ebooks' && (
        <div className="space-y-6">
          {/* Overview Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total E-Books</span>
                <BookOpen className="w-4 h-4 text-brand-400" />
              </div>
              <p className="text-2xl font-extrabold text-white">{metrics.total}</p>
              <p className="text-[11px] text-slate-400">In Store Catalog</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Published E-Books</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-extrabold text-emerald-400">{metrics.published}</p>
              <p className="text-[11px] text-slate-400">Live for Students</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Drafts / Unpublished</span>
                <Lock className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-extrabold text-amber-400">{metrics.unpublished}</p>
              <p className="text-[11px] text-slate-400">Hidden from Catalog</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-extrabold text-purple-400">{metrics.totalOrders}</p>
              <p className="text-[11px] text-slate-400">{metrics.paidOrders} Paid • ₹{Number(metrics.totalRevenue).toLocaleString()}</p>
            </div>
          </div>

          {/* Search, Filter & Action Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by title, author, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published Only</option>
                <option value="draft">Drafts Only</option>
              </select>
            </div>

            <button
              onClick={openAddModal}
              className="w-full md:w-auto px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add E-Book</span>
            </button>
          </div>

          {/* E-books Management Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">E-Book & Author</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price (INR)</th>
                    <th className="p-4">Pages</th>
                    <th className="p-4">PDF Storage</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredEbooks.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-slate-400">
                        No e-books match your filter. Click "Add E-Book" to create one.
                      </td>
                    </tr>
                  ) : (
                    filteredEbooks.map((book) => {
                      const isPublished = book.active !== false && book.status !== 'UNPUBLISHED';
                      return (
                        <tr key={book.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={book.coverImage || book.coverImageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&auto=format&fit=crop&q=80'}
                                alt={book.title}
                                className="w-10 h-13 rounded-lg object-cover border border-slate-700/80 flex-shrink-0"
                              />
                              <div className="min-w-0 max-w-xs">
                                <p className="font-bold text-white truncate">{book.title}</p>
                                <p className="text-[11px] text-slate-400 truncate">{book.author || book.authorName}</p>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-900 border border-slate-700 text-sky-300">
                              {book.categoryName || book.category}
                            </span>
                          </td>

                          <td className="p-4 font-mono font-bold text-slate-100">
                            ₹{book.price}
                          </td>

                          <td className="p-4 font-mono text-slate-400">
                            {book.pages || book.pageCount || 200}
                          </td>

                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                              <FileCheck className="w-3 h-3" />
                              Private PDF Linked
                            </span>
                          </td>

                          <td className="p-4">
                            <button
                              onClick={() => handleTogglePublish(book.id)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all"
                              title="Click to toggle status"
                            >
                              {isPublished ? (
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-emerald-500/20">
                                  <ToggleRight className="w-4 h-4" /> Published
                                </span>
                              ) : (
                                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-amber-500/20">
                                  <ToggleLeft className="w-4 h-4" /> Draft / Hidden
                                </span>
                              )}
                            </button>
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setPreviewEbook(book)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                title="Preview sample"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditModal(book)}
                                className="p-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-sky-400 hover:text-sky-300 border border-brand-500/30 transition-colors"
                                title="Edit e-book details"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteEbook(book.id, book.title)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 transition-colors"
                                title="Delete e-book"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STORE OVERVIEW & METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Live Store Analytics & Revenue (Database Ground Truth)
            </h2>
            <button
              onClick={fetchMetrics}
              disabled={metricsLoading}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${metricsLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
          </div>

          {metricsError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{metricsError}</span>
              </div>
              <button onClick={fetchMetrics} className="underline font-bold hover:text-white">Retry</button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Total Revenue (PAID Only)</span>
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-3xl font-extrabold text-emerald-400 font-mono">
                ₹{Number(metrics.totalRevenue).toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400">Excludes pending & failed orders</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Paid Orders</span>
                <CheckCircle className="w-5 h-5 text-sky-400" />
              </div>
              <p className="text-3xl font-extrabold text-sky-400 font-mono">
                {metrics.paidOrders}
              </p>
              <p className="text-[11px] text-slate-400">Out of {metrics.totalOrders} total initiated</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Pending / Failed</span>
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-3xl font-extrabold text-amber-400 font-mono">
                {metrics.pendingOrders} / {metrics.failedOrders}
              </p>
              <p className="text-[11px] text-slate-400">Awaiting or incomplete payments</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Registered Students</span>
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-3xl font-extrabold text-purple-400 font-mono">
                {metrics.totalStudents}
              </p>
              <p className="text-[11px] text-slate-400">Enrolled student accounts in DB</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              Single-Owner Business Model Notice
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              CodeOrbit is configured as a single-owner digital bookstore. All intellectual property, e-books, and curated notes are managed exclusively by the website administrator. Master PDF files are stored on secure private storage and never exposed as public URLs.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT ORDERS & DRM LICENSES */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Order Search & Status Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <form onSubmit={handleSearchOrders} className="flex flex-1 items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by Order #, student name, or email..."
                  value={ordersSearch}
                  onChange={(e) => setOrdersSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                />
              </div>

              <select
                value={ordersStatus}
                onChange={(e) => {
                  setOrdersStatus(e.target.value);
                  setOrdersPage(0);
                  fetchOrders(0, ordersSearch, e.target.value);
                }}
                className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="PAID">PAID Only</option>
                <option value="PENDING">PENDING Only</option>
                <option value="FAILED">FAILED Only</option>
              </select>

              <button
                type="submit"
                className="px-3 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all"
              >
                Filter
              </button>
            </form>

            <button
              onClick={() => fetchOrders(ordersPage, ordersSearch, ordersStatus)}
              disabled={ordersLoading}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${ordersLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Orders</span>
            </button>
          </div>

          {ordersError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{ordersError}</span>
              </div>
              <button onClick={() => fetchOrders(ordersPage, ordersSearch, ordersStatus)} className="underline font-bold hover:text-white">Retry</button>
            </div>
          )}

          {/* Orders Table */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Student Orders & Verified PDF Licenses ({ordersTotalElements} total)
              </h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                Real-Time Database Feed
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/40 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                  <tr>
                    <th className="p-4">Order Number & Date</th>
                    <th className="p-4">Student Details</th>
                    <th className="p-4">Purchased E-Books</th>
                    <th className="p-4">Total (INR)</th>
                    <th className="p-4">Payment Ref / Gateway ID</th>
                    <th className="p-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {ordersLoading ? (
                    <tr>
                      <td colSpan="7" className="p-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <RefreshCw className="w-6 h-6 text-brand-400 animate-spin" />
                          <p className="text-xs font-semibold">Loading orders from database...</p>
                        </div>
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-12 text-center text-slate-400">
                        <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <p className="font-bold text-slate-300">No student orders found</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {ordersSearch || ordersStatus !== 'ALL' ? 'Try adjusting your search query or status filter.' : 'When students complete checkout, their orders will appear here in real time.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    orders.map((ord) => {
                      const isPaid = ord.status === 'PAID';
                      const isPending = ord.status === 'PENDING';
                      return (
                        <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4">
                            <p className="font-mono font-bold text-sky-400">{ord.orderNumber}</p>
                            <p className="text-[11px] text-slate-400">
                              {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                            </p>
                          </td>

                          <td className="p-4">
                            <p className="text-white font-semibold">{ord.studentName || 'Student'}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{ord.studentEmail}</p>
                          </td>

                          <td className="p-4">
                            {ord.items && ord.items.length > 0 ? (
                              <div className="space-y-1 max-w-xs">
                                {ord.items.map((it, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 text-slate-200 truncate">
                                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" />
                                    <span className="truncate text-xs">{it.ebookTitle}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">₹{it.price}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-500 italic">{ord.itemCount} item(s)</span>
                            )}
                          </td>

                          <td className="p-4 font-mono font-bold text-white text-sm">
                            ₹{ord.totalAmount}
                          </td>

                          <td className="p-4">
                            {isPaid ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                                <CheckCircle className="w-3 h-3" /> PAID
                              </span>
                            ) : isPending ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
                                <Clock className="w-3 h-3" /> PENDING
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-full">
                                <AlertCircle className="w-3 h-3" /> {ord.status}
                              </span>
                            )}
                          </td>

                          <td className="p-4 font-mono text-[11px] text-slate-400">
                            {ord.cashfreePaymentId || ord.cashfreeOrderId || ord.razorpayPaymentId || ord.razorpayOrderId || <span className="text-slate-600">—</span>}
                          </td>

                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedOrderDetails(ord)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            {ordersTotalPages > 1 && (
              <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
                <span>Page <strong>{ordersPage + 1}</strong> of <strong>{ordersTotalPages}</strong> ({ordersTotalElements} total orders)</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (ordersPage > 0) {
                        setOrdersPage(prev => prev - 1);
                        fetchOrders(ordersPage - 1, ordersSearch, ordersStatus);
                      }
                    }}
                    disabled={ordersPage === 0}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (ordersPage < ordersTotalPages - 1) {
                        setOrdersPage(prev => prev + 1);
                        fetchOrders(ordersPage + 1, ordersSearch, ordersStatus);
                      }
                    }}
                    disabled={ordersPage >= ordersTotalPages - 1}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0b132b] border border-slate-700/80 rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Order Breakdown</h3>
                <p className="text-xs font-mono text-sky-400">{selectedOrderDetails.orderNumber}</p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Student</span>
                <span className="text-white font-semibold">{selectedOrderDetails.studentName} ({selectedOrderDetails.studentEmail})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Payment Status</span>
                <span className={`font-bold ${selectedOrderDetails.status === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedOrderDetails.status}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Cashfree / Gateway Payment ID</span>
                <span className="font-mono text-slate-300">{selectedOrderDetails.cashfreePaymentId || selectedOrderDetails.razorpayPaymentId || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Placed On</span>
                <span className="text-slate-300">{selectedOrderDetails.createdAt ? new Date(selectedOrderDetails.createdAt).toLocaleString() : 'N/A'}</span>
              </div>
              {selectedOrderDetails.paidAt && (
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Paid On</span>
                  <span className="text-slate-300">{new Date(selectedOrderDetails.paidAt).toLocaleString()}</span>
                </div>
              )}

              <div className="pt-2">
                <p className="font-semibold text-slate-300 mb-2">Order Items:</p>
                <div className="space-y-2">
                  {selectedOrderDetails.items?.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-white text-xs">{item.ebookTitle}</p>
                        <p className="text-[11px] text-slate-400">by {item.authorName} • {item.category}</p>
                      </div>
                      <span className="font-mono font-bold text-slate-100">₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-3 border-t border-slate-800 text-sm font-bold">
                <span className="text-slate-300">Total Paid Amount:</span>
                <span className="text-emerald-400 font-mono">₹{selectedOrderDetails.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REGISTERED STUDENTS */}
      {activeTab === 'students' && (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 bg-slate-950/80">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Enrolled Engineering Students Directory
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/40 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">College / University</th>
                  <th className="p-4">Purchased Titles</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {studentsList.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-white">{st.name}</p>
                      <p className="text-[11px] text-slate-400">{st.email}</p>
                    </td>
                    <td className="p-4 text-slate-300">{st.college}</td>
                    <td className="p-4 font-mono text-sky-400 font-bold">{st.purchases} e-books</td>
                    <td className="p-4 text-slate-400">{st.joined}</td>
                    <td className="p-4">
                      <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                        Active Student
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD / EDIT E-BOOK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0b132b] border border-slate-700/80 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-sky-400">
                  {modalMode === 'ADD' ? <PlusCircle className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {modalMode === 'ADD' ? 'Add New E-Book to Store' : 'Edit E-Book Details'}
                  </h3>
                  <p className="text-xs text-slate-400">Fill in metadata and link the master PDF document.</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveEbook} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  E-Book Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Core Java 21 & Concurrency Master Handbook"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />
                {formErrors.title && <p className="text-rose-400 text-[11px] mt-1">{formErrors.title}</p>}
              </div>

              {/* Author & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Author / Editorial Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Prof. Aditya Sharma"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                  {formErrors.author && <p className="text-rose-400 text-[11px] mt-1">{formErrors.author}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Engineering Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-brand-500"
                  >
                    {CATEGORIES.slice(1).map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Pages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Price in INR (₹) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="199"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
                  />
                  {formErrors.price && <p className="text-rose-400 text-[11px] mt-1">{formErrors.price}</p>}
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Total Page Count <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="250"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"
                  />
                  {formErrors.pages && <p className="text-rose-400 text-[11px] mt-1">{formErrors.pages}</p>}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Handbook Overview & Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Detailed syllabus, code highlights, and target university exams..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 leading-relaxed"
                />
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono text-[11px]"
                />
              </div>

              {/* PDF File Upload */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 space-y-2">
                <label className="block font-semibold text-slate-200">
                  Master PDF Document (Private Storage)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => setSelectedPdfFile(e.target.files?.[0] || null)}
                    className="text-xs text-slate-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-600 file:text-white hover:file:bg-brand-500 cursor-pointer"
                  />
                </div>
                {selectedPdfFile && (
                  <p className="text-emerald-400 text-[11px] flex items-center gap-1 font-mono">
                    <FileCheck className="w-3.5 h-3.5" />
                    Selected: {selectedPdfFile.name} ({(selectedPdfFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}
                {formErrors.pdf && <p className="text-rose-400 text-[11px]">{formErrors.pdf}</p>}
                <p className="text-[10px] text-slate-400">
                  🔒 Kept in private backend storage. Maximum allowed size: 50 MB.
                </p>
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <p className="font-semibold text-white">Publish to Store Immediately</p>
                  <p className="text-[11px] text-slate-400">If unchecked, it will be saved as an unlisted draft.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 accent-brand-500 rounded cursor-pointer"
                />
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white text-xs font-bold shadow-lg shadow-brand-500/20 transition-all"
                >
                  {modalMode === 'ADD' ? 'Create & Publish E-Book' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Sample Preview Modal */}
      <PdfPreviewModal
        ebook={previewEbook}
        isOpen={Boolean(previewEbook)}
        onClose={() => setPreviewEbook(null)}
      />
    </div>
  );
};
