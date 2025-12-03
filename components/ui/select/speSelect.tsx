
import { Field, FieldProps } from 'formik';
import React, { ChangeEventHandler, ReactNode } from 'react';
import styles from './select.module.scss';

interface Option {
  label: string;
  value: string;
}

interface ComponentProps {
  label?: string;
  name: string;
  displayInput?: string;
  disabled?: boolean;
  bg?: string;
  value?: string;
  asterisk?: boolean;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  options?: Option[] | ReactNode; // supports both formats
  placeholder?: string;
}

const SpecificationSelect: React.FC<ComponentProps> = (props) => {
  const { name, label, disabled, options, placeholder, onChange, asterisk = false } = props;

  // Determine if options is an array of objects or React nodes
  const renderOptions = () => {
    if (Array.isArray(options)) {
      return options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ));
    }

    return options; // fallback to ReactNode (previous usage)
  };

  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <div className={styles.container}>
          <label className={styles.label}>
            {asterisk ? (
              <span>
                {label}
                <sup className={styles.asterisk}>*</sup>
              </span>
            ) : (
              label
            )}
          </label>

          <select {...field} disabled={disabled} className={styles.select} onChange={onChange}>
            {!meta.value && (
              <option value="">
                {placeholder}
              </option>
            )}

            {renderOptions()}
          </select>

          {meta.touched && meta.error && <div className={styles.error}>{meta.error}</div>}
        </div>
      )}
    </Field>
  );
};

export default SpecificationSelect;
