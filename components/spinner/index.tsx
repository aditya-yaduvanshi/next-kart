import Img from 'components/img';
import React from 'react';
import styles from './spinner.module.css';

type SpinnerProps = {
	className?: string;
	size?: string;
};

const Spinner: React.FC<SpinnerProps> = ({className, size='64'}) => {
	return (
		<>
			<div className={`${styles.loader} ${className}`}>
				<Img src='/loading.gif' alt='loading' width={size} height={size} />
			</div>
		</>
	);
};

export default React.memo(Spinner);
