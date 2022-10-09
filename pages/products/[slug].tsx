import { useProducts } from 'contexts/products';
import {NextPage} from 'next';
import React from 'react';

const ProductDetail: NextPage = () => {
	const {} = useProducts();
	return (
		<>
			<div className='container'>
				<section></section>
				<section>
					<p></p>
				</section>
			</div>
		</>
	);
};

export default React.memo(ProductDetail);
