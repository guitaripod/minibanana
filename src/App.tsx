import { useState, useEffect } from 'react';
import { TextToImage } from './components/TextToImage';
import { ImageEdit } from './components/ImageEdit';
import { MultiImageComposition } from './components/MultiImageComposition';
import { ApiKeyModal } from './components/ApiKeyModal';
import { hasApiKey, clearApiKey } from './services/geminiApi';
import { TextIcon, ImageEditIcon, MultiImageIcon } from './components/icons';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'text' | 'edit' | 'multi'>('text');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const isDevelopment = import.meta.env.DEV;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      const isDark = e.matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    };

    updateTheme(mediaQuery);

    mediaQuery.addEventListener('change', updateTheme);

    return () => {
      mediaQuery.removeEventListener('change', updateTheme);
    };
  }, []);

  useEffect(() => {
    if (!hasApiKey()) {
      setShowApiKeyModal(true);
    }
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h1>Gemini Image Generator</h1>
          <p className="header-subtitle">Create and transform images with AI</p>
        </div>
        {isDevelopment && (
          <div className="header-actions">
            <button
              className="reset-button"
              onClick={() => {
                clearApiKey();
                window.location.reload();
              }}
              title="Clear API key (dev only)"
              aria-label="Reset API key"
            >
              🔄
            </button>
          </div>
        )}
      </header>

      <div className="nav-container">
        <nav className="nav-tabs" role="tablist">
            <button
              className={`nav-tab ${activeTab === 'text' ? 'active' : ''}`}
              onClick={() => setActiveTab('text')}
              role="tab"
              aria-selected={activeTab === 'text'}
            >
              <TextIcon />
              Text to Image
            </button>
            <button
              className={`nav-tab ${activeTab === 'edit' ? 'active' : ''}`}
              onClick={() => setActiveTab('edit')}
              role="tab"
              aria-selected={activeTab === 'edit'}
            >
              <ImageEditIcon />
              Image Editing
            </button>
            <button
              className={`nav-tab ${activeTab === 'multi' ? 'active' : ''}`}
              onClick={() => setActiveTab('multi')}
              role="tab"
              aria-selected={activeTab === 'multi'}
            >
              <MultiImageIcon />
              Multi-Image
            </button>
         </nav>
      </div>

       <main className="main-content">
         {activeTab === 'text' ? <TextToImage /> : activeTab === 'edit' ? <ImageEdit /> : <MultiImageComposition />}
       </main>

      {showApiKeyModal && (
        <ApiKeyModal onClose={() => setShowApiKeyModal(false)} />
      )}
    </div>
  );
}

export default App;