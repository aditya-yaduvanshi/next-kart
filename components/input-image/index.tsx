import Img from 'components/img';
import React, { useRef } from 'react';
import { BiImageAdd } from 'react-icons/bi';
import styles from './input-image.module.css';

interface InputImageProps
	extends React.DetailedHTMLProps<
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
}

const InputImage: React.FC<InputImageProps> = React.memo(
	function Inputfile({onUpload, img, className, iconSize, children}) {
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
						accept='image/png, image/jpg, image/jpeg, image/gif, image/webp'
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
	}
);

export default React.memo(InputImage);