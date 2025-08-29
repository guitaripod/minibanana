export const handleFileDrop = (
  e: React.DragEvent<HTMLDivElement>,
  callback: (file: File) => void
) => {
  e.preventDefault();
  e.currentTarget.parentElement?.classList.remove('drag-over');

  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    callback(file);
  }
};

export const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.currentTarget.parentElement?.classList.add('drag-over');
};

export const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.currentTarget.parentElement?.classList.remove('drag-over');
};

export const createMockFileChangeEvent = (file: File): React.ChangeEvent<HTMLInputElement> => {
  return {
    target: { files: [file] }
  } as unknown as React.ChangeEvent<HTMLInputElement>;
};