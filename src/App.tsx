import { useState, useEffect } from 'react';
import { TextToImage } from './components/TextToImage';
import { ImageEdit } from './components/ImageEdit';
import { ApiKeyModal } from './components/ApiKeyModal';
import { hasApiKey, clearApiKey } from './services/geminiApi';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'text' | 'edit'>('text');
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
      <header>
        <div style={{ position: 'relative' }}>
          <h1>Gemini Image Generator</h1>
          <p>Generate and edit images using Gemini 2.5 Flash</p>
          {isDevelopment && (
            <button
              onClick={() => {
                clearApiKey();
                window.location.reload();
              }}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                fontSize: '12px',
                padding: '4px 8px',
                background: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              title="Clear API key (dev only)"
            >
              🔄 Reset
            </button>
          )}
        </div>
      </header>

      <nav>
        <button
          className={activeTab === 'text' ? 'active' : ''}
          onClick={() => setActiveTab('text')}
        >
          Text to Image
        </button>
        <button
          className={activeTab === 'edit' ? 'active' : ''}
          onClick={() => setActiveTab('edit')}
        >
          Image Editing
        </button>
      </nav>

      <main>
        {activeTab === 'text' ? <TextToImage /> : <ImageEdit />}
      </main>

      {showApiKeyModal && (
        <ApiKeyModal onClose={() => setShowApiKeyModal(false)} />
      )}
    </div>
  );
}

export default App;