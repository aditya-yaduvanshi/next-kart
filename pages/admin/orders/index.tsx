import ProtectedRoute from 'hoc/private-route';
import {NextPage} from 'next';
import React from 'react';

const AdminOrders: NextPage = () => {
	return (
		<>
			<div className='container'>Orders</div>
		</>
	);
};

export default ProtectedRoute({Component: AdminOrders});
