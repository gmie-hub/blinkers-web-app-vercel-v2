import styles from './styles.module.scss';

interface JobDetailsElementsProps {
  title: string;
  name?: string | JSX.Element;
  icon?: JSX.Element;
}
export default function JobDetailsElements({ title, name, icon }: JobDetailsElementsProps) {
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
