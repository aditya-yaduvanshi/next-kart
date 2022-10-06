import React from 'react';
import styles from './input.module.css';

interface InputProps
	extends React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {}

const Input = React.forwardRef(function Input(
	{className, placeholder, ...inputProps}: InputProps,
	ref
) {
	return (
		<>
			<div className={`${styles.div} ${className}`}>
				<input
					className={styles.input}
					placeholder={placeholder}
					ref={ref as React.LegacyRef<HTMLInputElement>}
					{...inputProps}
				/>
				<label className={styles.label}>{placeholder}</label>
			</div>
		</>
	);
});

export default React.memo(Input);
