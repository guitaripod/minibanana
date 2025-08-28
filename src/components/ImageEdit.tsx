import { useState, useRef } from 'react';
import { generateImageFromTextAndImage } from '../services/geminiApi';

export const ImageEdit = () => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !imageFile) return;

    setLoading(true);
    setError(null);

    try {
      const url = await generateImageFromTextAndImage(prompt, imageFile);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to edit image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2>Image Editing</h2>
      <div className="input-group">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          disabled={loading}
        />
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe how to edit the image..."
          rows={4}
          disabled={loading}
        />
        <button onClick={handleGenerate} disabled={loading || !prompt.trim() || !imageFile}>
          {loading ? 'Editing...' : 'Edit Image'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {imageUrl && (
        <div className="result">
          <img src={imageUrl} alt="Edited" />
          {!imageUrl.startsWith('blob:') && (
            <a href={imageUrl} download="edited-image.png">
              Download Image
            </a>
          )}
        </div>
      )}
    </div>
  );
};