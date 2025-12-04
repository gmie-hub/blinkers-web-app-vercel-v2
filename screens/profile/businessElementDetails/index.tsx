import styles from './index.module.scss';

interface BusinessDetailsElementsProps {
  title: string;
  name: string | JSX.Element |any;
  icon?: JSX.Element;
}
export default function BusinessDetailsElements({ title, name, icon }: BusinessDetailsElementsProps) {
  return (
    <div className={styles.wrapper}>
      <h4>{title}</h4>
      <div>
        <p>{name}</p>
        {icon && <span>{icon}</span>}
      </div>
    </div>
  );
}
