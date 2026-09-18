import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
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
          backgroundColor: '#080d1e',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
          }}>
            <h2 style={{ color: '#38bdf8', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              CodeOrbit Application Notice
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              An unexpected error occurred while rendering the page. You can reset local state to restore the default store catalog:
            </p>
            <div style={{
              backgroundColor: '#020617',
              border: '1px solid #1e293b',
              borderRadius: '0.5rem',
              padding: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: '#f43f5e',
              overflowX: 'auto',
              marginBottom: '1.5rem',
              maxHeight: '150px'
            }}>
              {this.state.error?.toString()}
            </div>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.75rem 1.5rem',
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              Clear Storage & Reload Store
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

