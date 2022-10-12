import privateRoute from 'hoc/PrivateRoute';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import React from 'react';
import { auth } from 'utils/admin.firebase';

const Orders: NextPage = () => {
	return (
		<>
			<div className='container'>Orders</div>
		</>
	);
};

export default privateRoute({Component: React.memo(Orders)}); 

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const cookie = ctx.req.cookies['user'];
	if(!cookie) {
		return {
			redirect: {
				permanent: false,
				destination: '/auth/signin',
			},
		}
	}

	try {
		await auth.verifySessionCookie(cookie);
		return {
			props: {}
		}
	} catch (err) {
		return {
			redirect: {
				permanent: false,
				destination: '/auth/signin',
			},
		}
	}
};
