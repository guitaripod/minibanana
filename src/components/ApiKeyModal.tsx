import { useState } from 'react';
import { setApiKey } from '../services/geminiApi';

interface ApiKeyModalProps {
  onClose: () => void;
}

export const ApiKeyModal = ({ onClose }: ApiKeyModalProps) => {
  const [apiKey, setApiKeyValue] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      setApiKey(apiKey);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">Setup Required</h2>
          <button
            className="close-button"
            onClick={onClose}
            type="button"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            To start creating amazing images with AI, you'll need to set up your Google Gemini API key. It's free and takes just a few minutes!
          </p>

          <div className="api-setup-guide">
            <h3 className="guide-title">
              <svg className="guide-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,6V8H13V6H11M11,10V18H13V10H11Z"/>
              </svg>
              Quick Setup Guide
            </h3>
            <ol className="guide-steps">
              <li>
                Visit{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="guide-link"
                >
                  Google AI Studio
                </a>{' '}
                and sign in with your Google account
              </li>
              <li>Click "Create API key" in the left sidebar</li>
              <li>Choose a project or create a new one</li>
              <li>Copy the generated API key</li>
              <li>Paste it below and click "Save API Key"</li>
            </ol>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-field">
              <label htmlFor="apiKey">Gemini API Key</label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKeyValue(e.target.value)}
                placeholder="Paste your API key here..."
                required
                disabled={isSubmitting}
                autoComplete="off"
                aria-describedby="api-key-help"
              />
              <small id="api-key-help" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                Your API key is stored locally and never sent to our servers
              </small>
            </div>

            {error && (
              <div className="status-message status-error">
                <svg className="status-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <div>
                  <strong>Invalid API Key</strong>
                  <p>{error}</p>
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!apiKey.trim() || isSubmitting}
                className={`btn-primary ${isSubmitting ? 'btn-loading' : ''}`}
              >
                {isSubmitting ? 'Saving...' : 'Save API Key'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};