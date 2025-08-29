import { useState, useEffect } from 'react';
import { TextToImage } from './components/TextToImage';
import { ImageEdit } from './components/ImageEdit';
import { MultiImageComposition } from './components/MultiImageComposition';
import { ApiKeyModal } from './components/ApiKeyModal';
import { hasApiKey, clearApiKey } from './services/geminiApi';
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
             <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
               <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-3c-.55 0-1-.45-1-1s.45-1 1-1h3c.55 0 1 .45 1 1s-.45 1-1 1zm0-3h-3c-.55 0-1-.45-1-1s.45-1 1-1h3c.55 0 1 .45 1 1s-.45 1-1 1z"/>
             </svg>
             Text to Image
           </button>
           <button
             className={`nav-tab ${activeTab === 'edit' ? 'active' : ''}`}
             onClick={() => setActiveTab('edit')}
             role="tab"
             aria-selected={activeTab === 'edit'}
           >
             <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
               <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
             </svg>
             Image Editing
           </button>
           <button
             className={`nav-tab ${activeTab === 'multi' ? 'active' : ''}`}
             onClick={() => setActiveTab('multi')}
             role="tab"
             aria-selected={activeTab === 'multi'}
           >
             <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
               <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4c-.55 0-1-.45-1-1s.45-1 1-1h4c.55 0 1 .45 1 1s-.45 1-1 1zm0-3h-4c-.55 0-1-.45-1-1s.45-1 1-1h4c.55 0 1 .45 1 1s-.45 1-1 1zm0 6h-4c-.55 0-1-.45-1-1s.45-1 1-1h4c.55 0 1 .45 1 1s-.45 1-1 1z"/>
             </svg>
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