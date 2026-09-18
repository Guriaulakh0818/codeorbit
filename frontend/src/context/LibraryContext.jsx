import React, { createContext, useContext, useState, useEffect } from 'react';
import { catalogApi } from '../services/catalogApi';

const LibraryContext = createContext(null);

export const LibraryProvider = ({ children }) => {
  const [purchasedBooks, setPurchasedBooks] = useState(() => {
    const saved = localStorage.getItem('codeorbit_library');
    return saved ? JSON.parse(saved) : [];
  });

  const [allEbooks, setAllEbooks] = useState(() => {
    const saved = localStorage.getItem('codeorbit_all_ebooks');
    return saved ? JSON.parse(saved) : [];
  });

  const [readingProgress, setReadingProgress] = useState(() => {
    const saved = localStorage.getItem('codeorbit_progress');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    async function loadCatalog() {
      if (allEbooks.length === 0) {
        const res = await catalogApi.getEbooks();
        if (res.success && Array.isArray(res.data)) {
          setAllEbooks(res.data);
        }
      }
    }
    loadCatalog();
  }, []);

  useEffect(() => {
    localStorage.setItem('codeorbit_library', JSON.stringify(purchasedBooks));
  }, [purchasedBooks]);

  useEffect(() => {
    localStorage.setItem('codeorbit_all_ebooks', JSON.stringify(allEbooks));
  }, [allEbooks]);

  useEffect(() => {
    localStorage.setItem('codeorbit_progress', JSON.stringify(readingProgress));
  }, [readingProgress]);

  const addPurchasedBooks = (newBooks) => {
    setPurchasedBooks(prev => {
      const existingIds = new Set(prev.map(b => b.id));
      const filteredNew = newBooks.filter(b => !existingIds.has(b.id));
      return [...prev, ...filteredNew];
    });
  };

  const isBookPurchased = (ebookId) => {
    return purchasedBooks.some(b => b.id === ebookId);
  };

  const updateProgress = (ebookId, page, totalPages) => {
    const percent = Math.min(100, Math.round((page / totalPages) * 100));
    setReadingProgress(prev => ({
      ...prev,
      [ebookId]: { page, percent }
    }));
  };

  const submitNewEbook = (ebookData) => {
    const newBook = {
      ...ebookData,
      id: 'ebook-' + Date.now(),
      rating: 5.0,
      reviewCount: 0,
      status: 'APPROVED',
      isBestseller: false,
      isFeatured: false,
      lastUpdated: 'Just now'
    };
    setAllEbooks(prev => [newBook, ...prev]);
    return newBook;
  };

  const updateEbookStatus = (ebookId, newStatus) => {
    setAllEbooks(prev => prev.map(b => b.id === ebookId ? { ...b, status: newStatus } : b));
  };

  return (
    <LibraryContext.Provider value={{
      purchasedBooks,
      allEbooks,
      readingProgress,
      addPurchasedBooks,
      isBookPurchased,
      updateProgress,
      submitNewEbook,
      updateEbookStatus
    }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    return {
      purchasedBooks: [],
      allEbooks: [],
      readingProgress: {},
      addPurchasedBooks: () => {},
      isBookPurchased: () => false,
      updateProgress: () => {},
      submitNewEbook: () => {},
      updateEbookStatus: () => {}
    };
  }
  return context;
};

