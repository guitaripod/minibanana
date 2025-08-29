export const extractImageData = (data: any): string => {
  // Check if we have a valid response structure
  if (!data || !data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
    console.error('Invalid response structure:', data);
    throw new Error('Invalid response from the API. Please try again.');
  }

  const candidate = data.candidates[0];

  // Check finish reason for blocked content
  if (candidate.finishReason) {
    switch (candidate.finishReason) {
      case 'PROHIBITED_CONTENT':
        throw new Error('This content was blocked by Google\'s safety policies. This could be due to your prompt or uploaded image. Please try rephrasing your request or using different content.');
      case 'SAFETY':
        throw new Error('This request was blocked by Google\'s safety filters. Please try a different prompt or image.');
      case 'RECITATION':
        throw new Error('This request was blocked by Google\'s content policies. Please try rephrasing your request.');
      case 'OTHER':
        throw new Error('This request could not be processed by Google\'s AI. Please try again with a different prompt or image.');
      case 'STOP':
        // This is normal completion, continue processing
        break;
      default:
        console.warn('Unknown finish reason:', candidate.finishReason);
    }
  }

  // Check if the response contains text instead of an image
  if (candidate.content?.parts?.[0]?.text) {
    const textResponse = candidate.content.parts[0].text;
    console.error('AI returned text instead of image:', textResponse);

    // Provide helpful error messages based on the text content
    if (textResponse.toLowerCase().includes('color') || textResponse.toLowerCase().includes('what color')) {
      throw new Error('Please specify the colors and details you want in your image. The AI needs more specific information.');
    } else if (textResponse.toLowerCase().includes('describe') || textResponse.toLowerCase().includes('clarify')) {
      throw new Error('Please provide more details in your prompt. Be specific about what you want to see in the image.');
    } else if (textResponse.toLowerCase().includes('cannot') || textResponse.toLowerCase().includes('unable')) {
      throw new Error('The AI cannot generate this type of image. Please try a different description.');
    } else {
      throw new Error(`The AI responded with: "${textResponse}". Please try rephrasing your prompt with more specific details.`);
    }
  }

  // Look for image data in the response
  let imageData = null;

  if (candidate.content?.parts?.[0]?.inlineData?.data) {
    imageData = candidate.content.parts[0].inlineData.data;
  }
  else if (candidate.content?.parts?.[1]?.inlineData?.data) {
    imageData = candidate.content.parts[1].inlineData.data;
  }
  else if (candidate.content?.parts?.[0]?.inline_data?.data) {
    imageData = candidate.content.parts[0].inline_data.data;
  }
  else if (candidate.content?.parts?.[0]?.data) {
    imageData = candidate.content.parts[0].data;
  }
  else if (data.data) {
    imageData = data.data;
  }

  if (!imageData) {
    console.error('No image data found in response:', JSON.stringify(data, null, 2));
    throw new Error('No image was generated. Please try rephrasing your prompt with more specific details.');
  }

  return `data:image/png;base64,${imageData}`;
};