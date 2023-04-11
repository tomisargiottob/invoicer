import './index.css';
import React,{ ChangeEventHandler, CSSProperties } from 'react';

interface TextAreaProps {
  label?: string;
  containerStyle?: CSSProperties;
  inputStyle?: CSSProperties;
  value?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  type?: string;
  placeholder?: string;
}

const TextArea = ({
  label,
  containerStyle,
  inputStyle,
  value,
  onChange,
  type = 'text',
  placeholder,
}: TextAreaProps) => {
  return (
    <div className="input-container" style={containerStyle}>
      {label && <span className="input-label">{label}</span>}
      <textarea
        style={inputStyle}
        className="input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextArea;
