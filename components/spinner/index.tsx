import Img from 'components/img';
import React from 'react';
import styles from './spinner.module.css';

type SpinnerProps = {
	className?: string;
};

const Spinner: React.FC<SpinnerProps> = ({className}) => {
	return (
		<>
			<div className={`${styles.loader} ${className}`}>
				<Img src='/loading.gif' alt='loading' width='64' height='64' />
			</div>
		</>
	);
};

export default React.memo(Spinner);
