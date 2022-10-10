import { protectedRoute } from 'hoc/protected-route';
import {NextPage} from 'next';
import Head from 'next/head';
import React from 'react';

const AdminOrders: NextPage = () => {
	return (
		<>
			<Head>
				<title>Admin | Orders</title>
				<meta name="description" content='List of available categories.' />
			</Head>
			<div className='container'>Orders</div>
		</>
	);
};

export default protectedRoute({Component: React.memo(AdminOrders)});
