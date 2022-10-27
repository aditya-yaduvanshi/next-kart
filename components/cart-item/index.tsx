import Button from 'components/button';
import ProductCard from 'components/product-card';
import {ICartItem, useCart} from 'contexts/cart';
import React from 'react';
import {FaMinus, FaPlus} from 'react-icons/fa';

type CartItemProps = {
	item: ICartItem;
};

const CartItem: React.FC<CartItemProps> = ({item}) => {
	const {increaseQuantity, decreaseQuantity, removeFromCart} = useCart();
	return (
		<>
			<li className='border border-zinc-400 p-2 rounded-lg'>
				<ProductCard
					product={item.product}
					thumbnailHeight='75'
					thumbnailWidth='75'
				/>
				<div className='flex flex-col gap-2'>
					<div className='flex justify-evenly'>
						<span>Total Price:</span>
						<strong className='text-green-500'>Rs. {item.price}</strong>
					</div>
					<div className='flex justify-evenly items-center'>
						<button
							disabled={item.quantity <= 1}
							onClick={() => decreaseQuantity(item)}
							className='bg-red-500 p-2 flex justify-center items-center rounded-md disabled:opacity-40'
						>
							<FaMinus />
						</button>
						<span>
							Total Quantity: <strong>{item.quantity}</strong>
						</span>
						<button
							disabled={item.quantity >= 5}
							onClick={() => increaseQuantity(item)}
							className='bg-green-500 p-2 flex justify-center items-center rounded-md disabled:opacity-40'
						>
							<FaPlus />
						</button>
					</div>
					<Button
						onClick={() => removeFromCart(item.id)}
						variant='primary'
						className='w-full'
					>
						Remove
					</Button>
				</div>
			</li>
		</>
	);
};

export default React.memo(CartItem);
