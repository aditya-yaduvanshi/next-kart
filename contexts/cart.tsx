import {ProductCardProps} from 'components/product-card';
import {CARTS_URL} from 'constants/urls';
import useLocalStorage from 'hooks/useLocalStorage';
import React, {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import {getHeaders} from './auth';
import {IQuery} from './products';

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
	loading: boolean;
	error: string;
	increaseQuantity: (id: ProductCardProps['product']['id']) => Promise<void>;
	decreaseQuantity: (id: ProductCardProps['product']['id']) => Promise<void>;
	getCartItems: (query: IQuery) => Promise<void>;
	addToCart: (id: ProductCardProps['product']['id']) => Promise<void>;
	removeFromCart: (id: ProductCardProps['product']['id']) => Promise<void>;
	clearCart: () => void;
}

const CartContext = createContext<ICartContext | null>(null);

export const useCart = () => {
	return useContext(CartContext) as ICartContext;
};

const CartProvider: React.FC<PropsWithChildren> = ({children}) => {
	const [cartSider, setCartSider] = useState(false);
	const [cart, setCart] = useLocalStorage<ICartContext['cart']>('cart', []);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [totalPrice, setTotalPrice] = useState(0);
	const [totalQuantity, setTotalQuantity] = useState(0);

	useEffect(() => {
		let [totalPrice, totalQuantity] = cart.reduce(
			([price, quantity], item) => {
				price += item.price;
				quantity += item.quantity;
				return [price, quantity];
			},
			[0, 0]
		);

		setTotalPrice(totalPrice);
		setTotalQuantity(totalQuantity);
	}, [cart]);

	const toggleSiderCart = useCallback(() => {
		setCartSider((prev) => !prev);
	}, []);

	const increaseQuantity: ICartContext['increaseQuantity'] = useCallback(
		async (id) => {
			let item =  cart.find(item => item.product.id === id);
				if(!item) return;
			try {
				const res = await fetch(`${CARTS_URL}/${id}`, {
					method: 'PUT',
					body: JSON.stringify({
						quantity: item.quantity + 1,
						price: item.price + item.product.price,
					}),
					headers: getHeaders('')
				});
				
			} catch (err) {}
		},
		[]
	);

	const decreaseQuantity: ICartContext['decreaseQuantity'] = useCallback(
		async (id) => {},
		[]
	);

	const getCartItems: ICartContext['getCartItems'] = useCallback(
		async ({page = 1, limit = 10}) => {
			try {
				fetch(CARTS_URL, {
					headers: {},
				});
			} catch (err) {}
		},
		[]
	);

	const addToCart: ICartContext['addToCart'] = useCallback(async (id) => {},
	[]);

	const removeFromCart: ICartContext['removeFromCart'] = useCallback(
		async (id) => {},
		[]
	);

	const clearCart: ICartContext['clearCart'] = useCallback(() => {
		setCart([]);
	}, []);

	return (
		<>
			<CartContext.Provider
				value={{
					state: cartSider,
					toggleSiderCart,
					cart: [...cart],
					increaseQuantity,
					decreaseQuantity,
					getCartItems,
					addToCart,
					removeFromCart,
					clearCart,
					totalPrice,
					totalQuantity,
					loading,
					error,
				}}
			>
				{children}
			</CartContext.Provider>
		</>
	);
};

export default React.memo(CartProvider);
