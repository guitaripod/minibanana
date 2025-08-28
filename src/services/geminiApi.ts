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
  const request: GenerateImageRequest = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  const apiKey = getApiKey();

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
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('API Response:', data);

  let imageData = null;

  if (data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
    imageData = data.candidates[0].content.parts[0].inlineData.data;
  }
  else if (data.candidates?.[0]?.content?.parts?.[1]?.inlineData?.data) {
    imageData = data.candidates[0].content.parts[1].inlineData.data;
  }
  else if (data.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data) {
    imageData = data.candidates[0].content.parts[0].inline_data.data;
  }
  else if (data.candidates?.[0]?.content?.parts?.[0]?.data) {
    imageData = data.candidates[0].content.parts[0].data;
  }
  else if (data.data) {
    imageData = data.data;
  }

  if (!imageData) {
    console.error('Response structure:', JSON.stringify(data, null, 2));
    throw new Error('No image data in response. Check console for response details.');
  }

  return `data:image/png;base64,${imageData}`;
};

export const generateImageFromTextAndImage = async (
  prompt: string,
  imageFile: File
): Promise<string> => {
  const base64 = await fileToBase64(imageFile);

  const request: GenerateImageRequest = {
    contents: [{
      parts: [
        { text: prompt },
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
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('API Response:', data);

  let imageData = null;

  if (data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
    imageData = data.candidates[0].content.parts[0].inlineData.data;
  }
  else if (data.candidates?.[0]?.content?.parts?.[1]?.inlineData?.data) {
    imageData = data.candidates[0].content.parts[1].inlineData.data;
  }
  else if (data.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data) {
    imageData = data.candidates[0].content.parts[0].inline_data.data;
  }
  else if (data.candidates?.[0]?.content?.parts?.[0]?.data) {
    imageData = data.candidates[0].content.parts[0].data;
  }
  else if (data.data) {
    imageData = data.data;
  }

  if (!imageData) {
    console.error('Response structure:', JSON.stringify(data, null, 2));
    throw new Error('No image data in response. Check console for response details.');
  }

  return `data:image/png;base64,${imageData}`;
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};