import React from 'react';
import styles from './button.module.css';

export interface ButtonProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	variant?: 'primary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({
	children,
	className,
	variant,
}) => {
	return (
		<button
			className={`${styles.button} ${variant ? styles[variant] : ''} ${className ?? ''}`}
		>
			{children}
		</button>
	);
};

export default React.memo(Button);
