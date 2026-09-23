import { lazy } from 'react';

/**
 * Production-grade resilient lazy loading wrapper.
 * Automatically recovers from stale chunk errors (e.g. after a new production deployment on Vercel)
 * by reloading the window once to fetch the latest index.html and newly generated hashed bundles.
 * 
 * @param {Function} componentImport - Dynamic import function, e.g. () => import('./pages/CoursesPage')
 * @returns {React.LazyExoticComponent}
 */
export function lazyWithRetry(componentImport) {
  return lazy(async () => {
    const storageKey = 'codeorbit_chunk_reload_lock';
    const hasReloaded = sessionStorage.getItem(storageKey) === 'true';

    try {
      const module = await componentImport();
      // Reset lock on successful import
      sessionStorage.removeItem(storageKey);
      return module;
    } catch (error) {
      const errorMessage = error?.message || '';
      const isDynamicImportError = 
        errorMessage.includes('Failed to fetch dynamically imported module') ||
        errorMessage.includes('Importing a module script failed') ||
        errorMessage.includes('Loading chunk') ||
        errorMessage.includes('error loading dynamically imported module') ||
        error?.name === 'ChunkLoadError';

      if (isDynamicImportError && !hasReloaded) {
        console.warn('[CodeOrbit] New deployment detected / stale chunk fetch failure. Refreshing window to load latest bundle...', error);
        sessionStorage.setItem(storageKey, 'true');
        window.location.reload();
        // Return a pending promise to prevent rendering crash before page reload triggers
        return new Promise(() => {});
      }

      // If already reloaded once and still failing, throw so error boundary or fallback can handle it
      sessionStorage.removeItem(storageKey);
      throw error;
    }
  });
}

export default lazyWithRetry;
