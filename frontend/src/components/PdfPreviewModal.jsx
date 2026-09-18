import React, { useState } from 'react';
import { X, Lock, CheckCircle, ShoppingBag, Eye, BookOpen, ChevronLeft, ChevronRight, Download, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLibrary } from '../context/LibraryContext';
import { Link } from 'react-router-dom';

export const PdfPreviewModal = ({ ebook, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'toc'
  const [page, setPage] = useState(1);
  const { addToCart, cartItems } = useCart();
  const { isBookPurchased } = useLibrary();

  if (!isOpen || !ebook) return null;

  const isPurchased = isBookPurchased(ebook.id);
  const isInCart = cartItems.some(item => item.id === ebook.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#0b132b] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500/10 border border-brand-500/30 rounded-lg text-brand-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded">
                  Free Sample Preview
                </span>
                <span className="text-xs text-slate-400">Showing first 3 sample pages</span>
              </div>
              <h2 className="text-base font-bold text-white truncate max-w-lg mt-0.5">
                {ebook.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Nav / Tabs */}
        <div className="flex items-center justify-between px-6 py-2 bg-slate-900/50 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'preview'
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Interactive Document Sample
            </button>
            <button
              onClick={() => setActiveTab('toc')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'toc'
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Table of Contents ({ebook.tableOfContents?.length || 0} Chapters)
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Shield className="w-3.5 h-3.5 text-brand-400" />
            <span>Digital Rights & DRM Protected</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950/60">
          {activeTab === 'preview' ? (
            <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-inner font-sans text-slate-200 space-y-6 relative">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 text-4xl font-extrabold uppercase tracking-widest text-slate-300 rotate-[-25deg]">
                CODEORBIT PREVIEW SAMPLE
              </div>

              {/* Sample Content */}
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <span className="text-xs font-mono text-brand-400 font-bold uppercase tracking-wider">
                  {ebook.categoryName} • Official Guide
                </span>
                <span className="text-xs text-slate-400">Sample Page {page} of 3</span>
              </div>

              <div className="prose prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
                <h1 className="text-xl font-bold text-white border-l-4 border-brand-500 pl-3">
                  {ebook.title}
                </h1>
                <p className="text-slate-300 font-medium italic">
                  By {ebook.author || 'CodeOrbit Editorial Board'} {ebook.authorTitle ? `(${ebook.authorTitle})` : ''}
                </p>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
                  <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">
                    Key Takeaways in this Guide:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                    {ebook.highlights?.slice(0, 3).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="whitespace-pre-line text-slate-300 font-mono text-xs bg-slate-950/90 p-4 rounded-xl border border-slate-800 overflow-x-auto">
                  {ebook.samplePreviewText}
                </div>

                {/* Locked Pages Banner */}
                <div className="mt-8 p-6 bg-gradient-to-r from-brand-950/80 via-slate-900 to-brand-950/80 border border-brand-500/30 rounded-xl text-center space-y-3">
                  <div className="w-10 h-10 mx-auto rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-sm">
                    Remaining {ebook.pages - 3} pages are locked
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Unlock the full {ebook.pages}-page handbook, source code repositories, and lifetime update access for only ₹{ebook.price}.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-3">
              <h3 className="text-sm font-bold text-white mb-2">Complete Curriculum Index</h3>
              {ebook.tableOfContents?.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-400 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                      <p className="text-[11px] text-brand-400/80 font-mono">{item.chapter}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono">Pages {item.pages}</span>
                    {idx === 0 ? (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-semibold">
                        Preview Available
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-slate-400">Total Price:</span>
            <span className="text-xl font-bold text-white">₹{ebook.price}</span>
            <span className="text-xs text-slate-400 line-through">₹{ebook.originalPrice}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Close
            </button>

            {isPurchased ? (
              <Link
                to={`/reader/${ebook.id}`}
                onClick={onClose}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" /> Open Full Book
              </Link>
            ) : (
              <button
                onClick={() => {
                  addToCart(ebook);
                  onClose();
                }}
                disabled={isInCart}
                className={`px-5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                  isInCart
                    ? 'bg-slate-800 text-slate-400 cursor-default border border-slate-700'
                    : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/30 hover:scale-105'
                }`}
              >
                {isInCart ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> In Your Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart — ₹{ebook.price}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
