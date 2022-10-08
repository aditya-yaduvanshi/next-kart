import privateRoute from 'hoc/private-route';
import {NextPage} from 'next';
import React from 'react';

const Orders: NextPage = () => {
	return (
		<>
			<div className='container'>Orders</div>
		</>
	);
};

export default privateRoute({Component: React.memo(Orders)}); 
