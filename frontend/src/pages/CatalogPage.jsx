import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, X, BookOpen, Sparkles, ArrowUpDown, Info, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { EbookCard } from '../components/EbookCard';
import { PdfPreviewModal } from '../components/PdfPreviewModal';
import { CATEGORIES } from '../data/ebooksData';
import { catalogApi } from '../services/catalogApi';

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all'); // 'all' | 'under-200' | '200-250' | 'above-250'
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc'
  const [previewEbook, setPreviewEbook] = useState(null);

  // Backend Catalog State
  const [ebooks, setEbooks] = useState([]);
  const [categories, setCategories] = useState(CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync URL query params with state
  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    if (q !== null) setSearchQuery(q);
    if (cat !== null) setSelectedCategory(cat);
  }, [searchParams]);

  // Load backend categories and catalog
  const loadCatalog = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ebooksRes, catRes] = await Promise.all([
        catalogApi.getEbooks({ size: 100 }),
        catalogApi.getCategories()
      ]);

      if (ebooksRes.success) {
        setEbooks(ebooksRes.data || []);
      } else {
        setError(ebooksRes.message || 'Failed to load catalog.');
      }

      if (catRes.success && Array.isArray(catRes.data) && catRes.data.length > 0) {
        const dynamicCats = [
          { id: 'all', name: 'All Topics' },
          ...catRes.data.map(catKey => {
            const found = CATEGORIES.find(c => c.id.toLowerCase() === catKey.toLowerCase());
            return found || { id: catKey, name: catKey.charAt(0).toUpperCase() + catKey.slice(1) };
          })
        ];
        setCategories(dynamicCats);
      }
    } catch (err) {
      setError('Could not connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  // Handle filter changes and update URL cleanly
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    const params = new URLSearchParams(searchParams);
    if (catId === 'all') {
      params.delete('category');
    } else {
      params.set('category', catId);
    }
    setSearchParams(params);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams);
    if (!query.trim()) {
      params.delete('q');
    } else {
      params.set('q', query.trim());
    }
    setSearchParams(params);
  };

  const filteredEbooks = useMemo(() => {
    return (ebooks || [])
      .filter((ebook) => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = ebook.title?.toLowerCase().includes(q);
          const matchCategory = (ebook.categoryName || ebook.category)?.toLowerCase().includes(q);
          const matchAuthor = (ebook.author || ebook.authorName)?.toLowerCase().includes(q);
          const matchDesc = (ebook.shortDescription || ebook.description)?.toLowerCase().includes(q);
          if (!matchTitle && !matchCategory && !matchAuthor && !matchDesc) return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && ebook.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }

        // Price range filter
        const price = Number(ebook.price) || 0;
        if (selectedPriceRange === 'under-200' && price >= 200) return false;
        if (selectedPriceRange === '200-250' && (price < 200 || price > 250)) return false;
        if (selectedPriceRange === 'above-250' && price <= 250) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        }
        if (sortBy === 'price-asc') return (Number(a.price) || 0) - (Number(b.price) || 0);
        if (sortBy === 'price-desc') return (Number(b.price) || 0) - (Number(a.price) || 0);
        return 0;
      });
  }, [ebooks, searchQuery, selectedCategory, selectedPriceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPriceRange('all');
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Heading & Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0b132b] via-slate-900 to-slate-900 border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-sky-300">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Official Engineering E-Book Store</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Explore Engineering E-books
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Curated downloadable educational PDF handbooks, interview prep guides, and engineering notes covering Core Java, Python, DSA, Web Dev, DBMS, OS, and Networks.
          </p>
        </div>
      </div>

      {/* Error alert banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadCatalog}
            className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-white font-bold transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search and Filters Toolbar */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by title, author, topic (e.g. Java, Sliding Window, SQL, TCP)..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-brand-500"
              aria-label="Category filter"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Price Filter */}
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-brand-500"
              aria-label="Price filter"
            >
              <option value="all">All Prices</option>
              <option value="under-200">Under ₹200</option>
              <option value="200-250">₹200 - ₹250</option>
              <option value="above-250">Above ₹250</option>
            </select>

            {/* Sort Options: Featured, Price Low to High, Price High to Low */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-brand-500"
              aria-label="Sort options"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            {(searchQuery || selectedCategory !== 'all' || selectedPriceRange !== 'all' || sortBy !== 'featured') && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors flex items-center gap-1 font-semibold"
              >
                <X className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Category Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors border text-[11px] font-semibold ${
                  isSelected
                    ? 'bg-brand-600 border-brand-400 text-white shadow-md shadow-brand-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <p>
          Showing <span className="text-white font-bold">{filteredEbooks.length}</span> published e-books
          {selectedCategory !== 'all' && (
            <span> in <strong className="text-sky-300">{categories.find(c => c.id.toLowerCase() === selectedCategory.toLowerCase())?.name || selectedCategory}</strong></span>
          )}
        </p>
        <span className="font-mono text-[11px] text-slate-500">Sorted by: {
          sortBy === 'featured' ? 'Featured' : sortBy === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'
        }</span>
      </div>

      {/* Product Cards Grid or Loading / Empty state */}
      {loading ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-300 font-semibold">Loading e-book catalog from database...</p>
        </div>
      ) : filteredEbooks.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white">No e-books match your search criteria</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your price range, clearing the search query, or selecting another category.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEbooks.map((ebook) => (
            <EbookCard
              key={ebook.id}
              ebook={ebook}
              onQuickPreview={(b) => setPreviewEbook(b)}
            />
          ))}
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
