import { CSSProperties, ReactNode } from 'react';
import './index.css';

interface IButton {
  children?: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button = ({ children, style, onClick, disabled, className }: IButton) => {
  return (
    <button className={`button ${className}`} type="button"style={style} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
