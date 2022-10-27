import Pagination from 'components/pagination';
import ProductCard from 'components/product-card';
import Spinner from 'components/spinner';
import {PRODUCTS_URL} from 'constants/urls';
import ProductProvider, {useProducts} from 'contexts/products';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import {useRouter} from 'next/router';
import {ProductListProps} from 'pages/admin/products';
import React, {useEffect, useState} from 'react';

const Products: React.FC<ProductListProps> = (props) => {
	const {products, loading, getProducts} = useProducts();
	const router = useRouter();
	const queryPage = router.query.page as string;

	const [page, setPage] = useState(
		Number(queryPage) > 0 ? Number(queryPage) : 1
	);
	const productList = products.length ? products : props.products;

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
			<div className='overflow-y-auto h-full pb-10 relative'>
				<section className='gap-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-2 mb-10'>
					{productList?.length ? (
						productList.map((product) => (
							<ProductCard key={product.id} product={product} />
						))
					) : loading ? (
						<Spinner className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
					) : (
						'No products found!'
					)}
				</section>
				<Pagination
					page={page}
					onPrev={page === 1 ? undefined : () => setPage((prev) => prev - 1)}
					onNext={productList.length >= 20 ? () => setPage((prev) => prev + 1) : undefined}
					className='absolute bottom-10 left-1/2 -translate-x-1/2'
				/>
			</div>
		</>
	);
};

const ProductList: NextPage<ProductListProps> = (props) => {
	return (
		<>
			<ProductProvider>
				<Products {...props} />
			</ProductProvider>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (
	ctx: GetServerSidePropsContext
) => {
	const res = await fetch(PRODUCTS_URL);
	let result = await res.json();
	return {
		props: {products: result},
	};
};

export default React.memo(ProductList);
