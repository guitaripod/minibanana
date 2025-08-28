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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>API Key Required</h2>
          <button
            className="close-button"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <p>
            To use the Gemini Image Generator, you need to provide your own Google Gemini API key.
          </p>

          <div className="api-instructions">
            <h3>How to get your API key:</h3>
            <ol>
              <li>
                Visit{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://aistudio.google.com/app/apikey
                </a>
              </li>
              <li>Sign in with your Google account</li>
              <li>Click "Create API key"</li>
              <li>Copy the generated key</li>
              <li>Paste it below</li>
            </ol>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="apiKey">Gemini API Key:</label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKeyValue(e.target.value)}
                placeholder="Enter your API key..."
                required
                disabled={isSubmitting}
              />
            </div>

            {error && <div className="error">{error}</div>}

            <div className="modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="cancel-button"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!apiKey.trim() || isSubmitting}
                className="submit-button"
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