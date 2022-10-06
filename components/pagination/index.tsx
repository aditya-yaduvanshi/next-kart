import React from 'react';
import styles from './pagination.module.css';

export type PaginationProps = {
  page: number;
  onPrev: () => void;
  onNext: () => void;
}

const Pagination: React.FC<PaginationProps> = ({onNext, onPrev, page}) => {
  return (
    <>
      <footer className={styles.pagination}>
        <button className={styles.button} onClick={onPrev}>Prev</button>
        <span className={`${styles.button} ${styles.page}`}>{page}</span>
        <button className={styles.button} onClick={onNext}>Next</button>
      </footer>
    </>
  )
}

export default React.memo(Pagination);