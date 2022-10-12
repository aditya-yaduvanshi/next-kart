import ProductCard from 'components/product-card';
import Spinner from 'components/spinner';
import {useCart} from 'contexts/cart';
import React from 'react';

const CartSider: React.FC = () => {
	const {
		cart,
		loading,
		error,
		increaseQuantity,
		decreaseQuantity,
		totalPrice,
		totalQuantity,
	} = useCart();

	return (
		<>
			<aside className='bg-zinc-700 z-40 absolute top-0 right-0 h-full w-1/4 text-white'>
				<div>
					<p>Total Items In The Cart: {totalQuantity}</p>
					<p>Total Price Of The Cart: {totalPrice}</p>
				</div>
				<ul>
					{cart.map((item) => (
						<>
							<li key={item.product.id}>
								<ProductCard product={item.product} />
								<div>
									<p>
										Total Price: <strong>Rs.{item.price}</strong>
									</p>
									<button onClick={() => decreaseQuantity(item.product.id)}>
										-
									</button>
									<span>
										Total Quantity: <strong>{item.quantity}</strong>
									</span>
									<button onClick={() => increaseQuantity(item.product.id)}>
										+
									</button>
								</div>
							</li>
						</>
					))}
					{loading && <Spinner />}
				</ul>
			</aside>
		</>
	);
};

export default React.memo(CartSider);
