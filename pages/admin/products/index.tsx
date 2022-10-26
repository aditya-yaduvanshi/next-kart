import Pagination from 'components/pagination';
import ProductCard from 'components/product-card';
import ProductForm from 'components/product-form';
import Spinner from 'components/spinner';
import {PRODUCTS_URL} from 'constants/urls';
import ProductProvider, {IProduct, IProductDetail, useProducts} from 'contexts/products';
import withServerSideAdmin from 'hoc/withServerSideAdmin';
import withServerSideAuth from 'hoc/withServerSideAuth';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import CategoryProvider from 'contexts/categories';
import Button from 'components/button';
import { FaPlus } from 'react-icons/fa';

const AdminProducts: React.FC<ProductListProps> = (props) => {
	const [productModal, setProductModal] = useState(false);
	const {products, loading, getProducts} = useProducts();
	const router = useRouter();
	const queryPage = router.query.page as string;
	const productList = products.length ? products : props.products;

	const [page, setPage] = useState(
		Number(queryPage) > 0 ? Number(queryPage) : 1
	);

	useEffect(() => {
		getProducts({page, limit: 20});
	}, [page, getProducts]);

	useEffect(() => {
		router.push(
			{pathname: router.pathname, query: {...router.query, page}},
			undefined,
			{shallow: true}
		);
	}, [page]);

	return (
		<>
			<Head>
				<title>Admin | Products</title>
				<meta name='description' content='List of available products.' />
			</Head>
			<div className='overflow-y-auto h-full pb-10 relative'>
			{loading && <Spinner className='w-full h-full bg-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' />}
				<h3 className='flex justify-between items-center py-2 px-5 border-b border-zinc-400 mx-2'>
					<span className='text-2xl font-semibold'>Products</span>
					<Button variant='primary' onClick={() => setProductModal(true)}>
						New Product <FaPlus />
					</Button>
				</h3>
				<section className='flex flex-nowrap p-2 gap-2 mb-10 relative'>
					{productList?.length ? (
						productList.map((product) => (
							<ProductCard key={product.id} product={product} />
						))
					) : (
						<div className='w-full justify-center items-center flex'>
							No products found!
						</div>
					)}
				</section>
				<Pagination
					className='absolute bottom-0 left-0 right-0'
					page={page}
					onPrev={page <= 1 ? undefined : () => setPage((prev) => prev - 1)}
					onNext={productList.length >= 20 ? () => setPage((prev) => prev + 1) : undefined}
				/>
			</div>
			<CategoryProvider>
				<ProductForm
					show={productModal}
					onClose={() => setProductModal(false)}
					mode={{edit: false}}
				/>
			</CategoryProvider>
		</>
	);
};

export interface ProductListProps {
	products: IProduct[];
}

const ProductList: NextPage<ProductListProps> = (props) => {
	return (
		<>
			<ProductProvider initialValue={props.products}>
				<AdminProducts {...props} />
			</ProductProvider>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withServerSideAuth(
	withServerSideAdmin(async function getServerSideProps(
		ctx: GetServerSidePropsContext
	) {
		const res = await fetch(PRODUCTS_URL);
		if (res.status === 200) {
			const products = await res.json();
			return {
				props: {products},
			};
		}
		return {
			props: {},
		};
	},
	'/products') as GetServerSideProps,
	'/admin/products'
);

export default React.memo(ProductList);
