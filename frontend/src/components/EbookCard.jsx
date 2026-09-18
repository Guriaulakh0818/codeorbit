import React from 'react';
import { Link } from 'react-router-dom';
import { Star, FileText, Eye, Sparkles, UserCheck } from 'lucide-react';

export const EbookCard = ({ ebook, onQuickPreview }) => {
  const discountPercent = Math.round(((ebook.originalPrice - ebook.price) / ebook.originalPrice) * 100);

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-brand-500/15 border border-slate-800 bg-[#0d152d]">
      {/* Cover Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={ebook.coverImage}
          alt={ebook.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d152d] via-transparent to-transparent"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {ebook.isBestseller && (
            <span className="bg-amber-500 text-slate-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md shadow-amber-500/30">
              <Sparkles className="w-2.5 h-2.5 fill-slate-950" /> Bestseller
            </span>
          )}
          <span className="bg-slate-900/90 text-sky-400 border border-sky-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {ebook.categoryName}
          </span>
        </div>

        <div className="absolute top-3 right-3 z-10">
          <span className="bg-emerald-500/90 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full">
            {discountPercent}% OFF
          </span>
        </div>

        {/* Store Quality Tag */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="bg-slate-950/80 backdrop-blur-xs text-slate-400 text-[9px] font-mono px-1.5 py-0.5 rounded border border-slate-700/60">
            OFFICIAL STORE
          </span>
        </div>

        {/* Quick Sample Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickPreview?.(ebook);
          }}
          className="absolute bottom-3 right-3 bg-slate-900/90 hover:bg-brand-600 text-slate-200 hover:text-white px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md border border-slate-700 transition-all flex items-center gap-1 shadow-lg"
          title="Quick preview document sample"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Rating & Page Count */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{ebook.rating}</span>
              <span className="text-slate-400 font-normal">({ebook.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
              <FileText className="w-3 h-3 text-sky-400" />
              <span>{ebook.pages} Pages</span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <Link to={`/ebook/${ebook.id}`} className="block group-hover:text-sky-400 transition-colors">
            <h3 className="font-bold text-slate-100 text-base leading-snug line-clamp-2">
              {ebook.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {ebook.subtitle || ebook.description}
          </p>
        </div>

        {/* Author Details */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
          <img
            src={ebook.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
            alt={ebook.author}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
          />
          <span className="text-xs text-slate-300 font-medium truncate">
            {ebook.author}
          </span>
        </div>

        {/* Pricing & View Details CTA */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-white font-mono">₹{ebook.price}</span>
            <span className="text-xs text-slate-400 line-through font-mono">₹{ebook.originalPrice}</span>
          </div>

          <Link
            to={`/ebook/${ebook.id}`}
            className="px-3.5 py-1.5 bg-brand-600/20 hover:bg-brand-600 text-sky-300 hover:text-white border border-brand-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1 group/btn"
          >
            <span>View</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
