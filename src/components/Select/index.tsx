import './index.css';
import { faCircleChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSProperties, ReactNode, useState } from 'react';

export interface ISelectItemProps {
  value: string;
  message: string;
}

export interface ISelectProps {
  children?: ReactNode;
  label?: string;
  items?: Array<ISelectItemProps>;
  containerStyle?: CSSProperties;
  onSelect?: (item: ISelectItemProps) => void;
}

const Select = ({
  children,
  label,
  items,
  containerStyle,
  onSelect,
}: ISelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="select-container" style={containerStyle}>
      <div>{label && <span className="select-button-label">{label}</span>}</div>
      <button
        type="button"
        className="select-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faCircleChevronDown} /> {children}
      </button>
      {isOpen && (
        <div className="select-options-container">
          {items?.map((item) => (
            <div
              key={item.value}
              className="select-options-item"
              onClick={() => {
                if (onSelect) onSelect(item);
                setIsOpen(false);
              }}
              aria-hidden="true"
            >
              {item.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
