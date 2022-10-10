import { protectedRoute } from 'hoc/protected-route';
import {NextPage} from 'next';
import Head from 'next/head';
import React from 'react';

const AdminDashboard: NextPage = () => {
	return (
		<>
			<Head>
				<title>Admin | Dashboard</title>
				<meta name="description" content='List of available categories.' />
			</Head>
			<div className='container'>Dashboard</div>
		</>
	);
};

export default protectedRoute({Component: React.memo(AdminDashboard)});
