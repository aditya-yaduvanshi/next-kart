import ProtectedRoute from 'hoc/private-route';
import {NextPage} from 'next';
import React from 'react';

const AdminDashboard: NextPage = () => {
	return (
		<>
			<div className='container'>Dashboard</div>
		</>
	);
};

export default ProtectedRoute({Component: AdminDashboard});
