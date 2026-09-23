import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Global listener for Vite dynamic import preload failures on production deployments
window.addEventListener('vite:preloadError', (event) => {
  console.warn('[CodeOrbit] vite:preloadError detected! Auto-reloading to fetch fresh deployment assets...', event);
  const reloadKey = 'codeorbit_vite_preload_reload';
  if (!sessionStorage.getItem(reloadKey)) {
    sessionStorage.setItem(reloadKey, 'true');
    window.location.reload();
  }
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    // If it's a dynamic module import failure, trigger reload immediately
    const errorMsg = error?.message || '';
    if (
      errorMsg.includes('Failed to fetch dynamically imported module') ||
      errorMsg.includes('Importing a module script failed') ||
      errorMsg.includes('Loading chunk')
    ) {
      const reloadKey = 'codeorbit_eb_chunk_reload';
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
      }
    }
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("CodeOrbit Render Error:", error, info);
    this.setState({ error, info });
  }

  handleReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          color: '#1e293b',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: '540px',
            width: '100%',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem' }}>
              CodeOrbit Application Notice
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              An unexpected rendering exception occurred. You can reset local cached state to reload:
            </p>
            <div style={{
              backgroundColor: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '0.75rem',
              padding: '0.875rem',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: '#be123c',
              overflowX: 'auto',
              marginBottom: '1.25rem',
              maxHeight: '120px'
            }}>
              {this.state.error?.toString()}
            </div>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#059669',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.75rem',
                padding: '0.75rem 1.5rem',
                fontWeight: '700',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              Reset Cache & Reload Portal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
