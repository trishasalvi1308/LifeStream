import React from 'react';
import clsx from 'clsx';
import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, glass, className, ...props }) => {
  return (
    <div className={clsx(styles.card, { [styles.glass]: glass }, className)} {...props}>
      {children}
    </div>
  );
};
