import { useState, ReactNode } from "react";
import { InputHTMLAttributes } from "react";
import { Image } from "antd";
import styles from "./index.module.scss";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  width?: string;
  onButtonClick?: (value: string) => void; // Callback for the button click
  children?: ReactNode; // To allow passing custom buttons or other elements
}

const SearchInput: React.FC<Props> = ({
  placeholder,
  width,
  onButtonClick,
  onChange,
  children,
  ...rest
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    // Call onChange if provided
    onChange?.(e);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onButtonClick) {
      onButtonClick(inputValue);
    } else {
      console.log("User input:", inputValue);
    }
  };

  return (
    <form
      className={styles.searchContainer}
      onSubmit={handleSubmit}
      style={{ width }}
    >
      {/* Search Icon */}
      <button className={styles.searchIcon} type="submit">
        <Image width={12} src="/Search.svg" alt="SearchIcon" preview={false} />
      </button>

      {/* Input Field */}
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder || "Search"}
        value={inputValue}
        onChange={handleInputChange}
        {...rest}
      />

      {/* Render Children (Optional Button or Other Content) */}
      {children}
    </form>
  );
};

export default SearchInput;
