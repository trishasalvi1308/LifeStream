import React, { useId } from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ElementType;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, className, id, ...props }, ref) => {
    const defaultId = useId();
    const inputId = id || defaultId;

    return (
      <div className={clsx(styles.container, className)}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputWrapper}>
          {Icon && <Icon className={styles.icon} />}
          <input
            id={inputId}
            ref={ref}
            className={clsx(styles.input, { [styles.withIcon]: !!Icon })}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
