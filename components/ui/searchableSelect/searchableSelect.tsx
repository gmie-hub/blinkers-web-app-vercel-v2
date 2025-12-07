import { Input, Select } from 'antd';
import { Field, FieldProps } from 'formik';
import { FC, useMemo, useState } from 'react';
import styles from './styles.module.scss';

interface OptionType {
  value: number;
  label: string;
}

interface SearchableSelectProps {
  name: string;
  label?: string;
  options: OptionType[] | any;
  placeholder?: string;
  onSearchChange?: (value: string) => void; // Handle search input change
  onChange?: (value: number) => void; // Optional onChange prop
}

const SearchableSelect: FC<SearchableSelectProps> = ({
  label,
  name,
  options,
  placeholder,
  onSearchChange,
  onChange,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const filteredOptions = useMemo(
    () => options.filter((option:any) => option.label.toLowerCase().includes(searchValue.toLowerCase())),
    [searchValue, options],
  );

  return (
    <Field name={name}>
      {({ field, form, meta }: FieldProps) => (
        <div className={styles.wrapper}>
          <label>{label}</label>

          <Select
            {...field}
            className={styles.select}
            placeholder={placeholder}
            dropdownRender={(menu) => (
              <>
                {/* Custom search input inside dropdown */}
                <Input
                  placeholder="Search"
                  value={searchValue}
                  onChange={(e) => {
                    const newSearchValue = e.target.value;
                    setSearchValue(newSearchValue);
                    if (onSearchChange) onSearchChange(newSearchValue); // Notify parent of search change
                  }}
                  style={{ marginBottom: 8 }}
                />
                {menu}
              </>
            )}
            options={filteredOptions}
            onChange={(value) => {
              form.setFieldValue(field.name, value); // Update Formik field value
              if (onChange) onChange(value); // Call onChange if provided
            }}
            onBlur={() => form.setFieldTouched(field.name, true)}
          />

          {meta.touched && meta.error && <div className={styles.error}>{meta.error}</div>}
        </div>
      )}
    </Field>
  );
};

export default SearchableSelect;
