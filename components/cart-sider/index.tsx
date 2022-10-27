import Alert from 'components/alert';
import CartItem from 'components/cart-item';
import Pagination from 'components/pagination';
import Spinner from 'components/spinner';
import {useCart} from 'contexts/cart';
import React, {useEffect, useState} from 'react';

const LIMIT = 10;

const CartSider: React.FC = () => {
	const [page, setPage] = useState(1);
	const {cart, loading, error, totalPrice, totalQuantity, getCartItems} =
		useCart();
	const hasMoreItems = totalQuantity === page * LIMIT;

	useEffect(() => {
		getCartItems({page, limit: LIMIT});
	}, [page, LIMIT]);

	return (
		<>
			<aside className='bg-white border border-zinc-400 z-40 absolute top-0 right-0 h-[91%] w-1/4 overflow-y-auto text-black transition-all duration-200 flex flex-col gap-3 pb-5'>
				<div className='p-2'>
					<div className='flex justify-between items-center'>
						<span>Total Items In The Cart:</span>
						<strong>{totalQuantity}</strong>
					</div>
					<div className='flex justify-between items-center'>
						<span>Total Price Of The Cart:</span>
						<strong className='text-green-500'>Rs. {totalPrice}</strong>
					</div>
				</div>
				{loading && <Spinner />}
				{error ? <Alert type='error'>{error}</Alert> : null}
				<ul className='p-2 flex flex-col gap-5'>
					{cart.map((item) => (
						<CartItem item={item} key={item.id} />
					))}
				</ul>
				<Pagination
					page={page}
					onNext={
						hasMoreItems ? () => setPage((current) => current + 1) : undefined
					}
					onPrev={
						page <= 1 ? undefined : () => setPage((current) => current - 1)
					}
				/>
			</aside>
		</>
	);
};

export default React.memo(CartSider);
