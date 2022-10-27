import Alert from 'components/alert';
import Button from 'components/button';
import Spinner from 'components/spinner';
import {useCart} from 'contexts/cart';
import {IProduct} from 'contexts/products';
import React, {useCallback, useEffect} from 'react';

type ProductCartButtonProps = {
	productId: IProduct['id'];
};

const ProductCartButton: React.FC<ProductCartButtonProps> = ({productId}) => {
	const {cart, addToCart, removeFromCart, loading, error, getCartItems} = useCart();
	const incart = cart.find((item) => item.product.id === productId);

	const handleCart = async () => {
		if (incart) await removeFromCart(incart.id);
		else await addToCart(productId);
	};

	useEffect(() => {
		getCartItems({page: 1, limit: 10});
	},[getCartItems]);

	return (
		<>
			<Button disabled={loading} onClick={() => handleCart()} variant='primary'>
				{loading ? <Spinner className='bg-transparent text-[1em] w-full h-full' size='24' /> : incart ? 'Remove From Cart' : 'Add To Cart'}
			</Button>
			{error ? <Alert type='error'>{error}</Alert> : null}
		</>
	);
};

export default React.memo(ProductCartButton);
