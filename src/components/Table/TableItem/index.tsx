import { ReactNode } from 'react';
import './index.css';

interface TableItemProps {
  children?: ReactNode;
  textAlign?: 'center' | 'right' | 'left';
}

const TableItem = ({ children, textAlign = 'center' }: TableItemProps) => {
  return (
    <td style={{ textAlign }} className="table-item-data">
      {children}
    </td>
  );
};

export default TableItem;
