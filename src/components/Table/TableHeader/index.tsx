import { ReactNode } from 'react';
import './index.css';

interface ITableHeader {
  children?: ReactNode;
  width?: string | number;
  minWidth?: string | number;
}

const TableHeader = ({ children, width, minWidth }: ITableHeader) => {
  return (
    <th className="table-header-title" style={{ width, minWidth }}>
      {children}
    </th>
  );
};

export default TableHeader;
