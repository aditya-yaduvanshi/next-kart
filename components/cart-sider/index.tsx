import Button from 'components/button';
import CartItem from 'components/cart-item';
import ProductCard from 'components/product-card';
import Spinner from 'components/spinner';
import {useCart} from 'contexts/cart';
import React, { useEffect } from 'react';
import {FaMinus, FaPlus} from 'react-icons/fa';

type CartSiderProps = {
	open: boolean;
};

const CartSider: React.FC<CartSiderProps> = ({open}) => {
	const {
		cart,
		loading,
		error,
		totalPrice,
		totalQuantity,
		getCartItems,
	} = useCart();

	useEffect(() => {
		(async () => await getCartItems({page: 1, limit: 20}))();
	},[getCartItems]);

	return (
		<>
			<aside
				className={`bg-zinc-700 z-40 absolute top-0 right-0 h-full ${
					open ? 'w-1/5' : 'w-0'
				} text-white transition-all duration-200`}
			>
				<div className='p-2'>
					<div className='flex justify-between items-center'>
						<span>Total Items In The Cart:</span>
						<strong>{totalQuantity}</strong>
					</div>
					<div className='flex justify-between items-center'>
						<span>Total Price Of The Cart:</span>{' '}
						<strong className='text-green-500'>Rs. {totalPrice}</strong>
					</div>
				</div>
				<ul className='p-2'>
					{cart.map((item) => (
						<CartItem item={item} key={item.id} />
					))}
					{loading && <Spinner />}
				</ul>
			</aside>
		</>
	);
};

export default React.memo(CartSider);
