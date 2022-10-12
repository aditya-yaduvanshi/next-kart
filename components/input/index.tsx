import Img from 'components/img';
import React, {useRef} from 'react';
import styles from './input.module.css';
import {BiImageAdd} from 'react-icons/bi';

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

interface InputFileProps extends React.DetailedHTMLProps<
React.InputHTMLAttributes<HTMLInputElement>,
HTMLInputElement
> {
	onUpload: (file: File) => void;
	img?: {
		src: string;
		alt: string;
		width: string;
		height: string;
	};
	iconSize: number;
};

export const InputFile: React.FC<InputFileProps> = ({
	onUpload,
	img,
	className,
	iconSize,
	children
}) => {
	const fileRef = useRef() as React.RefObject<HTMLInputElement>;

	const pickImage = () => {
		fileRef.current?.click();
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target!.files) return;
		onUpload(e.target.files[0]);
	};

	return (
		<>
			<div className={`${styles.div} ${className ?? ''}`}>
				<input
					type='file'
					className='hidden'
					ref={fileRef}
					onChange={handleChange}
					accept='image/png, image/jpg, image/jpeg, image/gif'
					multiple={false}
				/>
				<button onClick={pickImage} className={styles.upload_btn}>
					{img ? (
						<Img
							src={img.src}
							alt={img.alt}
							width={img.width}
							height={img.height}
						/>
					) : (
						<BiImageAdd size={iconSize} />
					)}
					<span className={styles.upload_text}>
						{img ? 'Change' : 'Upload'}
					</span>
				</button>
				{img && children}
			</div>
		</>
	);
};

interface TextAreaProps
	extends React.DetailedHTMLProps<
		React.TextareaHTMLAttributes<HTMLTextAreaElement>,
		HTMLTextAreaElement
	> {}

export const TextArea = React.forwardRef(function (
	{value, placeholder, className, ...props}: TextAreaProps,
	ref
) {
	return (
		<>
			<div className={`${styles.div}`}>
				<textarea
					placeholder={placeholder}
					ref={ref as React.LegacyRef<HTMLTextAreaElement>}
					{...props}
					className={styles.textarea}
				>
					{value}
				</textarea>
			</div>
		</>
	);
});

export default React.memo(Input);
