import Alert from 'components/alert';
import Button from 'components/button';
import Input from 'components/input';
import InputImage from 'components/input-image';
import TextArea from 'components/textarea';
import Spinner from 'components/spinner';
import {IProductDetail, useProducts} from 'contexts/products';
import React, {useEffect, useRef, useState} from 'react';
import {FaPlus} from 'react-icons/fa';
import {RiDeleteBinLine} from 'react-icons/ri';
import {unUploadImage, uploadImage} from 'utils/upload';
import styles from './product-form.module.css';
import Autocomplete from 'components/autocomplete';
import Modal, {ModalProps} from 'components/modal';
import {ICategory, useCategories} from 'contexts/categories';

interface ProductFormProps extends ModalProps {
	mode: {
		edit: boolean;
		data?: IProductDetail;
	};
}

const ProductForm: React.FC<ProductFormProps> = ({show, onClose, mode}) => {
	const {categories, getCategories} = useCategories();
	const [thumbnail, setThumbnail] = useState<{url?: string; file?: File}>();
	const titleRef = useRef() as React.RefObject<HTMLInputElement>;
	const brandRef = useRef() as React.RefObject<HTMLInputElement>;
	const priceRef = useRef() as React.RefObject<HTMLInputElement>;
	const stockRef = useRef() as React.RefObject<HTMLInputElement>;
	const categoryRef = useRef() as React.RefObject<HTMLInputElement>;
	const descriptionRef = useRef() as React.RefObject<HTMLTextAreaElement>;
	const [images, setImages] = useState<
		{id: number; file?: File; url?: string}[]
	>([{id: new Date().getTime()}]);

	useEffect(() => {
		getCategories();
	}, [getCategories]);

	useEffect(() => {
		if (
			!titleRef.current ||
			!brandRef.current ||
			!stockRef.current ||
			!priceRef.current ||
			!categoryRef.current ||
			!descriptionRef.current ||
			!mode.edit ||
			!mode.data
		)
			return;

		setThumbnail({url: mode.data.thumbnail});
		setImages(mode.data.images?.map(image => ({url: image, id: new Date().getTime()})) ?? [{id: new Date().getTime()}]);
		titleRef.current.value = mode.data.title;
		brandRef.current.value = mode.data.brand;
		stockRef.current.value = `${mode.data.stock}`;
		priceRef.current.value = `${mode.data.price}`;
		categoryRef.current.value = (mode.data.category as ICategory).name;
		descriptionRef.current.value = mode.data.description ?? '';
	}, [titleRef, mode]);

	const {addNewProduct, loading, error, editProduct} = useProducts();

	const upload = async (
		file: File,
		type: 'thumbnail' | 'images',
		index: number
	) => {
		let {url, error} = await uploadImage(file, 'products');
		if (error && !url) return;
		switch (type) {
			case 'thumbnail':
				return setThumbnail((current) => ({...current, url, file}));
			case 'images':
				return setImages((current) => {
					current[index].url = url;
					current[index].file = file;
					return [...current];
				});
			default:
				return;
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (
			!thumbnail ||
			!thumbnail.url ||
			!titleRef.current!.value ||
			!brandRef.current!.value ||
			!stockRef.current!.value ||
			!priceRef.current!.value ||
			!categories.find(
				(category) => category.name === categoryRef.current!.value
			)?.id
		)
			return;
		let data: Omit<IProductDetail, 'id' | 'slug'> = {
			title: titleRef.current!.value,
			brand: brandRef.current!.value,
			thumbnail: thumbnail.url,
			stock: Number(stockRef.current!.value),
			price: Number(priceRef.current!.value),
			category: categories.find(
				(category) => category.name === categoryRef.current!.value
			)!.id,
		};
		if (descriptionRef.current!.value)
			data.description = descriptionRef.current!.value;
		if (images.length) data.images = images.map((image) => image.url as string);

		if(mode.edit && mode.data)
			await editProduct(mode.data.id, data);
		else await addNewProduct(data);
		if (!error) {
			setImages([{id: new Date().getTime()}]);
			setThumbnail({});
			onClose();
		}
	};

	return (
		<>
			<Modal headerTitle={mode.edit && mode.data ? 'Edit Product' : 'Add New Product'} show={show} onClose={() => {
				setImages([{id: new Date().getTime()}]);
				setThumbnail({});
				onClose();
			}}>
				<form onSubmit={handleSubmit} className='relative'>
					{loading && (
						<Spinner className='bg-white w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
					)}
					<div className={styles.wrapper}>
						<section className={styles.section1}>
							<InputImage
								onUpload={(file) => {
									setThumbnail({file});
									upload(file, 'thumbnail', -1);
								}}
								img={
									thumbnail?.url
										? {
												src: thumbnail.url,
												alt: 'thumbnail',
												width: '195',
												height: '195',
										  }
										: undefined
								}
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
							<label>Product Images</label>
							<div className={styles.images}>
								{images.map((img, index) => (
									<InputImage
										className={styles.file_input}
										key={img.id}
										img={
											img.url
												? {
														src: img.url,
														alt: 'product',
														width: '90',
														height: '90',
												  }
												: undefined
										}
										onUpload={(file) => {
											setImages((current) => {
												let el = current[index];
												el.file = file;
												return [...current];
											});
											upload(file, 'images', index);
										}}
										iconSize={30}
									>
										<button
											className={styles.delete_icon}
											type='button'
											onClick={() => {
												unUploadImage(img.url!);
												setImages((current) => {
													current.splice(index, 1);
													return [...current];
												});
											}}
										>
											<RiDeleteBinLine size='20' color='red' />
										</button>
									</InputImage>
								))}
								{images.length < 4 && (
									<button
										className={styles.add_img_btn}
										onClick={() =>
											setImages((current) => {
												for (let i of current) {
													if (!i.file) {
														return current;
													}
												}

												return [...current, {id: new Date().getTime()}];
											})
										}
									>
										<FaPlus size='30' />
									</button>
								)}
							</div>
							<Autocomplete
								name='categories'
								placeholder='Category'
								required
								options={categories.map((category) => category.name)}
								ref={categoryRef}
							/>
							<TextArea
								placeholder='Product Description...'
								ref={descriptionRef}
							/>
						</section>
						{error ? <Alert type='error'>{error}</Alert> : null}
					</div>
					<div className={styles.footer}>
						<Button variant='danger'>Cancel</Button>
						<Button variant='primary'>Submit</Button>
					</div>
				</form>
			</Modal>
		</>
	);
};

export default React.memo(ProductForm);
