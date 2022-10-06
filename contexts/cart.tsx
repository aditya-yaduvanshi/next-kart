import {ProductCardProps} from 'components/product-card';
import useLocalStorage from 'hooks/useLocalStorage';
import React, {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useState,
} from 'react';

export interface ICartContext {
	state: boolean;
	toggleSiderCart: () => void;
	cart: {
		product: ProductCardProps['product'];
		quantity: number;
		price: number;
	}[];
	totalPrice: number;
	totalQuantity: number;
	increaseQuantity: (id: ProductCardProps['product']['id']) => void;
	decreaseQuantity: (id: ProductCardProps['product']['id']) => void;
	addToCart: (id: ProductCardProps['product']['id']) => void;
	removeFromCart: (id: ProductCardProps['product']['id']) => void;
}

const CartContext = createContext<ICartContext | null>(null);

export const useCart = () => {
	return useContext(CartContext) as ICartContext;
};

const CartProvider: React.FC<PropsWithChildren> = ({children}) => {
	const [cartSider, setCartSider] = useState(false);
	const [cart, setCart] = useLocalStorage<ICartContext['cart']>('cart', []);
	const [totalPrice, setTotalPrice] = useState(0);
	const [totalQuantity, setTotalQuantity] = useState(0);

	const toggleSiderCart = useCallback(() => {
		setCartSider((prev) => !prev);
	}, []);

	const increaseQuantity: ICartContext['increaseQuantity'] = useCallback((id) => {}, []);

	const decreaseQuantity: ICartContext['decreaseQuantity'] = useCallback((id) => {}, []);

	const addToCart: ICartContext['addToCart'] = useCallback((id) => {}, []);

	const removeFromCart: ICartContext['removeFromCart'] = useCallback((id) => {}, []);

	return (
		<>
			<CartContext.Provider
				value={{
					state: cartSider,
					toggleSiderCart,
					cart: [...cart],
					increaseQuantity,
					decreaseQuantity,
					addToCart,
					removeFromCart,
					totalPrice,
					totalQuantity,
				}}
			>
				{children}
			</CartContext.Provider>
		</>
	);
};

export default React.memo(CartProvider);
