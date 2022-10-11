import privateRoute, { serverSidePrivateRoute } from 'hoc/PrivateRoute';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import React from 'react';

const Orders: NextPage = () => {
	return (
		<>
			<div className='container'>Orders</div>
		</>
	);
};

export default privateRoute({Component: React.memo(Orders)}); 

export const getServerSideProps: GetServerSideProps = serverSidePrivateRoute(async (ctx: GetServerSidePropsContext) => {
	return {
		props: {}
	}
});
