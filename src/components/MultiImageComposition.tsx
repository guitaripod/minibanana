import { useState } from 'react';
import { generateImageFromTextAndMultipleImages, hasApiKey } from '../services/geminiApi';
import { ApiKeyErrorMessage } from './ApiKeyErrorMessage';
import { ErrorMessage } from './ErrorMessage';
import { openImage } from '../utils/imageUtils';
import { handleMultipleFileDrop, handleDragOver, handleDragLeave } from '../utils/fileUploadUtils';

export const MultiImageComposition = () => {
  const [prompt, setPrompt] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddImages = (files: File[]) => {
    const newFiles = [...imageFiles, ...files];
    const newUrls = [...imageUrls, ...files.map(file => URL.createObjectURL(file))];
    setImageFiles(newFiles);
    setImageUrls(newUrls);
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newUrls = [...imageUrls];
    if (newUrls[index]) {
      URL.revokeObjectURL(newUrls[index]);
    }
    newFiles.splice(index, 1);
    newUrls.splice(index, 1);
    setImageFiles(newFiles);
    setImageUrls(newUrls);
  };



  const handleGenerate = async () => {
    if (imageFiles.length < 2) {
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
      const url = await generateImageFromTextAndMultipleImages(prompt.trim(), imageFiles);
      setImageUrls(prev => [...prev, url]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to compose images');
    } finally {
      setLoading(false);
    }
  };

  const handleNewTask = () => {
    setPrompt('');
    imageUrls.forEach(url => URL.revokeObjectURL(url));
    setImageFiles([]);
    setImageUrls([]);
    setError(null);
    setLoading(false);
  };



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
             <label>Upload Images (2+ required)</label>
             <div
               className="multi-image-drop-zone"
               onDragOver={handleDragOver}
               onDragLeave={handleDragLeave}
               onDrop={(e) => handleMultipleFileDrop(e, handleAddImages)}
             >
               <div className="drop-zone-content">
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" opacity="0.5">
                   <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                 </svg>
                 <div className="drop-zone-text">
                   Drop multiple images here or click to browse
                 </div>
                 <div className="drop-zone-subtext">
                   Supports PNG, JPG, JPEG, WebP (max 10MB each)
                 </div>
                 <input
                   type="file"
                   multiple
                   accept="image/*"
                   onChange={(e) => {
                     const files = Array.from(e.target.files || []);
                     handleAddImages(files);
                     e.target.value = '';
                   }}
                   disabled={loading}
                   className="file-input-hidden"
                 />
               </div>
             </div>
             {imageUrls.length > 0 && (
               <div className="uploaded-images-grid">
                 {imageUrls.map((url, index) => (
                   <div key={index} className="uploaded-image-item">
                     <img
                       src={url}
                       alt={`Uploaded image ${index + 1}`}
                       className="uploaded-image"
                     />
                     <button
                       className="remove-image-btn"
                       onClick={() => handleRemoveImage(index)}
                       title="Remove image"
                     >
                       ×
                     </button>
                   </div>
                 ))}
               </div>
             )}
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
              disabled={loading || !prompt.trim() || imageFiles.length < 2}
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
            {imageUrls.length > imageFiles.length && (
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

       {imageUrls.length > imageFiles.length && (
         <div className="result-section">
           <div className="image-result">
             <img
               src={imageUrls[imageUrls.length - 1]}
               alt="Composed image"
               className="result-image"
               onClick={() => openImage(imageUrls[imageUrls.length - 1])}
             />
             <div
               className="image-overlay"
               onClick={() => openImage(imageUrls[imageUrls.length - 1])}
               style={{ cursor: 'pointer' }}
             >
               <span>Click to view full size</span>
             </div>
           </div>

           <div className="result-actions">
             <a
               href={imageUrls[imageUrls.length - 1]}
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
               onClick={() => navigator.clipboard.writeText(imageUrls[imageUrls.length - 1])}
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