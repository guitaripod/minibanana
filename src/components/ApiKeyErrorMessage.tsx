import { ErrorIcon } from './icons';

export const ApiKeyErrorMessage = () => {
  return (
    <div className="status-message status-error">
      <ErrorIcon />
      <div>
        <strong>API Key Required</strong>
        <p>Please set up your Gemini API key to use this feature. Get your free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="guide-link">Google AI Studio</a></p>
      </div>
    </div>
  );
};