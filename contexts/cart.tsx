import {ProductCardProps} from 'components/product-card';
import {CARTS_URL} from 'constants/urls';
import React, {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import {useAuth} from './auth';
import {IQuery} from './products';

export interface ICartItem {
	id: string;
	product: ProductCardProps['product'];
	quantity: number;
	price: number;
}

export interface ICartContext {
	cart: ICartItem[];
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
	const {signout} = useAuth();
	const [cart, setCart] = useState<ICartContext['cart']>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [totalPrice, setTotalPrice] = useState(0);
	const [totalQuantity, setTotalQuantity] = useState(0);

	useEffect(() => {
		if (!error) return;
		let timeout = setTimeout(() => setError(''), 5000);
		return () => clearTimeout(timeout);
	}, [error]);

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

	const increaseQuantity: ICartContext['increaseQuantity'] = useCallback(
		async (id) => {
			let item = cart.find((item) => item.id === id);
			if (!item) return;
			setLoading(true);
			try {
				const res = await fetch(`${CARTS_URL}/${id}`, {
					method: 'PUT',
					body: JSON.stringify({
						quantity: item.quantity + 1,
					}),
					headers: {
						'Content-Type': 'application/json',
					},
				});
				switch (res.status) {
					case 200: {
						const result = await res.json();
						setCart((current) => {
							let index = current.findIndex((i) => i.id === id);
							if (index < 0) {
							} else {
								current[index].price = result.price;
								current[index].quantity = result.quantity;
							}
							return [...current];
						});
						setLoading(false);
						return;
					}
					case 400: {
						const result = await res.json();
						setError(result.error);
						setLoading(false);
						return;
					}
					case 401: {
						setError('Your session has expired! Please signin again!');
						setLoading(false);
						return await signout();
					}
					default: {
						setError('Something went wrong! Please try again later!');
						setLoading(false);
						return;
					}
				}
			} catch (err) {}
		},
		[CARTS_URL]
	);

	const decreaseQuantity: ICartContext['decreaseQuantity'] = useCallback(
		async (id) => {
			let item = cart.find((item) => item.id === id);
			if (!item) return;
			setLoading(true);
			try {
				const res = await fetch(`${CARTS_URL}/${id}`, {
					method: 'PUT',
					body: JSON.stringify({
						quantity: item.quantity - 1,
					}),
					headers: {
						'Content-Type': 'application/json',
					},
				});
				switch (res.status) {
					case 200: {
						const result = await res.json();
						setCart((current) => {
							let index = current.findIndex((i) => i.id === id);
							if (index < 0) {
							} else {
								current[index].price = result.price;
								current[index].quantity = result.quantity;
							}
							return [...current];
						});
						setLoading(false);
						return;
					}
					case 400: {
						const result = await res.json();
						setError(result.error);
						setLoading(false);
						return;
					}
					case 401: {
						setError('Your session has expired! Please signin again!');
						setLoading(false);
						return await signout();
					}
					default: {
						setError('Something went wrong! Please try again later!');
						setLoading(false);
						return;
					}
				}
			} catch (err) {}
		},
		[CARTS_URL]
	);

	const getCartItems: ICartContext['getCartItems'] = useCallback(
		async ({page = 1, limit = 10}) => {
			setLoading(true);
			try {
				const res = await fetch(`${CARTS_URL}?page=${page}&limit=${limit}`);
				switch (res.status) {
					case 200: {
						const result = (await res.json()) as ICartContext['cart'];
						setCart(result);
						setLoading(false);
						return;
					}
					case 400: {
						const result = await res.json();
						setError(result.error);
						setLoading(false);
						return;
					}
					case 401: {
						setError('Your session has expired! Please signin again!');
						setLoading(false);
						return await signout();
					}
					default: {
						setError('Something went wrong! Please try again later!');
						setLoading(false);
						return;
					}
				}
			} catch (err) {}
		},
		[CARTS_URL, signout]
	);

	const addToCart: ICartContext['addToCart'] = useCallback(
		async (product) => {
			setLoading(true);
			try {
				const res = await fetch(CARTS_URL, {
					method: 'POST',
					body: JSON.stringify({
						product,
					}),
					headers: {
						'Content-Type': 'application/json',
					},
				});
				switch (res.status) {
					case 201: {
						const result = await res.json();
						setCart((current) => [result, ...current]);
						setLoading(false);
						return;
					}
					case 400: {
						const result = await res.json();
						setError(result.error);
						setLoading(false);
						return;
					}
					case 401: {
						setError('Your session has expired! Please signin again!');
						setLoading(false);
						return await signout();
					}
					default: {
						setError('Something went wrong! Please try again later!');
						setLoading(false);
						return;
					}
				}
			} catch (err) {}
		},
		[CARTS_URL, signout]
	);

	const removeFromCart: ICartContext['removeFromCart'] = useCallback(
		async (id) => {
			setLoading(true);
			const res = await fetch(`${CARTS_URL}/${id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			switch (res.status) {
				case 204: {
					setCart((current) => current.filter((item) => item.id === id));
					setLoading(false);
					return;
				}
				case 400: {
					const result = await res.json();
					setError(result.error);
					setLoading(false);
					return;
				}
				case 401: {
					setError('Your session has expired! Please signin again!');
					setLoading(false);
					return await signout();
				}
				default: {
					setError('Something went wrong! Please try again later!');
					setLoading(false);
					return;
				}
			}
		},
		[CARTS_URL, signout]
	);

	const clearCart: ICartContext['clearCart'] = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch(CARTS_URL, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			switch (res.status) {
				case 204: {
					setCart([]);
					setLoading(false);
					return;
				}
				case 400: {
					const result = await res.json();
					setError(result.error);
					setLoading(false);
					return;
				}
				case 401: {
					setError('Your session has expired! Please signin again!');
					setLoading(false);
					return await signout();
				}
				default: {
					setError('Something went wrong! Please try again later!');
					setLoading(false);
					return;
				}
			}
		} catch (err) {}
	}, [signout, CARTS_URL]);

	return (
		<>
			<CartContext.Provider
				value={{
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
