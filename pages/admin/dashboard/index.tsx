import withServerSideAdmin from 'hoc/withServerSideAdmin';
import withServerSideAuth from 'hoc/withServerSideAuth';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import Head from 'next/head';
import React from 'react';

export const getServerSideProps: GetServerSideProps = withServerSideAuth(
	withServerSideAdmin(async function getServerSideProps(
		ctx: GetServerSidePropsContext
	) {
		console.log('auth and admin');
		return {
			props: {},
		};
	},
	'/products') as GetServerSideProps,
	'/admin/dashboard'
);

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

export default React.memo(AdminDashboard);
