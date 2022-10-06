import Pagination from 'components/pagination';
import ProductCard from 'components/product-card';
import {NextPage} from 'next';
import React, {useEffect, useState} from 'react';

const Products: NextPage = () => {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		fetch('https://fakestoreapi.com/products')
			.then((res) => res.json())
			.then((json) => setProducts(json));
	}, []);

	return (
		<>
			<div className='overflow-y-auto h-full pb-10'>
				<h3>Products</h3>
				<ul className='gap-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-2 mb-10'>
					{products.length ? products.map(product => (
						<ProductCard key={product.id} product={{title: product.title, price: product.price, thumbnail: product.image, category: product.category, id: product.id}} />
					)) : "No products found!"}
				</ul>
				<Pagination page={5} onPrev={() => {}} onNext={() => {}} />
			</div>
		</>
	);
};

export default React.memo(Products);
