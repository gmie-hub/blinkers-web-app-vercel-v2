import { useField } from "formik";
import styles from "./checkBox.module.scss";

interface CheckboxProps {
  label: string;
  name: string;
  isChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Optional onChange prop
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  name,
  isChecked,
  onChange,
  ...props
}) => {
  const [field, meta] = useField({ name, type: "checkbox" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e); // Call Formik's internal onChange
    if (onChange) {
      onChange(e); // Call the custom onChange if provided
    }
  };

  return (
    <div className={styles.checkAndLabel}>
      <input
        type="checkbox"
        id={name}
        {...field}
        {...props}
        checked={isChecked || field.value} // Ensure proper binding
        onChange={handleChange} // Use the combined onChange handler
        className={styles.check}
      />
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      {meta.touched && meta.error && (
        <div className={styles.error}>{meta.error}</div> // Display error message if any
      )}
    </div>
  );
};

export default Checkbox;
