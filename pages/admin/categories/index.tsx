import Button from 'components/button';
import Img from 'components/img';
import Input, { InputFile } from 'components/input';
import Modal from 'components/modal';
import { CATEGORIES_URL, USERS_URL } from 'constants/urls';
import CategoryProvider, { useCategories } from 'contexts/categories';
import { protectedRoute } from 'hoc/ProtectedRoute';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import { auth } from 'utils/admin.firebase';

interface CategoriesProps {
	categories: [];
}

const Categories: React.FC<CategoriesProps> = (props) => {
	const {categories} = useCategories();
	const categoryList = props.categories;
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
			<Modal show={show} onClose={() => setShow(false)} headerTitle="Add New Category">
				<form>
					<div className='p-5 flex flex-col gap-2'>
						<InputFile onUpload={(file) => file} iconSize={100} required name="image" />
						<Input type="text" required name="name" placeholder='Category Name' />
					</div>
					<Button variant='primary' type="submit">Submit</Button>
				</form>
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

// export const getInitialProps = async () => {
// 	try {
// 		console.log('get initial')
// 		const res = await fetch(CATEGORIES_URL);
// 		if (res.status === 200) {
// 			let result = await res.json();
// 			console.log(result);
// 			return {
// 				props: {categories: result},
// 			};
// 		}
// 	} catch (err) {}
// 	return {
// 		props: {},
// 	};
// }

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const cookie = ctx.req.cookies['user'];

	if (!cookie)
		return {
			redirect: {
				destination: '/auth/signin?redirect=/admin/dashboard',
				permanent: false,
			},
		};
	try {
		let claim = await auth.verifySessionCookie(cookie);
		if (claim.role !== 'admin')
			return {
				redirect: {
					destination: '/products',
					permanent: false,
				},
			};
		const res = await fetch(CATEGORIES_URL);
		if (res.status === 200) {
			let result = await res.json();
			console.log(result);
			return {
				props: {categories: result},
			};
		}
		return {
			props: {},
		};
	} catch (err) {
		await fetch(USERS_URL);
		return {
			redirect: {
				destination: '/auth/signin?redirect=/admin/dashboard',
				permanent: false,
			},
		};
	}
}

export default protectedRoute({Component: React.memo(CategoryList)});
