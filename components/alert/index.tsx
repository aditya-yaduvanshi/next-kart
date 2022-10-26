import React, { PropsWithChildren } from 'react';
import styles from './alert.module.css';

export type AlertProps = PropsWithChildren & {
  type: 'success' | 'warning' | 'error';
}

const Alert: React.FC<AlertProps> = ({children, type}) => {
  return (
    <>
      <p className={`${styles.alert} ${styles[type]}`}>{children}</p>
    </>
  )
}

export default React.memo(Alert);