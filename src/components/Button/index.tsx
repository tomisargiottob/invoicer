import { CSSProperties, ReactNode } from 'react';
import './index.css';

interface IButton {
  children?: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({ children, style, onClick, disabled }: IButton) => {
  return (
    <button type="button" className="button" style={style} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
