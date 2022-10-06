import PrivateRoute from 'hoc/private-route';
import {NextPage} from 'next';
import React from 'react';

const OrderDetail: NextPage = () => {
	return (
		<>
			<div className='container'>OrderDetail</div>
		</>
	);
};

export default PrivateRoute({Component: OrderDetail});
