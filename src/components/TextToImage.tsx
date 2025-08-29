import { useState } from 'react';
import { generateImageFromText, hasApiKey } from '../services/geminiApi';
import { ApiKeyErrorMessage } from './ApiKeyErrorMessage';
import { ErrorMessage } from './ErrorMessage';
import { openImage } from '../utils/imageUtils';
import { StarIcon, PlusIcon, DownloadIcon, CopyIcon } from './icons';

export const TextToImage = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for the image you want to generate.');
      return;
    }

    // Basic validation for prompt length
    if (prompt.trim().length < 3) {
      setError('Please provide a more detailed description (at least 3 characters).');
      return;
    }

    if (prompt.trim().length > 1000) {
      setError('Description is too long. Please keep it under 1000 characters.');
      return;
    }

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const url = await generateImageFromText(prompt.trim());
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
        <ApiKeyErrorMessage />
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
              {!loading && <StarIcon />}
              <span className="btn-content">
                {loading ? 'Creating magic...' : 'Generate Image'}
              </span>
            </button>
            {imageUrl && (
              <button
                className="btn-secondary"
                onClick={handleNewTask}
                disabled={loading}
              >
                 <PlusIcon />
                New Task
              </button>
            )}
          </div>
        </div>
      </div>

       {error && (
         <ErrorMessage
           title="Generation Failed"
           message={error}
         />
       )}

      {imageUrl && (
        <div className="result-section">
          <div className="image-result">
            <img
              src={imageUrl}
              alt="Generated image"
              className="result-image"
              onClick={() => openImage(imageUrl)}
            />
            <div
              className="image-overlay"
              onClick={() => openImage(imageUrl)}
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
               <DownloadIcon />
              Download Image
            </a>
            <button
              className="result-btn"
              onClick={() => navigator.clipboard.writeText(imageUrl)}
              style={{ background: 'var(--secondary-gradient)' }}
            >
               <CopyIcon />
              Copy URL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};