import Button from 'components/button';
import CategoryCard from 'components/category-card';
import CategoryForm from 'components/category-form';
import {CATEGORIES_URL} from 'constants/urls';
import CategoryProvider, {
	ICategory,
	ICategoryContext,
	useCategories,
} from 'contexts/categories';
import withServerSideAdmin from 'hoc/withServerSideAdmin';
import withServerSideAuth from 'hoc/withServerSideAuth';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import Head from 'next/head';
import React, {useCallback, useEffect, useState} from 'react';
import { FaPlus } from 'react-icons/fa';

interface CategoriesProps {
	categories: ICategoryContext['categories'];
}

const Categories: React.FC<CategoriesProps> = (props) => {
	const {categories, getCategories} = useCategories();
	const categoryList = categories.length ? categories : props.categories;
	const [show, setShow] = useState(false);
	const [formMode, setFormMode] = useState<{edit: boolean; data?: ICategory}>({edit: false});

	const handleEdit = (category: ICategory) => {
		setFormMode({edit: true, data: category});
		setShow(true);
	}

	const handleClose = useCallback(() => {
		setShow(false);
		setFormMode({edit: false, data: undefined});
	},[]);

	useEffect(() => {
		getCategories();
	}, []);

	return (
		<>
			<Head>
				<title>Admin | Categories</title>
				<meta name='description' content='List of available categories.' />
			</Head>
			<div className='overflow-y-auto h-full pb-10'>
				<h3 className='flex justify-between items-center py-2 px-5 border-b border-zinc-400 mx-2'>
					<span className='text-2xl font-semibold'>Categories</span>
					<Button variant='primary' onClick={() => setShow(true)}>
						New Category <FaPlus />
					</Button>
				</h3>
				<section className='flex flex-nowrap gap-2 p-2 mb-10 relative'>
					{categoryList?.map((category) => (
						<CategoryCard key={category.id} category={category} showEditButton onEdit={handleEdit} />
					))}
				</section>
			</div>
			<CategoryForm show={show} onClose={handleClose} mode={formMode} />
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
	);
};

export const getServerSideProps: GetServerSideProps = withServerSideAuth(
	withServerSideAdmin(async function getServerSideProps(
		ctx: GetServerSidePropsContext
	) {
		const res = await fetch(CATEGORIES_URL);
		if (res.status === 200) {
			const categories = await res.json();
			return {
				props: {categories},
			};
		}
		return {
			props: {},
		};
	},
	'/products')  as GetServerSideProps,
	'/admin/categories'
);

export default React.memo(CategoryList);
