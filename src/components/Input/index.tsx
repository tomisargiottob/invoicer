import './index.css';
import { ChangeEventHandler, CSSProperties } from 'react';

interface InputProps {
  label?: string;
  containerStyle?: CSSProperties;
  inputStyle?: CSSProperties;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  type?: string;
  placeholder?: string;
  step?: number
}

const Input = ({
  label,
  containerStyle,
  inputStyle,
  value,
  onChange,
  type = 'text',
  placeholder,
  step
}: InputProps) => {
  return (
    <div className="input-container" style={containerStyle}>
      {label && <span className="input-label">{label}</span>}
      <input
        style={inputStyle}
        type={type}
        className="input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        step={step}
      />
    </div>
  );
};

export default Input;
