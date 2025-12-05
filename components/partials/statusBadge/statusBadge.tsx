import { FC } from 'react';
import styles from './statusBadge.module.scss';

interface ComponentProp {
  status: string;
}


const StatusBadge: FC<ComponentProp> = ({ status }) => {
  let style;

  switch (status) {
    case 'InActive':
      style = styles.pending;
      break;
    case 'Suspended':
      style = styles.pending;
      break;
    case 'Banned':
      style = styles.unapproved;
      break;
    case 'Closed':
      style = styles.unapproved;
      break;
    case 'Rejected':
      style = styles.unapproved;
      break;
      case 'Open':
        style = styles.approved;
        break;
    default:
      style = styles.approved;
  }

  return (
    <div className={style}>
      <div className={styles.dot}></div>
      <p>{status}</p>
    </div>
  );
};

export default StatusBadge;
