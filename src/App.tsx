import { useState, useEffect } from 'react';
import { TextToImage } from './components/TextToImage';
import { ImageEdit } from './components/ImageEdit';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'text' | 'edit'>('text');

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

  return (
    <div className="app">
      <header>
        <h1>Gemini Image Generator</h1>
        <p>Generate and edit images using Gemini 2.5 Flash</p>
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
    </div>
  );
}

export default App;