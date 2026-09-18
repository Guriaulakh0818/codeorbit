import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  FileText, 
  Download, 
  BookOpen, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Share2, 
  Bookmark, 
  Eye, 
  Zap, 
  Layers, 
  Lock,
  ShoppingCart,
  Loader2,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { catalogApi } from '../services/catalogApi';
import { paymentApi } from '../services/paymentApi';
import { PdfPreviewModal } from '../components/PdfPreviewModal';
import { RazorpayCheckoutModal } from '../components/RazorpayCheckoutModal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const EbookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToCart, setIsCartOpen } = useCart();

  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [cartFeedback, setCartFeedback] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState(null);

  // Fetch e-book by ID from real backend catalog API
  useEffect(() => {
    let isMounted = true;
    async function loadEbook() {
      setLoading(true);
      setError(null);
      const res = await catalogApi.getEbookById(id);
      if (!isMounted) return;

      if (res.success && res.data) {
        setEbook(res.data);
      } else {
        setError(res.message || 'The requested e-book could not be found.');
      }
      setLoading(false);
    }
    loadEbook();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Check if authenticated user already owns this e-book
  useEffect(() => {
    let isMounted = true;
    async function checkOwnership() {
      if (isAuthenticated && id) {
        setCheckingAccess(true);
        try {
          const res = await paymentApi.checkEbookAccess(id);
          if (isMounted) {
            setIsPurchased(res.hasAccess || false);
          }
        } catch {
          if (isMounted) setIsPurchased(false);
        } finally {
          if (isMounted) setCheckingAccess(false);
        }
      } else {
        setIsPurchased(false);
      }
    }
    checkOwnership();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    }
  };

  const handleAddToCart = () => {
    if (ebook) {
      addToCart(ebook);
      setCartFeedback(true);
      setTimeout(() => setCartFeedback(false), 2500);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleDownloadPdf = async () => {
    if (!ebook) return;
    setDownloading(true);
    setDownloadMessage(null);
    try {
      const res = await paymentApi.downloadEbookPdf(ebook.id, ebook.title);
      setDownloadMessage({
        type: 'success',
        text: `Downloaded ${res.filename} successfully.`
      });
    } catch (err) {
      setDownloadMessage({
        type: 'error',
        text: err.message || 'Failed to download PDF. Please ensure your purchase is confirmed.'
      });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-brand-400 animate-spin mx-auto" />
        <p className="text-sm text-slate-400 font-medium">Loading engineering handbook details...</p>
      </div>
    );
  }

  if (error || !ebook) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Handbook Not Found</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {error || 'The e-book you are looking for does not exist or has been unpublished.'}
          </p>
        </div>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const originalPrice = ebook.originalPrice || Math.round(ebook.price * 2.5);
  const discountPercent = originalPrice > ebook.price 
    ? Math.round(((originalPrice - ebook.price) / originalPrice) * 100) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Back Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`p-2 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              isSaved
                ? 'bg-brand-500/20 text-sky-300 border-brand-500/30'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-sky-400 text-sky-400' : ''}`} />
            <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Share handbook link"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {copyFeedback && (
        <div className="p-3 bg-brand-500/20 border border-brand-500/40 rounded-xl text-xs text-sky-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-sky-400" />
          <span>Link copied to clipboard!</span>
        </div>
      )}

      {cartFeedback && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Handbook added to cart!</span>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="font-bold underline text-white hover:text-emerald-200"
          >
            View Cart
          </button>
        </div>
      )}

      {downloadMessage && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center gap-3 animate-in fade-in ${
          downloadMessage.type === 'success'
            ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
            : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
        }`}>
          {downloadMessage.type === 'success' ? (
            <FileCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          )}
          <span>{downloadMessage.text}</span>
        </div>
      )}

      {/* Main Grid: Left Details & Right Sticky Purchase Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Handbook Full Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Badge Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-brand-500/10 border border-brand-500/30 text-sky-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {ebook.categoryName || ebook.category}
            </span>
            {ebook.isBestseller && (
              <span className="bg-amber-500 text-slate-950 font-bold text-xs uppercase px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md shadow-amber-500/20">
                <Sparkles className="w-3 h-3 fill-slate-950" /> Bestseller
              </span>
            )}
            <span className="bg-slate-900 text-slate-400 text-xs font-mono px-2.5 py-1 rounded-full border border-slate-800">
              OFFICIAL PUBLICATION
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            {ebook.title}
          </h1>

          {/* Subtitle / Short Description */}
          <p className="text-base text-slate-300 leading-relaxed">
            {ebook.subtitle || ebook.shortDescription}
          </p>

          {/* Metadata Stats Row: Author, Rating, Page Count */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 border-y border-slate-800/80 py-4 text-xs">
            {/* Author */}
            <div>
              <span className="text-slate-400 text-[11px] block">Author</span>
              <span className="font-bold text-white text-sm mt-0.5 block">{ebook.author || ebook.authorName || 'CodeOrbit Engineering'}</span>
              <span className="text-[11px] text-slate-400">{ebook.authorTitle || 'CodeOrbit Author'}</span>
            </div>

            {/* Rating */}
            <div>
              <span className="text-slate-400 text-[11px] block">Rating & Reviews</span>
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm mt-0.5">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{ebook.rating || 5.0} / 5.0</span>
              </div>
              <span className="text-[11px] text-slate-400">({ebook.reviewCount || 0} student ratings)</span>
            </div>

            {/* Page Count */}
            <div>
              <span className="text-slate-400 text-[11px] block">Document Length</span>
              <div className="flex items-center gap-1.5 text-sky-400 font-bold text-sm mt-0.5">
                <FileText className="w-4 h-4" />
                <span>{ebook.pages || ebook.pageCount || 'N/A'} Pages</span>
              </div>
              <span className="text-[11px] text-slate-400">PDF • Printable</span>
            </div>
          </div>

          {/* Long Description */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white">About this Handbook</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {ebook.description || ebook.shortDescription}
            </p>
          </div>

          {/* Key Highlights */}
          {ebook.highlights && ebook.highlights.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-bold text-white">What You Will Learn:</h3>
              <div className="grid grid-cols-1 gap-2.5">
                {ebook.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-200 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Purchase & Preview Card */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-[#0b132b] sticky top-24 space-y-6 shadow-2xl">
            {/* Book Cover */}
            <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
              <img
                src={ebook.coverImage || ebook.coverImageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'}
                alt={ebook.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              
              {/* Free Sample Button overlay */}
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="absolute bottom-3 left-3 right-3 py-2 bg-slate-900/90 hover:bg-brand-600 text-white text-xs font-bold rounded-xl backdrop-blur-md border border-slate-700 transition-all flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Eye className="w-4 h-4 text-sky-400" />
                <span>Read Free Sample Preview</span>
              </button>
            </div>

            {/* Price section */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-white font-mono">₹{ebook.price}</span>
                {originalPrice > ebook.price && (
                  <span className="text-base text-slate-400 line-through font-mono">₹{originalPrice}</span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">One-time purchase • Lifetime digital access</p>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5">
              {isPurchased ? (
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>You own this handbook in your Student Library</span>
                  </div>
                  <button
                    onClick={handleDownloadPdf}
                    disabled={downloading}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Downloading PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download Master PDF</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Buy E-Book Now (₹{ebook.price})</span>
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl border border-slate-700/80 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4 text-sky-400" />
                    <span>Add to Cart</span>
                  </button>
                </>
              )}

              <button
                onClick={() => setIsPreviewOpen(true)}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-slate-300 text-xs font-semibold rounded-2xl border border-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>Open Sample Reader</span>
              </button>
            </div>

            {/* Value Guarantees */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Protected DRM PDF with verified license</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>Instant access in Student Library upon purchase</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Curated for university semester exams & placements</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Contents Section */}
      {ebook.tableOfContents && ebook.tableOfContents.length > 0 && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-[#0b132b] space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Layers className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold text-white">Table of Contents & Curriculum</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {ebook.tableOfContents.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-sky-400 uppercase font-mono">{item.chapter}</span>
                  <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                </div>
                <span className="text-[11px] text-slate-400 font-mono flex-shrink-0 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {item.pages}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive PDF Sample Preview Modal */}
      <PdfPreviewModal
        ebook={ebook}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

      {/* Razorpay Checkout Modal for Direct Purchase */}
      <RazorpayCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        singleEbook={ebook}
      />
    </div>
  );
};
