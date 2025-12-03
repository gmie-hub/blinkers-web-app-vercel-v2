import { Field, FieldProps } from "formik";
import React, { useState } from "react";
import styles from "./input.module.scss";
import classNames from "classnames";

interface ComponentProps {
  maxLength?: number;
  label?: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  asterisk?: boolean;
  className?: string;
  icon?: React.ReactNode;
  deleteIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string; // You might not need this unless for custom behavior
}

const Input: React.FC<ComponentProps> = (props) => {
  const {
    icon,
    deleteIcon,
    className,
    name,
    label,
    disabled,
    type,
    placeholder,
    asterisk = false,
    onChange,
  } = props;
  const [isShowPassword, setIsShowPassword] = useState(false);

  const showPasswordHandle = () => {
    setIsShowPassword((prevState) => !prevState);
  };

  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => (
        <div>
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

          <div className={styles.wrapper}>
            {type !== "textarea" ? (
              <div className={styles.inputContainer}>
                {deleteIcon && (
                  <span className={styles.iconRight}>{deleteIcon}</span>
                )}

                <input
                  {...field} // This binds the input to Formik
                  type={isShowPassword && type === "password" ? "text" : type}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={classNames(styles.input, className)}
                  onChange={(e) => {
                    field.onChange(e); // Call Formik's handler
                    onChange?.(e); // Call the custom handler if provided
                  }}
                />
                {icon && <span className={styles.iconRight}>{icon}</span>}
                {type === "password" && (
                  <span
                    className={styles.showToggle}
                    onClick={showPasswordHandle}
                    role="button"
                    aria-label={
                      isShowPassword ? "Hide password" : "Show password"
                    }
                  >
                    {isShowPassword ? "👁️" : "👁️‍🗨️"}
                  </span>
                )}
              </div>
            ) : (
              <textarea
                className={styles.textarea}
                {...field}
                placeholder={placeholder}
                rows={4}
                disabled={disabled}
              />
            )}

            {meta.touched && meta.error && (
              <div className={styles.error}>{meta.error}</div>
            )}
          </div>
        </div>
      )}
    </Field>
  );
};

export default Input;
