import Button from 'components/button';
import Input, {InputFile, TextArea} from 'components/input';
import {useProducts} from 'contexts/products';
import React, {useRef, useState} from 'react';
import {FaPlus} from 'react-icons/fa';
import {RiDeleteBinLine} from 'react-icons/ri';
import { unUploadImage, uploadImage } from 'utils/upload';
import styles from './product-form.module.css';

const ProductForm: React.FC = () => {
	const [thumbnail, setThumbnail] = useState<{url?: string; file?: File}>();
	const titleRef = useRef() as React.RefObject<HTMLInputElement>;
	const brandRef = useRef() as React.RefObject<HTMLInputElement>;
	const priceRef = useRef() as React.RefObject<HTMLInputElement>;
	const stockRef = useRef() as React.RefObject<HTMLInputElement>;
	const descriptionRef = useRef() as React.RefObject<HTMLTextAreaElement>;
	const [images, setImages] = useState<{id: number; file?: File; url?: string;}[]>([
		{id: new Date().getTime()},
	]);

	const {addNewProduct, loading, error} = useProducts();

	const upload = async (file: File, type: 'thumbnail' | 'images', index: number) => {
		let {url, error} = await uploadImage(file, 'products');
		if(error && !url) return;
		console.log(url)
		switch(type){
			case 'thumbnail':
				return setThumbnail(current => ({...current, url, file}));
			case 'images':
				return setImages(current => {
					current[index].url = url;
					current[index].file = file;
					return [...current];
				});
			default: return;
		}
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (
			!thumbnail ||
			!thumbnail.url ||
			!titleRef.current!.value ||
			!brandRef.current!.value ||
			!stockRef.current!.value ||
			!priceRef.current!.value
		)
			return;
		
	};

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className={styles.wrapper}>
					<section className={styles.section1}>
						<InputFile
							onUpload={(file) => {
								setThumbnail({file});
								upload(file, 'thumbnail', -1);
							}}
							img={thumbnail?.url ? {
								src: thumbnail.url,
								alt: 'thumbnail',
								width: '195',
								height: '195'
							} : undefined}
							iconSize={100}
							className='w-full'
							required
						/>
						<div className={styles.inputs}>
							<Input
								type='text'
								required
								ref={titleRef}
								placeholder='Product Title'
							/>
							<Input
								type='text'
								required
								ref={brandRef}
								placeholder='Product Brand'
							/>
							<Input
								type='number'
								min='0'
								max='1000000000'
								required
								ref={priceRef}
								placeholder='Product Price'
							/>
							<Input
								type='number'
								min='0'
								max='1000000000'
								required
								ref={stockRef}
								placeholder='Product Stock'
							/>
						</div>
					</section>
					<section className={styles.section2}>
						<div className={styles.images}>
							{images.map((img, index) => (
								<InputFile
									className={styles.file_input}
									key={img.id}
									img={img.url ? {
										src: img.url,
										alt: 'product',
										width: '90',
										height: '90'
									} : undefined}
									onUpload={(file) => {
										setImages((current) => {
											let el = current[index];
											el.file = file;
											return [...current];
										})
										upload(file, 'images', index);
									}
									}
									iconSize={30}
								>
									<button
										className={styles.delete_icon}
										type="button"
										onClick={() => {
											unUploadImage(img.url!)
											setImages((current) => {
												current.splice(index, 1);
												return [...current];
											});
										}}
									>
										<RiDeleteBinLine size='20' color='red' />
									</button>
								</InputFile>
							))}
							{images.length < 4 && (
								<button
									className={styles.add_img_btn}
									onClick={() =>
										setImages((current) => {
											for(let i of current){
												if(!i.file) {
													return current;
												}
											}

											return [
											...current,
											{id: new Date().getTime()},
										]})
									}
								>
									<FaPlus size='30' />
								</button>
							)}
						</div>
						<TextArea
							placeholder='Product Description...'
							ref={descriptionRef}
						/>
					</section>
				</div>
				<div className={styles.footer}>
					<Button variant='danger'>Cancel</Button>
					<Button variant='primary'>Submit</Button>
				</div>
			</form>
		</>
	);
};

export default React.memo(ProductForm);
