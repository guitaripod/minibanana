import { useState } from 'react';
import { generateImageFromText, hasApiKey } from '../services/geminiApi';

export const TextToImage = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const url = await generateImageFromText(prompt);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const handleNewTask = () => {
    setPrompt('');
    setImageUrl(null);
    setError(null);
    setLoading(false);
  };

  if (!hasApiKey()) {
    return (
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Text to Image</h2>
          <p className="section-description">Transform your ideas into stunning visuals</p>
        </div>
        <div className="status-message status-error">
          <svg className="status-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <div>
            <strong>API Key Required</strong>
            <p>Please set up your Gemini API key to use this feature. Get your free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="guide-link">Google AI Studio</a></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h2 className="section-title">Text to Image</h2>
        <p className="section-description">Describe your vision and watch it come to life</p>
      </div>

      <div className="input-section">
        <div className="input-group">
          <div className="form-field">
            <label htmlFor="prompt">Describe your image</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A serene mountain landscape at sunset with vibrant colors..."
              rows={5}
              disabled={loading}
              aria-describedby="prompt-help"
            />
            <small id="prompt-help" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
              Be specific about style, colors, mood, and composition for best results
            </small>
          </div>

          <div className="action-buttons">
            <button
              className={`btn-primary ${loading ? 'btn-loading' : ''}`}
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              aria-describedby="generate-help"
            >
              {!loading && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              )}
              {loading ? 'Creating magic...' : 'Generate Image'}
            </button>
            {imageUrl && (
              <button
                className="btn-secondary"
                onClick={handleNewTask}
                disabled={loading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
                New Task
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="status-message status-error">
          <svg className="status-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <div>
            <strong>Generation Failed</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {imageUrl && (
        <div className="result-section">
          <div className="image-result">
            <img
              src={imageUrl}
              alt="Generated image"
              className="result-image"
              onClick={() => {
                const link = document.createElement('a');
                link.href = imageUrl;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            />
            <div
              className="image-overlay"
              onClick={() => {
                const link = document.createElement('a');
                link.href = imageUrl;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              style={{ cursor: 'pointer' }}
            >
              <span>Click to view full size</span>
            </div>
          </div>

          <div className="result-actions">
            <a
              href={imageUrl}
              download="generated-image.png"
              className="result-btn"
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              Download Image
            </a>
            <button
              className="result-btn"
              onClick={() => navigator.clipboard.writeText(imageUrl)}
              style={{ background: 'var(--secondary-gradient)' }}
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
              Copy URL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};