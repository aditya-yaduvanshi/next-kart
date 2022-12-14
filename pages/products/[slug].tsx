import Button from 'components/button';
import CategoryCard from 'components/category-card';
import Img from 'components/img';
import ProductCartButton from 'components/product-cart-button';
import ProductForm from 'components/product-form';
import {PRODUCTS_URL} from 'constants/urls';
import { useAuth } from 'contexts/auth';
import CartProvider from 'contexts/cart';
import CategoryProvider, {ICategory} from 'contexts/categories';
import ProductProvider, {IProduct, IProductDetail} from 'contexts/products';
import {GetStaticProps, NextPage} from 'next';
import React, { useState } from 'react';

type ProductDetailProps = {
	product: IProductDetail;
	error?: string;
};

const ProductDetail: NextPage<ProductDetailProps> = (props) => {
	const product = props.product;
	const [show, setShow] = useState(false);
	const {user} = useAuth();

	if (!props.product) return <></>;

	return (
		<>
			<div className='p-5'>
				<section className='flex justify-between'>
					<div className='w-full flex flex-col justify-center items-center gap-2'>
						<div className='bg-white border border-zinc-400 p-2'>
							<Img src={product.thumbnail} width='500' height='500' />
						</div>
						<div className='flex gap-2'>
							{product.images?.map((image) => (
								<Img
									key={image}
									src={image}
									alt=''
									width='150'
									height='150'
									className='border border-zinc-400 p-2'
								/>
							))}
						</div>
					</div>
					<div className='w-full flex flex-col gap-4'>
						<h2 className='text-2xl font-semibold'>{product.title}</h2>
						<div className='flex gap-4'>
							<div className='flex flex-col gap-4 w-full'>
								<div className='flex items-center gap-5'>
									<span>Brand:</span> <strong>{product.brand}</strong>
								</div>
								<div className='flex items-center gap-5'>
									<span>Stock:</span> <strong>{product.stock}</strong>
								</div>
								<div className='flex items-center gap-5'>
									<span>Price:</span> <strong>Rs. {product.price}</strong>
								</div>
							</div>
							<div>
								<span>Category</span>:
								<CategoryCard category={product.category as ICategory} />
							</div>
						</div>
						<div className='flex gap-2 items-center'>
							{user && user.role === 'admin' && (
								<Button onClick={() => setShow(true)} variant='primary'>Edit Product</Button>
							)}
							<CartProvider>
								<ProductCartButton productId={product.id} />
							</CartProvider>
						</div>
						<div>
							<h4>Product Detail</h4>
							<p className='bg-white border border-zinc-400 p-5'>
								{product.description}
							</p>
						</div>
					</div>
				</section>
			</div>
			{user && user.role === 'admin' && (
			<ProductProvider>
				<CategoryProvider>
					<ProductForm show={show} onClose={() => setShow(false)} mode={{edit: true, data: product}} />
				</CategoryProvider>
			</ProductProvider>
			)}
		</>
	);
};

export default React.memo(ProductDetail);

export const getStaticPaths = async () => {
	const res = await fetch(PRODUCTS_URL);
	const result = (await res.json()) as IProduct[];
	const paths = result.map((product) => ({params: {slug: product.slug}}));
	return {
		paths,
		fallback: true,
	};
};

export const getStaticProps: GetStaticProps = async ({params}) => {
	const res = await fetch(
		`${PRODUCTS_URL}/${(params?.slug as string)?.split('_')[1]}`
	);
	let result;
	if (res.status === 200) {
		result = {
			product: await res.json(),
		};
	} else if (res.status === 400) {
		result = {
			error: await res.json(),
		};
	}
	return {
		props: {...result},
	};
};
