export const openImage = (imageUrl: string): void => {
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
};