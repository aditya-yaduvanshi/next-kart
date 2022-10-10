import Pagination from 'components/pagination';
import ProductCard from 'components/product-card';
import Spinner from 'components/spinner';
import {useProducts} from 'contexts/products';
import {protectedRoute} from 'hoc/protected-route';
import {NextPage} from 'next';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';

const AdminProducts: NextPage = () => {
	const {products, loading, getProducts} = useProducts();
	const queryPage = useRouter().query.page as string;

	const [page, setPage] = useState(
		Number(queryPage) > 0 ? Number(queryPage) : 1
	);

	useEffect(() => {
		getProducts({page, limit: 20});
	}, [page]);

	return (
		<>
			<div className='overflow-y-auto h-full pb-10'>
				<h3>Products</h3>
				<section className='gap-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-2 mb-10'>
					{products.length ? (
						products
							.find((productPage) => productPage.page === page)
							?.products.map((product) => (
								<ProductCard key={product.id} product={product} />
							))
					) : loading ? (
						<Spinner />
					) : (
						'No products found!'
					)}
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

export default protectedRoute({Component: React.memo(AdminProducts)});
