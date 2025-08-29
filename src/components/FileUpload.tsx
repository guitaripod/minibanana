import { useRef } from 'react';
import { DocumentIcon } from './icons';
import { handleFileDrop, handleDragOver, handleDragLeave, createMockFileChangeEvent } from '../utils/fileUploadUtils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  disabled?: boolean;
  className?: string;
  text?: string;
  subtext?: string;
}

export const FileUpload = ({
  onFileSelect,
  accept = "image/*",
  disabled = false,
  className = "file-input-container",
  text = "Drop your image here or click to browse",
  subtext = "Supports PNG, JPG, JPEG, WebP (max 10MB)"
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleFileDrop(e, (file) => {
      const mockEvent = createMockFileChangeEvent(file);
      handleFileChange(mockEvent);
    });
  };

  return (
    <div className={className}>
      <DocumentIcon className="file-input-icon" />
      <div className="file-input-text">{text}</div>
      <div className="file-input-subtext">{subtext}</div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        disabled={disabled}
        className="file-input-hidden"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      />
    </div>
  );
};