import Pagination from 'components/pagination';
import ProductCard from 'components/product-card';
import Spinner from 'components/spinner';
import {PRODUCTS_URL} from 'constants/urls';
import ProductProvider, {IProduct, useProducts} from 'contexts/products';
import {protectedRoute} from 'hoc/ProtectedRoute';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import Head from 'next/head';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import {auth} from 'utils/firebase';

const AdminProducts: React.FC<ProductListProps> = (props) => {
	const {products, loading, getProducts} = useProducts();
	const queryPage = useRouter().query.page as string;

	const [page, setPage] = useState(
		Number(queryPage) > 0 ? Number(queryPage) : 1
	);
	const productList =
		typeof window === 'undefined'
			? props.products
			: products.find((item) => item.page === page)?.products;

	useEffect(() => {
		getProducts({page, limit: 20});
	}, [page, getProducts]);

	return (
		<>
			<Head>
				<title>Admin | Products</title>
				<meta name="description" content='List of available categories.' />
			</Head>
			<div className='overflow-y-auto h-full pb-10'>
				<h3>Products</h3>
				<section className='gap-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-2 mb-10 relative'>
					{loading && <Spinner />}
					{productList
						? productList.map((product) => (
								<ProductCard key={product.id} product={product} />
						  ))
						: <div className='absolute w-full justify-center items-center flex'>No products found!</div>}
				</section>
				<Pagination
					page={page}
					onPrev={() => setPage((prev) => prev - 1)}
					onNext={() => setPage((prev) => prev + 1)}
				/>
			</div>
		</>
	);
};

interface ProductListProps {
	products: IProduct[];
}

const ProductList: NextPage<ProductListProps> = (props) => {
	return (
		<>
			<ProductProvider>
				<AdminProducts {...props} />
			</ProductProvider>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async (
	ctx: GetServerSidePropsContext
) => {
	try {
		console.log(ctx.req.cookies)
		const res = await fetch(PRODUCTS_URL);
		if (res.status === 200) {
			let result = await res.json();
			console.log(result);
			return {
				props: {products: result},
			};
		}
	} catch (err) {}
	return {
		props: {},
	};
};

export default protectedRoute({Component: React.memo(ProductList)});
