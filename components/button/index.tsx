import React from 'react';
import styles from './button.module.css';

export interface ButtonProps
	extends React.DetailedHTMLProps<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	variant?: 'primary' | 'danger' | 'success' | 'warning';
	size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
	children,
	className,
	variant,
	size = 'medium',
	...props
}) => {
	return (
		<button
			className={`${styles.button} ${styles[size]} ${variant ? styles[variant] : ''} ${
				className ?? ''
			}`}
			{...props}
		>
			{children}
		</button>
	);
};

export default React.memo(Button);
