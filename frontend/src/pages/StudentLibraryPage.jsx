import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookmarkCheck, 
  BookOpen, 
  Download, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  FileCheck,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { paymentApi } from '../services/paymentApi';

export const StudentLibraryPage = () => {
  const { user } = useAuth();
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState(null);
  const [downloadErrorMessage, setDownloadErrorMessage] = useState(null);

  useEffect(() => {
    async function loadLibrary() {
      setLoading(true);
      try {
        const data = await paymentApi.getStudentLibrary();
        setPurchasedBooks(data || []);
      } catch (err) {
        console.error('Failed to load student library', err);
      } finally {
        setLoading(false);
      }
    }
    loadLibrary();
  }, []);

  const filteredBooks = purchasedBooks.filter(book => 
    (book.title || '').toLowerCase().includes(filterQuery.toLowerCase()) ||
    (book.category || book.categoryName || '').toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleDownloadPdf = async (book) => {
    setDownloadingId(book.id);
    setDownloadSuccessMessage(null);
    setDownloadErrorMessage(null);

    try {
      const res = await paymentApi.downloadEbookPdf(book.id, book.title);
      setDownloadSuccessMessage({
        bookTitle: book.title,
        filename: res.filename,
        licensedTo: user?.email || 'Student'
      });
    } catch (err) {
      setDownloadErrorMessage(err.message || 'Failed to download PDF. Please verify your purchase status.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>My Digital Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome back, {user?.name || user?.fullName || 'Student'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Access your purchased e-books and download authorized PDF editions anytime.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center min-w-[120px]">
            <span className="text-2xl font-bold text-emerald-400">{purchasedBooks.length}</span>
            <span className="text-[11px] text-slate-400 block">Unlocked E-Books</span>
          </div>
        </div>
      </div>

      {/* Download Alert Toast */}
      {downloadSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <FileCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-white">PDF Download Started: {downloadSuccessMessage.bookTitle}</p>
              <p className="text-[11px] text-emerald-300">
                Saved file: <code className="text-white font-mono">{downloadSuccessMessage.filename}</code> • Licensed to {downloadSuccessMessage.licensedTo}
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

      {/* Download Error Toast */}
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

      {/* Search Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search your library..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>

        <Link
          to="/catalog"
          className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Browse More Handbooks in Catalog</span>
        </Link>
      </div>

      {/* Purchased Books List */}
      {loading ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading your unlocked library...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white">No e-books found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {purchasedBooks.length === 0
              ? "You haven't purchased any e-books yet. Browse the catalog to get started."
              : "No e-books matched your search filter."}
          </p>
          <Link
            to="/catalog"
            className="inline-block px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-brand-500/25 transition-all"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBooks.map((book) => {
            return (
              <div
                key={book.id}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row gap-5 group"
              >
                {/* Cover thumbnail */}
                <div className="w-full sm:w-32 aspect-[3/4] rounded-xl overflow-hidden bg-slate-950 relative flex-shrink-0">
                  <img
                    src={book.coverImageUrl || book.coverImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-xs text-[10px] text-center font-bold text-emerald-400 py-0.5 rounded border border-emerald-500/30">
                    UNLOCKED
                  </span>
                </div>

                {/* Details & Controls */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">
                      {book.category || book.categoryName}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-snug mt-0.5">
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      By {book.authorName || book.author} • {book.pageCount || book.pages || 'N/A'} Pages • PDF
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Purchased & Ready to Download</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleDownloadPdf(book)}
                      disabled={downloadingId === book.id}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-50"
                      title="Download Authorized PDF"
                    >
                      {downloadingId === book.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </>
                      )}
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
            );
          })}
        </div>
      )}
    </div>
  );
};
