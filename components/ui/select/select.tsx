import { Field, FieldProps } from 'formik';
import React, { ChangeEventHandler } from 'react';

import styles from './select.module.scss';

interface ComponentProps {
  label?: string;
  name: string;
  displayInput?: string;
  disabled?: boolean;
  bg?: string;
  value?: string;
  asterisk?: boolean;
  onChange?: ChangeEventHandler<HTMLSelectElement> | undefined;
  options?: React.ReactNode;
  placeholder?: string;
}

const Select: React.FC<ComponentProps> = (props) => {
  const { name, label, disabled, options, placeholder, onChange, asterisk = false } = props;

  // const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const value = event.target.value;
  //   setFieldValue(name, value);
  //   if (onChange) {
  //     onChange(event);
  //   }
  // };

  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <div className={styles.container}>
          <label className={styles.label}>
            {asterisk === true ? (
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
              <option value="" >
                {placeholder}
              </option>
            )}
            {options}
          </select>

          {meta.touched && meta.error && <div className={styles.error}>{meta.error}</div>}
        </div>
      )}
    </Field>
  );
};

export default Select;

