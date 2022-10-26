import React from 'react';
import styles from './autocomplete.module.css';

interface AutoCompleteProps
	extends React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {
	options: string[];
}

const AutoComplete = React.forwardRef(function Autocomplete(
	{
		options,
		placeholder,
		name,
		className,
		...inputProps
	}: AutoCompleteProps,
	ref
) {
	const list = `autocomplete-${name ?? new Date().getTime()}`;

	return (
		<>
			<div className={`${styles.div} ${className ?? ''}`}>
				<input
					className={styles.input}
					list={list}
					placeholder={placeholder}
					{...inputProps}
					ref={ref as React.LegacyRef<HTMLInputElement>}
				/>
				<label className={styles.label}>{placeholder}</label>
				<datalist id={list}>
					{options.map((option) => (
						<option key={option} value={option}>
							{option}
						</option>
					))}
				</datalist>
			</div>
		</>
	);
});

export default React.memo(AutoComplete);
