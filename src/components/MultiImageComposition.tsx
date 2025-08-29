import { useState } from 'react';
import { generateImageFromTextAndMultipleImages, hasApiKey } from '../services/geminiApi';
import { ApiKeyErrorMessage } from './ApiKeyErrorMessage';
import { ErrorMessage } from './ErrorMessage';
import { FileUpload } from './FileUpload';
import { openImage } from '../utils/imageUtils';
import { CloseIcon } from './icons';

export const MultiImageComposition = () => {
  const [prompt, setPrompt] = useState('');
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null]);
  const [imageUrls, setImageUrls] = useState<(string | null)[]>([null, null, null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (index: number) => (file: File) => {
    const newFiles = [...imageFiles];
    const newUrls = [...imageUrls];
    newFiles[index] = file;
    newUrls[index] = URL.createObjectURL(file);
    setImageFiles(newFiles);
    setImageUrls(newUrls);
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newUrls = [...imageUrls];
    if (newUrls[index]) {
      URL.revokeObjectURL(newUrls[index]!);
    }
    newFiles[index] = null;
    newUrls[index] = null;
    setImageFiles(newFiles);
    setImageUrls(newUrls);
  };



  const handleGenerate = async () => {
    const validFiles = imageFiles.filter(file => file !== null) as File[];

    if (validFiles.length < 2) {
      setError('Please select at least 2 images to combine.');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter composition instructions for combining the images.');
      return;
    }

    if (prompt.trim().length < 3) {
      setError('Please provide more detailed composition instructions (at least 3 characters).');
      return;
    }

    if (prompt.trim().length > 1000) {
      setError('Composition instructions are too long. Please keep them under 1000 characters.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = await generateImageFromTextAndMultipleImages(prompt.trim(), validFiles);
      setImageUrls(prev => {
        const newUrls = [...prev];
        newUrls[3] = url;
        return newUrls;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compose images');
    } finally {
      setLoading(false);
    }
  };

  const handleNewTask = () => {
    setPrompt('');
    setImageFiles([null, null, null]);
    setImageUrls([null, null, null, null]);
    setError(null);
    setLoading(false);
  };

  const validFilesCount = imageFiles.filter(file => file !== null).length;

  if (!hasApiKey()) {
    return (
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Multi-Image Composition</h2>
          <p className="section-description">Combine multiple images into one composition</p>
        </div>
        <ApiKeyErrorMessage />
      </div>
    );
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h2 className="section-title">Multi-Image Composition</h2>
        <p className="section-description">Upload 2-3 images and describe how to combine them</p>
      </div>

      <div className="input-section">
        <div className="input-group">
          <div className="form-field">
            <label>Upload Images (2-3 required)</label>
            <div className="multi-image-grid">
              {[0, 1, 2].map((index) => (
                <div key={index} className="image-upload-slot">
                    {!imageUrls[index] ? (
                      <FileUpload
                        onFileSelect={handleFileChange(index)}
                        disabled={loading}
                        text={`Image ${index + 1}`}
                        subtext="Drop or click"
                      />
                   ) : (
                    <div className="image-result">
                      <img
                        src={imageUrls[index]!}
                        alt={`Uploaded image ${index + 1}`}
                        className="result-image"
                        style={{ maxHeight: '200px' }}
                      />
                      <button
                        className="result-btn"
                        onClick={() => handleRemoveImage(index)}
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          background: 'rgba(0,0,0,0.7)',
                          padding: '0.25rem',
                          width: 'auto',
                          minWidth: 'auto'
                        }}
                      >
                         <CloseIcon size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="composition-prompt">Composition Instructions</label>
            <textarea
              id="composition-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Combine the elements from these images into a new scene, place the product on the model, create a collage..."
              rows={4}
              disabled={loading}
              aria-describedby="composition-help"
            />
            <small id="composition-help" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
              Describe how to combine the uploaded images
            </small>
          </div>

          <div className="action-buttons">
            <button
              className={`btn-primary ${loading ? 'btn-loading' : ''}`}
              onClick={handleGenerate}
              disabled={loading || !prompt.trim() || validFilesCount < 2}
            >
              {!loading && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              )}
              <span className="btn-content">
                {loading ? 'Composing...' : 'Compose Images'}
              </span>
            </button>
            {imageUrls[3] && (
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
         <ErrorMessage
           title="Composition Failed"
           message={error}
         />
       )}

      {imageUrls[3] && (
        <div className="result-section">
          <div className="image-result">
            <img
              src={imageUrls[3]!}
              alt="Composed image"
              className="result-image"
              onClick={() => openImage(imageUrls[3]!)}
            />
            <div
              className="image-overlay"
              onClick={() => openImage(imageUrls[3]!)}
              style={{ cursor: 'pointer' }}
            >
              <span>Click to view full size</span>
            </div>
          </div>

          <div className="result-actions">
            <a
              href={imageUrls[3]!}
              download="composed-image.png"
              className="result-btn"
            >
              <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              Download Image
            </a>
            <button
              className="result-btn"
              onClick={() => navigator.clipboard.writeText(imageUrls[3]!)}
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