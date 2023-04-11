import { CSSProperties, ReactNode, StyleHTMLAttributes } from 'react';
import './index.css';

interface IButton {
  children?: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
}

const SecondaryButton = ({ children, style, onClick }: IButton) => {
  return (
    <button
      type="button"
      className="secondary-button"
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
