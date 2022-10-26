import {protectedRoute} from 'hoc/ProtectedRoute';
import withServerSideAuth from 'hoc/withServerSideAuth';
import withServerSideAdmin from 'hoc/withServerSideAdmin';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import Head from 'next/head';
import React from 'react';

const AdminOrders: NextPage = () => {
	return (
		<>
			<Head>
				<title>Admin | Orders</title>
				<meta name='description' content='List of available categories.' />
			</Head>
			<div className='container'>Orders</div>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withServerSideAuth(
	withServerSideAdmin(async function getServerSideProps(
		ctx: GetServerSidePropsContext
	) {
		return {
			props: {},
		};
	},
	'/products') as GetServerSideProps,
	'/admin/orders'
);

export default React.memo(AdminOrders);
