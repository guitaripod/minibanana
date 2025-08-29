import { useState, useRef } from 'react';
import { generateImageFromTextAndImage, hasApiKey } from '../services/geminiApi';

export const ImageEdit = () => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasEdited, setHasEdited] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      setHasEdited(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !imageFile) return;

    setLoading(true);
    setError(null);

    try {
      const url = await generateImageFromTextAndImage(prompt, imageFile);
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
        <h2 className="section-title">Image Editing</h2>
        <p className="section-description">Upload an image and describe how you'd like to transform it</p>
      </div>

      <div className="input-section">
        <div className="input-group">
          <div className="form-field">
            <label htmlFor="image-upload">Upload Image</label>
            {!imageFile ? (
              <div
                className="file-input-container"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('drag-over');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('drag-over');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('drag-over');
                   const file = e.dataTransfer.files[0];
                   if (file && file.type.startsWith('image/')) {
                     const mockEvent = {
                       target: { files: [file] }
                     } as unknown as React.ChangeEvent<HTMLInputElement>;
                     handleFileChange(mockEvent);
                   }
                }}
              >
                <svg className="file-input-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                <div className="file-input-text">Drop your image here or click to browse</div>
                <div className="file-input-subtext">Supports PNG, JPG, JPEG, WebP (max 10MB)</div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={loading}
                  className="file-input-hidden"
                  id="image-upload"
                />
              </div>
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                  </svg>
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
              {loading ? 'Transforming...' : 'Edit Image'}
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
        <div className="status-message status-error">
          <svg className="status-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <div>
            <strong>Editing Failed</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

       {hasEdited && imageUrl && (
         <div className="result-section">
           <div className="image-result">
              <img
                src={imageUrl}
                alt="Edited image"
                className="result-image"
                onClick={() => {
                  if (imageUrl.startsWith('data:')) {
                    // Convert base64 data URL to blob URL for better browser compatibility
                    const byteString = atob(imageUrl.split(',')[1]);
                    const mimeString = imageUrl.split(',')[0].split(':')[1].split(';')[0];
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    for (let i = 0; i < byteString.length; i++) {
                      ia[i] = byteString.charCodeAt(i);
                    }
                    const blob = new Blob([ab], { type: mimeString });
                    const blobUrl = URL.createObjectURL(blob);
                    window.open(blobUrl, '_blank', 'noopener,noreferrer');
                    // Clean up the blob URL after a delay
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                  } else {
                    window.open(imageUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
              />
              <div
                className="image-overlay"
                onClick={() => {
                  if (imageUrl.startsWith('data:')) {
                    // Convert base64 data URL to blob URL for better browser compatibility
                    const byteString = atob(imageUrl.split(',')[1]);
                    const mimeString = imageUrl.split(',')[0].split(':')[1].split(';')[0];
                    const ab = new ArrayBuffer(byteString.length);
                    const ia = new Uint8Array(ab);
                    for (let i = 0; i < byteString.length; i++) {
                      ia[i] = byteString.charCodeAt(i);
                    }
                    const blob = new Blob([ab], { type: mimeString });
                    const blobUrl = URL.createObjectURL(blob);
                    window.open(blobUrl, '_blank', 'noopener,noreferrer');
                    // Clean up the blob URL after a delay
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                  } else {
                    window.open(imageUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
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