import { useProducts } from 'contexts/products';
import {NextPage} from 'next';
import React from 'react';

const ProductDetail: NextPage = () => {
	//const {} = useProducts();
	return (
		<>
			<div className='container'>
				<section></section>
				<section>
					<p>Product Detail</p>
				</section>
			</div>
		</>
	);
};

export default React.memo(ProductDetail);

export const getStaticPaths = async () => {
	return {
		paths: [],
		fallback: false
	}
}

export const getStaticProps = async () => {
	return {
		props: {}
	}
}
