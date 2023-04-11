import { ReactNode } from 'react';
import './index.css';

interface ErrorProps {
  children?: ReactNode;
}

const ErrorMessage = ({ children }: ErrorProps) => {
  return <div className="error-container">{children}</div>;
};

export default ErrorMessage;
