import './index.css';
import { CSSProperties, ReactNode } from 'react';

interface ICard {
  children?: ReactNode;
  containerStyle?: CSSProperties;
}

const Card = ({ children, containerStyle }: ICard) => {
  return (
    <div className="card-container" style={containerStyle}>
      <div className="card-content">{children}</div>
    </div>
  );
};

export default Card;
