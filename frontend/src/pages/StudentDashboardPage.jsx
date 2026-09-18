import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookmarkCheck, 
  BookOpen, 
  ShoppingBag, 
  Bookmark, 
  User, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Download,
  Eye,
  Info,
  Layers,
  GraduationCap,
  Loader2,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { catalogApi } from '../services/catalogApi';
import { paymentApi } from '../services/paymentApi';
import { PdfPreviewModal } from '../components/PdfPreviewModal';

export const StudentDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'orders' | 'saved' | 'profile'
  const [previewEbook, setPreviewEbook] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [libraryBooks, setLibraryBooks] = useState([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [savedBooks, setSavedBooks] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState(null);
  const [downloadErrorMessage, setDownloadErrorMessage] = useState(null);

  React.useEffect(() => {
    async function loadData() {
      setLoadingOrders(true);
      setLoadingLibrary(true);
      try {
        const [ordersData, libraryData, catalogData] = await Promise.allSettled([
          paymentApi.getStudentOrders(),
          paymentApi.getStudentLibrary(),
          catalogApi.getEbooks()
        ]);
        if (ordersData.status === 'fulfilled') {
          setOrders(ordersData.value || []);
        }
        if (libraryData.status === 'fulfilled') {
          setLibraryBooks(libraryData.value || []);
        }
        if (catalogData.status === 'fulfilled' && catalogData.value?.data) {
          const userSavedIds = user?.savedEbookIds || [];
          const matchedSaved = catalogData.value.data.filter(b => userSavedIds.includes(b.id));
          setSavedBooks(matchedSaved);
        }
      } catch (err) {
        console.error('Failed to load student dashboard data', err);
      } finally {
        setLoadingOrders(false);
        setLoadingLibrary(false);
      }
    }
    loadData();
  }, [user]);

  const handleDownloadPdf = async (book) => {
    setDownloadingId(book.id);
    setDownloadSuccessMessage(null);
    setDownloadErrorMessage(null);
    try {
      const res = await paymentApi.downloadEbookPdf(book.id, book.title);
      setDownloadSuccessMessage({
        bookTitle: book.title,
        filename: res.filename
      });
    } catch (err) {
      setDownloadErrorMessage(err.message || 'Failed to download PDF. Please verify your purchase status.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Paid
          </span>
        );
      case 'PENDING':
        return (
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <Clock className="w-3 h-3" /> Payment Pending
          </span>
        );
      case 'FAILED':
        return (
          <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            Payment Failed
          </span>
        );
      default:
        return (
          <span className="bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            {status || 'Unknown'}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-950/40 via-slate-900 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/40"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-semibold text-sky-300">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Welcome back, {user?.name || 'Aman Sharma'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {user?.college || 'National Institute of Technology'} • {user?.branch || 'CSE'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/catalog"
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explore Catalog</span>
          </Link>
          <button
            onClick={handleLogout}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('library')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'library'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <BookmarkCheck className="w-4 h-4 text-sky-300" />
          <span>My Library ({libraryBooks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-sky-300" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'saved'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Bookmark className="w-4 h-4 text-sky-300" />
          <span>Saved E-books ({savedBooks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <User className="w-4 h-4 text-sky-300" />
          <span>Student Profile</span>
        </button>
      </div>

      {/* TAB 1: MY LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Unlocked Handbooks & Notes</h2>
              <p className="text-xs text-slate-400">Direct digital study access for purchased engineering resources</p>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-semibold">
              {libraryBooks.length} Purchased E-Book{libraryBooks.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Download Success Banner */}
          {downloadSuccessMessage && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-3">
                <FileCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">PDF Download Started: {downloadSuccessMessage.bookTitle}</p>
                  <p className="text-[11px] text-emerald-300">
                    Saved file: <code className="text-white font-mono">{downloadSuccessMessage.filename}</code>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDownloadSuccessMessage(null)}
                className="text-emerald-400 hover:text-white px-2 py-1 rounded font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Download Error Banner */}
          {downloadErrorMessage && (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-xs text-rose-200 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">Download Failed</p>
                  <p className="text-[11px] text-rose-300">{downloadErrorMessage}</p>
                </div>
              </div>
              <button
                onClick={() => setDownloadErrorMessage(null)}
                className="text-rose-400 hover:text-white px-2 py-1 rounded font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Secure PDF Storage & Delivery Notice */}
          <div className="p-4 rounded-2xl bg-brand-950/40 border border-brand-500/20 flex items-start gap-3 text-xs text-brand-200">
            <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-white">Protected Digital Delivery:</strong> Master PDF files are securely loaded from private server storage on demand. Download authorization is strictly verified against your completed orders.
            </span>
          </div>

          {loadingLibrary ? (
            <div className="p-12 text-center space-y-3 bg-slate-900/40 border border-slate-800 rounded-3xl">
              <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading your purchased e-books library...</p>
            </div>
          ) : libraryBooks.length === 0 ? (
            <div className="p-12 text-center space-y-4 bg-slate-900/30 border border-slate-800 rounded-3xl">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Your library is currently empty</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You haven't purchased any e-books yet. Explore our technical catalog to get lifetime access and instant PDF downloads.
                </p>
              </div>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Browse E-Book Catalog</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {libraryBooks.map((book) => (
                <div
                  key={book.id}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row gap-4 group"
                >
                  <img
                    src={book.coverImageUrl || book.coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'}
                    alt={book.title}
                    className="w-full sm:w-28 aspect-[3/4] rounded-xl object-cover flex-shrink-0 shadow-md"
                  />
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                        {book.category || book.categoryName}
                      </span>
                      <h3 className="text-sm font-bold text-white leading-snug mt-0.5">
                        {book.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        By {book.authorName || book.author} • {book.pageCount || book.pages || 'N/A'} Pages • PDF
                      </p>
                    </div>

                    {/* Unlocked Badge */}
                    <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg w-fit">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Purchased & Ready to Download</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => handleDownloadPdf(book)}
                        disabled={downloadingId === book.id}
                        className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-[0.98]"
                      >
                        {downloadingId === book.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Downloading PDF...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setPreviewEbook(book)}
                        className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                        title="Read sample preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Preview</span>
                      </button>

                      <Link
                        to={`/ebook/${book.id}`}
                        className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Student Order History</h2>
              <p className="text-xs text-slate-400">Live transaction records verified by backend payment security</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Real-time Razorpay records</span>
          </div>

          {loadingOrders ? (
            <div className="p-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <span>Loading your order history from server...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <ShoppingBag className="w-10 h-10 mx-auto text-slate-500" />
              <h3 className="text-sm font-bold text-white">No Orders Found Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You haven't placed any orders yet. Browse our curated catalog and buy handbooks in Test Mode.
              </p>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-4">Order Number</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Purchased Items</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Payment ID / Ref</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-sky-400">{ord.orderNumber}</td>
                      <td className="p-4 text-slate-400">
                        {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </td>
                      <td className="p-4 max-w-xs">
                        {ord.items && ord.items.length > 0 ? (
                          ord.items.map((item, i) => (
                            <p key={i} className="text-white font-medium truncate">• {item.title}</p>
                          ))
                        ) : (
                          <p className="text-slate-400 italic">E-Books Package</p>
                        )}
                      </td>
                      <td className="p-4 font-mono font-bold text-white">₹{ord.totalAmount}</td>
                      <td className="p-4 font-mono text-[11px] text-slate-400">
                        {ord.cashfreePaymentId || ord.cashfreeOrderId || ord.razorpayPaymentId || ord.razorpayOrderId || '—'}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(ord.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAVED E-BOOKS */}
      {activeTab === 'saved' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Bookmarked for Later</h2>
            <Link to="/catalog" className="text-xs text-sky-400 hover:underline">
              Browse catalog
            </Link>
          </div>

          {savedBooks.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
              <Bookmark className="w-10 h-10 mx-auto text-slate-500" />
              <h3 className="text-sm font-bold text-white">No Bookmarked Handbooks</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You haven't saved any handbooks yet. You can bookmark e-books directly from their detail pages to view them later.
              </p>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedBooks.map((book) => (
                <div
                  key={book.id}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-4"
                >
                  <img
                    src={book.coverImage || book.coverImageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'}
                    alt={book.title}
                    className="w-20 h-24 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-2">
                    <span className="text-[10px] font-bold text-sky-400 uppercase">{book.categoryName || book.category}</span>
                    <h3 className="text-sm font-bold text-white truncate">{book.title}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-white">₹{book.price}</span>
                      {book.originalPrice && (
                        <span className="text-xs text-slate-500 line-through">₹{book.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        to={`/ebook/${book.id}`}
                        className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => setPreviewEbook(book)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: STUDENT PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/40"
            />
            <div>
              <h2 className="text-lg font-bold text-white">{user?.name || 'Aman Sharma'}</h2>
              <p className="text-xs text-slate-400">{user?.email || 'aman.student@codeorbit.dev'}</p>
              <span className="inline-block mt-1 bg-brand-500/20 text-sky-300 font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                ROLE: {user?.role || 'STUDENT'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">Institution</span>
              <p className="font-bold text-white">{user?.college || 'National Institute of Technology (NIT)'}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">Academic Department</span>
              <p className="font-bold text-white">{user?.branch || 'Computer Science & Engineering'}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">Current Semester</span>
              <p className="font-bold text-white">{user?.semester || '6th Semester'}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px]">Member Since</span>
              <p className="font-bold text-white">{user?.joinedDate || 'January 2026'}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Account status: <strong className="text-emerald-400">Active Student Account</strong></span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl font-semibold transition-colors"
            >
              Sign Out
            </button>
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
