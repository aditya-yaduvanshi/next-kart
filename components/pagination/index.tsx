import React from 'react';
import styles from './pagination.module.css';

export type PaginationProps = {
  page: number;
  onPrev?: () => void;
  onNext?: () => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({onNext, onPrev, page, className}) => {
  return (
    <>
      <div className={`${styles.pagination} ${className ?? ''}`}>
        <button className={styles.button} disabled={typeof onPrev !== 'function'} onClick={onPrev}>Prev</button>
        <span className={`${styles.button} ${styles.page}`}>{page}</span>
        <button className={styles.button} disabled={typeof onNext !== 'function'} onClick={onNext}>Next</button>
      </div>
    </>
  )
}

export default React.memo(Pagination);