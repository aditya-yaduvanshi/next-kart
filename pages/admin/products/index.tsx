import { protectedRoute } from 'hoc/protected-route';
import {NextPage} from 'next';
import React from 'react';

const AdminProducts: NextPage = () => {
	return (
		<>
			<div className='container'>Products</div>
		</>
	);
};

export default protectedRoute({Component: React.memo(AdminProducts)});
