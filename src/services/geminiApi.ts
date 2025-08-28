const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';

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

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': API_KEY,
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

  // Try different possible response structures
  let imageData = null;

  // Check for the correct structure (inlineData with mimeType)
  if (data.candidates?.[0]?.content?.parts?.[1]?.inlineData?.data) {
    imageData = data.candidates[0].content.parts[1].inlineData.data;
  }
  // Check for alternative structure (inline_data)
  else if (data.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data) {
    imageData = data.candidates[0].content.parts[0].inline_data.data;
  }
  // Check for alternative structure (data field)
  else if (data.candidates?.[0]?.content?.parts?.[0]?.data) {
    imageData = data.candidates[0].content.parts[0].data;
  }
  // Check for direct data field
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
  // Convert image to base64
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

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': API_KEY,
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

  // Try different possible response structures
  let imageData = null;

  // Check for the correct structure (inlineData with mimeType)
  if (data.candidates?.[0]?.content?.parts?.[1]?.inlineData?.data) {
    imageData = data.candidates[0].content.parts[1].inlineData.data;
  }
  // Check for alternative structure (inline_data)
  else if (data.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data) {
    imageData = data.candidates[0].content.parts[0].inline_data.data;
  }
  // Check for alternative structure (data field)
  else if (data.candidates?.[0]?.content?.parts?.[0]?.data) {
    imageData = data.candidates[0].content.parts[0].data;
  }
  // Check for direct data field
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
      // Remove the data:image/...;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};