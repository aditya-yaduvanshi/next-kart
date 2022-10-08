import { protectedRoute } from 'hoc/protected-route';
import {NextPage} from 'next';
import React from 'react';

const AdminDashboard: NextPage = () => {
	return (
		<>
			<div className='container'>Dashboard</div>
		</>
	);
};

export default protectedRoute({Component: React.memo(AdminDashboard)});
