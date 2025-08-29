interface IconProps {
  className?: string;
  size?: number;
}

export const CheckCircleIcon = ({ className = "status-icon", size = 20 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

export const ErrorIcon = ({ className = "status-icon", size = 20 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);