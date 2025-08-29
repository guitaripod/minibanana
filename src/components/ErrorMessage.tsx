import { ErrorIcon } from './icons';

interface ErrorMessageProps {
  title: string;
  message: string;
  className?: string;
}

export const ErrorMessage = ({ title, message, className = "status-message status-error" }: ErrorMessageProps) => {
  return (
    <div className={className}>
      <ErrorIcon />
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
    </div>
  );
};