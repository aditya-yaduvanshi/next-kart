import withServerSideAuth from 'hoc/withServerSideAuth';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import React from 'react';

const Orders: NextPage = () => {
	return (
		<>
			<div className='container'>Orders</div>
		</>
	);
};

export default React.memo(Orders); 

export const getServerSideProps: GetServerSideProps = withServerSideAuth(async (ctx: GetServerSidePropsContext) => {
	return {
		props: {}
	}
}, '/orders');
