import './index.css';
import StatusTypes from '../../class/Invoice/types/StatusTypes';

interface IStatusLabel {
  status?: StatusTypes;
}

const StatusLabel = ({ status }: IStatusLabel) => {
  return <div className={`status-label status-label-${status}`}>{status}</div>;
};

export default StatusLabel;
