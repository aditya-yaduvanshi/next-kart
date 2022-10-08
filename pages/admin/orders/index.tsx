import { protectedRoute } from 'hoc/protected-route';
import {NextPage} from 'next';
import React from 'react';

const AdminOrders: NextPage = () => {
	return (
		<>
			<div className='container'>Orders</div>
		</>
	);
};

export default protectedRoute({Component: React.memo(AdminOrders)});
