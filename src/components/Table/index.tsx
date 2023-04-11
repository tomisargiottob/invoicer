import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './index.css';
import { v4 as uuidv4 } from 'uuid';
import TableHeader from './TableHeader';
import TableItem from './TableItem';
import Spinner from '../Spinner/Spinner';

interface ITable {
  headers: Array<{
    accessor: string;
    title: string;
    width?: string | number;
    minWidth?: string | number;
    textAlign?: 'center' | 'left' | 'right';
  }>;
  values: Array<any>;
  total: number;
  page: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  loading: boolean;
}

const Table = ({
  headers,
  values,
  total,
  page,
  totalPages,
  onChangePage,
  loading
}: ITable) => {
  return (
    <div>
      {loading ? <Spinner></Spinner> : (
      <table className="table-content">
        <thead>
          <tr>
            {headers.map((header) => (
              <TableHeader
                minWidth={header.minWidth}
                width={header.width}
                key={uuidv4()}
              >
                {header.title}
              </TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {
            values.map((value) => (
              <tr key={uuidv4()}>
                {headers.map((header) => (
                  <TableItem key={uuidv4()} textAlign={header.textAlign}>
                    {value[header.accessor]}
                  </TableItem>
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>)}
      <div className="table-pagination">
        <button
          className="table-pagination-button"
          type="button"
          onClick={() => {
            if (page > 1) onChangePage(page - 1);
          }}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <span className="table-pagination-indicator">
          {page} de {totalPages} (Total: {total})
        </span>
        <button
          className="table-pagination-button"
          type="button"
          onClick={() => {
            if (page < totalPages) onChangePage(page + 1);
          }}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

export default Table;
