import { ReactNode } from 'react';
import './index.css';

interface ITitle {
  children?: ReactNode;
}

const Title = ({ children }: ITitle) => {
  return <span className="title">{children}</span>;
};

export default Title;
