import Alert from 'components/alert';
import Button from 'components/button';
import Input from 'components/input';
import InputImage from 'components/input-image';
import Modal, {ModalProps} from 'components/modal';
import Spinner from 'components/spinner';
import {ICategory, useCategories} from 'contexts/categories';
import React, {useEffect, useRef, useState} from 'react';
import {uploadImage} from 'utils/upload';

export type CategoryFormProps = Omit<ModalProps, 'headerTitle'> & {
	mode: {
		edit: boolean;
		data?: ICategory;
	};
};

const CategoryForm: React.FC<CategoryFormProps> = ({show, onClose, mode}) => {
	const [image, setImage] = useState('');
	const nameRef = useRef() as React.RefObject<HTMLInputElement>;

	const {createCategory, error, loading, updateCategory} = useCategories();

	useEffect(() => {
		if (!nameRef.current || !mode.edit || !mode.data) return;
		nameRef.current.value = mode.data.name;
		setImage(mode.data.image);
	}, [nameRef, mode]);

	const handleUpload = async (file: File) => {
		const {url} = await uploadImage(file, 'categories');
		if (url) setImage(url);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (mode.edit && mode.data)
			await updateCategory(mode.data.id, {name: nameRef.current!.value, image});
		else await createCategory({name: nameRef.current!.value, image});
		if (!error) {
			setImage('');
			onClose();
		}
	};

	return (
		<>
			<Modal
				show={show}
				onClose={() => {
					setImage('');
					onClose();
				}}
				headerTitle={
					mode.edit && mode.data ? 'Edit Category' : 'Add New Category'
				}
			>
				<form onSubmit={handleSubmit} className='relative'>
					{loading && (
						<Spinner className='bg-white w-full h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
					)}
					<div className='p-5 flex flex-col gap-2'>
						<InputImage
							onUpload={handleUpload}
							iconSize={100}
							required
							name='image'
							img={
								image
									? {
											src: image,
											alt: 'thumbnail',
											width: '195',
											height: '195',
									  }
									: undefined
							}
						/>
						<Input
							type='text'
							required
							name='name'
							placeholder='Category Name'
							ref={nameRef}
						/>
						{error ? <Alert type='error'>{error}</Alert> : null}
					</div>
					<div className='flex justify-between items-center p-5'>
						<Button variant='danger' onClick={onClose}>
							Cancel
						</Button>
						<Button variant='primary' type='submit'>
							Submit
						</Button>
					</div>
				</form>
			</Modal>
		</>
	);
};

export default React.memo(CategoryForm);
