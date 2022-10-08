import { protectedRoute } from 'hoc/protected-route';
import {NextPage} from 'next';
import React from 'react';

const Categories: NextPage = () => {
	return (
		<>
			<div className='container'>Categories</div>
		</>
	);
};

export default protectedRoute({Component: React.memo(Categories)});
