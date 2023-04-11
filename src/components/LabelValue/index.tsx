import { CSSProperties, ReactElement } from 'react';
import './index.css';

interface LabelValueProps {
  label: string;
  value: string | ReactElement;
  containerStyle?: CSSProperties;
}

const LabelValue = ({ label, value, containerStyle }: LabelValueProps) => {
  return (
    <div className="labelvalue-container" style={containerStyle}>
      <span className="labelvalue-label">{label}</span>
      <span className="labelvalue-value">{value}</span>
    </div>
  );
};

export default LabelValue;
