import Img from 'components/img';
import Modal from 'components/modal';
import { CATEGORIES_URL } from 'constants/urls';
import CategoryProvider, { useCategories } from 'contexts/categories';
import { protectedRoute } from 'hoc/ProtectedRoute';
import {NextPage} from 'next';
import Head from 'next/head';
import React, { useState } from 'react';

interface CategoriesProps {
	categories: [];
}

const Categories: React.FC<CategoriesProps> = (props) => {
	const {categories} = useCategories();
	const categoryList = typeof window === 'undefined' ? props.categories : categories;
	const [show, setShow] = useState(false);
	return (
		<>
			<Head>
				<title>Admin | Categories</title>
				<meta name="description" content='List of available categories.' />
			</Head>
			<div className='overflow-y-auto h-full pb-10'>
				<h3>Categories<button onClick={() => setShow(true)}>New Category</button></h3>
				<section className='gap-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-2 mb-10 relative'>
					{categoryList?.map(category => (
						<article key={category.id}>
							<Img src={category.image} alt={category.name} width="100" height="100" />
							<h4>{category.name}</h4>
						</article>
					))}
				</section>
			</div>
			<Modal show={show} onClose={() => setShow(false)}>
				<div>modal is working</div>
			</Modal>
		</>
	);
};

const CategoryList: NextPage<CategoriesProps> = (props) => {
	return (
		<>
			<CategoryProvider>
				<Categories {...props} />
			</CategoryProvider>
		</>
	)
}

export const getInitialProps = async () => {
	try {
		console.log('get initial')
		const res = await fetch(CATEGORIES_URL);
		if (res.status === 200) {
			let result = await res.json();
			console.log(result);
			return {
				props: {categories: result},
			};
		}
	} catch (err) {}
	return {
		props: {},
	};
}

export default protectedRoute({Component: React.memo(CategoryList)});
