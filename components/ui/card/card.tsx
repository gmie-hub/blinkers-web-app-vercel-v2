import  { FC, PropsWithChildren } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';

interface CardProps extends PropsWithChildren {
  style?: string;
  showBorder?: boolean;
  title?: JSX.Element;
  onClick?: () => void
}

const Card: FC<CardProps> = ({ children, style, showBorder = true, title, onClick }) => {
  return (
    <div onClick={onClick} className={classNames(styles.card, style, showBorder ? '' : styles.no_border)}>
      {title}
      {children}
    </div>
  );
};

export default Card;
