import { useState } from 'react';
import { generateImageFromTextAndImage, hasApiKey } from '../services/geminiApi';
import { ApiKeyErrorMessage } from './ApiKeyErrorMessage';
import { ErrorMessage } from './ErrorMessage';
import { FileUpload } from './FileUpload';
import { openImage } from '../utils/imageUtils';
import { CloseIcon } from './icons';

export const ImageEdit = () => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasEdited, setHasEdited] = useState(false);

  const handleFileChange = (file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setHasEdited(false);
  };

  const handleGenerate = async () => {
    if (!imageFile) {
      setError('Please select an image to edit first.');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter editing instructions for the image.');
      return;
    }

    if (prompt.trim().length < 3) {
      setError('Please provide more detailed editing instructions (at least 3 characters).');
      return;
    }

    if (prompt.trim().length > 1000) {
      setError('Editing instructions are too long. Please keep them under 1000 characters.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = await generateImageFromTextAndImage(prompt.trim(), imageFile);
      setImageUrl(url);
      setHasEdited(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to edit image');
    } finally {
      setLoading(false);
    }
  };

  const handleNewTask = () => {
    setPrompt('');
    setImageFile(null);
    setImageUrl(null);
    setError(null);
    setLoading(false);
    setHasEdited(false);
  };

  if (!hasApiKey()) {
    return (
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Image Editing</h2>
          <p className="section-description">Transform existing images with AI-powered editing</p>
        </div>
        <ApiKeyErrorMessage />
      </div>
    );
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h2 className="section-title">Image Editing</h2>
        <p className="section-description">Upload an image and describe how you'd like to transform it</p>
      </div>

      <div className="input-section">
        <div className="input-group">
          <div className="form-field">
            <label htmlFor="image-upload">Upload Image</label>
            {!imageFile ? (
              <FileUpload
                onFileSelect={handleFileChange}
                disabled={loading}
              />
            ) : (
              <div className="image-result">
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : ''}
                  alt="Selected image for editing"
                  className="result-image"
                  style={{ maxHeight: '200px' }}
                />
                <button
                  className="result-btn"
                  onClick={() => {
                    setImageFile(null);
                    setImageUrl(null);
                    setPrompt('');
                    setHasEdited(false);
                  }}
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

          <div className="form-field">
            <label htmlFor="edit-prompt">Editing Instructions</label>
            <textarea
              id="edit-prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Add a sunset background, make it look like a painting, change the colors to blue and gold..."
              rows={4}
              disabled={loading}
              aria-describedby="edit-help"
            />
            <small id="edit-help" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
              Describe the changes you want to make to your image
            </small>
          </div>

          <div className="action-buttons">
            <button
              className={`btn-primary ${loading ? 'btn-loading' : ''}`}
              onClick={handleGenerate}
              disabled={loading || !prompt.trim() || !imageFile}
            >
              {!loading && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              )}
              <span className="btn-content">
                {loading ? 'Transforming...' : 'Edit Image'}
              </span>
            </button>
      {hasEdited && imageUrl && (
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
           title="Editing Failed"
           message={error}
         />
       )}

       {hasEdited && imageUrl && (
         <div className="result-section">
           <div className="image-result">
               <img
                 src={imageUrl}
                 alt="Edited image"
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
               download="edited-image.png"
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