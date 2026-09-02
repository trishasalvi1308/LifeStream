import React from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'inverted' | 'outlined' | 'ghost';
  icon?: React.ElementType;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon: Icon,
  isLoading,
  className,
  ...props 
}) => {
  return (
    <button 
      className={clsx(styles.button, styles[variant], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className={styles.icon}>...</span>
      ) : Icon ? (
        <Icon className={styles.icon} />
      ) : null}
      {children}
    </button>
  );
};
