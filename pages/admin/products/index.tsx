import ProtectedRoute from 'hoc/private-route';
import {NextPage} from 'next';
import React from 'react';

const AdminProducts: NextPage = () => {
	return (
		<>
			<div className='container'>Products</div>
		</>
	);
};

export default ProtectedRoute({Component: AdminProducts});
