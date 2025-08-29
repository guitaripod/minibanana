interface IconProps {
  className?: string;
  size?: number;
}

export const StarIcon = ({ className = "btn-icon", size = 20 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

export const EditIcon = ({ className = "btn-icon", size = 20 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>
);

export const DocumentIcon = ({ className = "btn-icon", size = 20 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
  </svg>
);

export const DownloadIcon = ({ className = "btn-icon", size = 20 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
  </svg>
);

export const CopyIcon = ({ className = "btn-icon", size = 20 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
  </svg>
);

export const CloseIcon = ({ className = "btn-icon", size = 20 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
  </svg>
);

export const PlusIcon = ({ className = "btn-icon", size = 20 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
  </svg>
);