import Button from 'components/button';
import Spinner from 'components/spinner';
import {useCart} from 'contexts/cart';
import {IProduct} from 'contexts/products';
import React, {useCallback} from 'react';

type ProductCartButtonProps = {
	productId: IProduct['id'];
};

const ProductCartButton: React.FC<ProductCartButtonProps> = ({productId}) => {
	const {cart, addToCart, removeFromCart, loading, error} = useCart();
	const incart = cart.find((item) => item.product.id === productId)
		? true
		: false;

	const handleCart = useCallback(async () => {
		if (incart) await removeFromCart(productId);
		else await addToCart(productId);
	}, [addToCart, removeFromCart, productId, incart]);

	return (
		<>
			<Button disabled={loading} onClick={() => handleCart()} variant='primary'>
				{loading ? <Spinner/> : incart ? 'Remove From Cart' : 'Add To Cart'}
			</Button>
		</>
	);
};

export default React.memo(ProductCartButton);
