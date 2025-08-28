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

  if (!hasApiKey()) {
    return (
      <div className="section">
        <h2>Text to Image</h2>
        <div className="api-key-required">
          <p>Please set up your Gemini API key to use this feature.</p>
          <p>Get your free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <h2>Text to Image</h2>
      <div className="input-group">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate..."
          rows={4}
          disabled={loading}
        />
        <button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {imageUrl && (
        <div className="result">
          <img src={imageUrl} alt="Generated" />
          <a href={imageUrl} download="generated-image.png">
            Download Image
          </a>
        </div>
      )}
    </div>
  );
};