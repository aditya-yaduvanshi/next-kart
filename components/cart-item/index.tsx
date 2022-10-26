import ProductCard from 'components/product-card';
import { ICartItem, useCart } from 'contexts/cart';
import React from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

type CartItemProps = {
  item: ICartItem;
}

const CartItem: React.FC<CartItemProps> = ({item}) => {
  const {increaseQuantity, decreaseQuantity} = useCart();
	return (
		<>
			<li>
				<ProductCard product={item.product} />
				<div>
					<div className='flex justify-evently'>
						<span>Total Price:</span>
						<strong className='text-green-500'>Rs. {item.price}</strong>
					</div>
					<div className='flex justify-evenly items-center'>
						<button
							disabled={item.quantity <= 1}
							onClick={() => decreaseQuantity(item.product.id)}
						>
							<FaMinus />
						</button>
						<span>
							Total Quantity: <strong>{item.quantity}</strong>
						</span>
						<button
							disabled={item.quantity >= 5}
							onClick={() => increaseQuantity(item.product.id)}
						>
							<FaPlus />
						</button>
					</div>
				</div>
			</li>
		</>
	);
};

export default React.memo(CartItem);
