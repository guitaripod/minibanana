import { extractImageData } from '../utils/apiUtils';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';

const getApiKey = (): string => {
  const storedKey = localStorage.getItem('gemini_api_key');

  if (storedKey && storedKey.trim()) {
    return storedKey.trim();
  }

  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim()) {
    console.warn('Using environment API key - this should only happen in development!');
    return envKey.trim();
  }

  throw new Error('API_KEY_MISSING');
};

export const setApiKey = (key: string): void => {
  if (!key || !key.trim()) {
    throw new Error('Invalid API key provided');
  }
  localStorage.setItem('gemini_api_key', key.trim());
};

export const hasApiKey = (): boolean => {
  try {
    getApiKey();
    return true;
  } catch {
    return false;
  }
};

export const clearApiKey = (): void => {
  localStorage.removeItem('gemini_api_key');
};

interface GenerateImageRequest {
  contents: {
    parts: Array<{ text: string } | { inline_data: { mime_type: string; data: string } }>;
  }[];
}

export const generateImageFromText = async (prompt: string): Promise<string> => {
  if (!prompt || !prompt.trim()) {
    throw new Error('Please provide a description for the image you want to generate.');
  }

  const request: GenerateImageRequest = {
    contents: [{
      parts: [{ text: prompt.trim() }]
    }]
  };

  const apiKey = getApiKey();

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);

      // Provide specific error messages for common HTTP status codes
      switch (response.status) {
        case 400:
          throw new Error('Invalid request. Please check your prompt and try again.');
        case 401:
          throw new Error('API key is invalid or expired. Please check your API key.');
        case 403:
          throw new Error('Access denied. Your API key may not have the required permissions.');
        case 429:
          throw new Error('Too many requests. Please wait a moment before trying again.');
        case 500:
          throw new Error('Server error. Please try again in a few moments.');
        case 503:
          throw new Error('Service temporarily unavailable. Please try again later.');
        default:
          throw new Error(`Request failed (${response.status}). Please try again.`);
      }
    }

    const data = await response.json();
    console.log('API Response:', data);

    return extractImageData(data);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

export const generateImageFromTextAndImage = async (
  prompt: string,
  imageFile: File
): Promise<string> => {
  if (!prompt || !prompt.trim()) {
    throw new Error('Please provide editing instructions for the image.');
  }

  if (!imageFile) {
    throw new Error('Please select an image to edit.');
  }

  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (imageFile.size > maxSize) {
    throw new Error('Image file is too large. Please use an image smaller than 10MB.');
  }

  let base64: string;
  try {
    base64 = await fileToBase64(imageFile);
  } catch (error) {
    throw new Error('Failed to process the image file. Please try a different image.');
  }

  const request: GenerateImageRequest = {
    contents: [{
      parts: [
        { text: prompt.trim() },
        {
          inline_data: {
            mime_type: imageFile.type,
            data: base64,
          }
        }
      ]
    }]
  };

  const apiKey = getApiKey();

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);

      switch (response.status) {
        case 400:
          throw new Error('Invalid request. Please check your editing instructions and try again.');
        case 401:
          throw new Error('API key is invalid or expired. Please check your API key.');
        case 403:
          throw new Error('Access denied. Your API key may not have the required permissions.');
        case 429:
          throw new Error('Too many requests. Please wait a moment before trying again.');
        case 500:
          throw new Error('Server error. Please try again in a few moments.');
        case 503:
          throw new Error('Service temporarily unavailable. Please try again later.');
        default:
          throw new Error(`Request failed (${response.status}). Please try again.`);
      }
    }

    const data = await response.json();
    console.log('API Response:', data);

    return extractImageData(data);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

export const generateImageFromTextAndMultipleImages = async (
  prompt: string,
  imageFiles: File[]
): Promise<string> => {
  if (!prompt || !prompt.trim()) {
    throw new Error('Please provide composition instructions for combining the images.');
  }

  if (!imageFiles || imageFiles.length < 2) {
    throw new Error('Please select at least 2 images to combine.');
  }

  // Validate all files
  const maxSize = 10 * 1024 * 1024; // 10MB
  for (const file of imageFiles) {
    if (file.size > maxSize) {
      throw new Error(`Image "${file.name}" is too large. Please use images smaller than 10MB.`);
    }
  }

  const parts: Array<{ text: string } | { inline_data: { mime_type: string; data: string } }> = [{ text: prompt.trim() }];

  try {
    for (const file of imageFiles) {
      const base64 = await fileToBase64(file);
      parts.push({
        inline_data: {
          mime_type: file.type,
          data: base64,
        }
      });
    }
  } catch (error) {
    throw new Error('Failed to process one or more image files. Please try different images.');
  }

  const request: GenerateImageRequest = {
    contents: [{
      parts
    }]
  };

  const apiKey = getApiKey();

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);

      switch (response.status) {
        case 400:
          throw new Error('Invalid request. Please check your composition instructions and try again.');
        case 401:
          throw new Error('API key is invalid or expired. Please check your API key.');
        case 403:
          throw new Error('Access denied. Your API key may not have the required permissions.');
        case 429:
          throw new Error('Too many requests. Please wait a moment before trying again.');
        case 500:
          throw new Error('Server error. Please try again in a few moments.');
        case 503:
          throw new Error('Service temporarily unavailable. Please try again later.');
        default:
          throw new Error(`Request failed (${response.status}). Please try again.`);
      }
    }

    const data = await response.json();
    console.log('API Response:', data);

    return extractImageData(data);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const result = reader.result as string;
        if (!result || !result.includes(',')) {
          reject(new Error('Invalid file format'));
          return;
        }
        const base64 = result.split(',')[1];
        if (!base64) {
          reject(new Error('Failed to extract base64 data'));
          return;
        }
        resolve(base64);
      } catch (error) {
        reject(new Error('Failed to process file data'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.onabort = () => {
      reject(new Error('File reading was aborted'));
    };

    try {
      reader.readAsDataURL(file);
    } catch (error) {
      reject(new Error('Failed to start file reading'));
    }
  });
};