import { USERS_URL } from 'constants/urls';
import {protectedRoute} from 'hoc/ProtectedRoute';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import Head from 'next/head';
import React from 'react';
import {auth} from 'utils/admin.firebase';

export const getServerSideProps: GetServerSideProps = async (
	ctx: GetServerSidePropsContext
) => {
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
};

const AdminDashboard: NextPage = () => {
	return (
		<>
			<Head>
				<title>Admin | Dashboard</title>
				<meta name='description' content='List of available categories.' />
			</Head>
			<div className='container'>Dashboard</div>
		</>
	);
};

export default protectedRoute({Component: React.memo(AdminDashboard)});
