import React, { FC, PropsWithChildren } from 'react';
import style from './button.module.scss';
import classNames from 'classnames';
import { Spin } from 'antd';

interface ButtonProps extends PropsWithChildren {
  type?: 'button' | 'submit' | 'reset'; // Define specific types for better usage
  onClick?: () => void;
  variant?: 'white' | 'red' | 'green' | 'redOutline' | 'greenOutline' | 'transparent' |'noBg'; // Limit to specific variants
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  AfterTexticon?:React.ReactNode;
  text?: string; // Keep text for backward compatibility
  isLoading?: boolean;
}

const   Button: FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'green', // Default to green if not specified
  type = 'button',
  disabled,
  className,
  icon,
  AfterTexticon,
  text,
  isLoading,
}) => {
  const variantList = {
    white: style.white,
    red: style.red,
    green: style.green,
    redOutline: style.redOutline,
    greenOutline: style.greenOutline,
    transparent: style.transparent,
    noBg: style.noBg,

  };

  const buttonStyle = variantList[variant] || variantList.green; // Fallback to green if variant is invalid

  return (
    <button style={{cursor:'pointer'}} className={classNames(className, buttonStyle)} onClick={onClick} type={type} disabled={disabled}>
      <span>
        {isLoading ? (
          <Spin size="small" className='spinColor' />
        ) : (
          <>
            {icon && <span className={style.icon}>{icon}</span>}
            {text && <span className={style.text}>{text}</span>}
            {AfterTexticon && <span className={style.icon}>{AfterTexticon}</span>}
          </>
        )}

        {children}
      </span>
    </button>
  );
};

export default Button;
