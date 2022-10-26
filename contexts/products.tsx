import {PRODUCTS_URL} from 'constants/urls';

import React, {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import {useAuth} from './auth';
import { ICategory } from './categories';

export interface IProduct {
	title: string;
	slug: string;
	price: number;
	thumbnail: string;
	id: string;
}

export interface IProductDetail extends IProduct {
	description?: string;
	images?: string[];
	stock: number;
	category: ICategory | string;
	brand: string;
}

export type ProductFields = (keyof IProductDetail)[];

export interface IQuery {
	page?: number;
	limit?: number;
}

interface IProductQuery extends IQuery {
	category?: string;
}

interface IProductContext {
	products: IProduct[];
	loading: boolean;
	error: string;
	getProducts: (query: IProductQuery) => Promise<void>;
	getProductDetails: (id: IProduct['id']) => Promise<IProductDetail | void>;
	addNewProduct: (product: Omit<IProductDetail, 'id' | 'slug'>) => Promise<void>;
	editProduct: (
		id: IProduct['id'],
		product: Partial<IProductDetail>
	) => Promise<void>;
	removeProduct: (id: IProduct['id']) => Promise<void>;
}

const ProductContext = createContext<IProductContext | null>(null);

export const useProducts = () => {
	return useContext(ProductContext) as IProductContext;
};

type ProductProviderProps = PropsWithChildren & {
	initialValue?: IProduct[];
}

const ProductProvider: React.FC<ProductProviderProps> = ({children, initialValue}) => {
	const {signout} = useAuth();
	const [products, setProducts] = useState<IProductContext['products']>(initialValue ?? []);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!error) return;
		let timeout = setTimeout(() => setError(''), 5000);
		return () => clearTimeout(timeout);
	}, [error]);

	const getProducts: IProductContext['getProducts'] = useCallback(
		async ({page = 1, limit = 20, category}) => {
			try {
				setLoading(true);
				let query = `page=${page}&limit=${limit}`;
				if (category) query = `${query}&category=${category}`;

				const res = await fetch(`${PRODUCTS_URL}?${query}`);
				switch (res.status) {
					case 200: {
						const result = (await res.json()) as IProductContext['products'];
						setProducts((current) => [...current, ...result]);
						setLoading(false);
						return;
					}
					case 400: {
						const result = await res.json();
						setError(result.error as string);
						setLoading(false);
						return;
					}
					default: {
						setError('Something went wrong! Please try again later!');
						setLoading(false);
						return;
					}
				}
			} catch (err) {
				setError('Something went wrong! Please try again later!');
				setLoading(false);
			}
		},
		[PRODUCTS_URL]
	);

	const getProductDetails: IProductContext['getProductDetails'] = useCallback(
		async (id) => {
			try {
				setLoading(true);
				const res = await fetch(`${PRODUCTS_URL}/${id}`);
				switch (res.status) {
					case 200: {
						const result = (await res.json()) as IProductDetail;
						setLoading(false);
						return result;
					}
					case 400: {
						const result = await res.json();
						setError(result.error as string);
						setLoading(false);
						return;
					}
					default: {
						setError('Something went wrong! Please try again later!');
						setLoading(false);
						return;
					}
				}
			} catch (err) {
				setError((err as Error).message);
				setLoading(false);
			}
		},
		[PRODUCTS_URL]
	);

	const addNewProduct: IProductContext['addNewProduct'] = useCallback(
		async (product) => {
			try {
				setLoading(true);
				const res = await fetch(PRODUCTS_URL, {
					method: 'POST',
					body: JSON.stringify(product),
					headers: {
						'Content-Type': 'application/json'
					}
				});
				switch (res.status) {
					case 201: {
						const result = (await res.json()) as IProduct;
						setProducts((current) => [result, ...current]);
						setLoading(false);
						return;
					}
					case 400: {
						const result = await res.json();
						setError(result.error as string);
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
			} catch (err) {
				setLoading(false);
				setError((err as Error).message);
			}
		},
		[PRODUCTS_URL]
	);

	const editProduct: IProductContext['editProduct'] = useCallback(
		async (id, product) => {
			try {
				setLoading(true);
				const res = await fetch(`${PRODUCTS_URL}/${id}`, {
					method: 'PUT',
					body: JSON.stringify(product),
					headers: {
						'Content-Type': 'application/json'
					}
				});
				switch (res.status) {
					case 200: {
						const result = await res.json();
						setProducts((current) => {
							let index = current.findIndex((p) => p.id === id);
							if (index < 0) {
							} else
								current[index] = {
									...current[index],
									...result,
								};
							return [...current];
						});
						setLoading(false);
						return;
					}
					case 400: {
						const result = await res.json();
						setError(result.error as string);
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
					}
				}
			} catch (err) {
				setLoading(false);
				setError((err as Error).message);
			}
		},
		[PRODUCTS_URL]
	);

	const removeProduct: IProductContext['removeProduct'] = useCallback(
		async (id) => {
			try {
				setLoading(true);
				const res = await fetch(`${PRODUCTS_URL}/${id}`);
				switch (res.status) {
					case 204: {
						setProducts((current) => current.filter((p) => p.id !== id));
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
					}
				}
			} catch (err) {
				setLoading(false);
				setError((err as Error).message);
			}
		},
		[PRODUCTS_URL]
	);

	return (
		<>
			<ProductContext.Provider
				value={{
					products: [...products],
					getProducts,
					getProductDetails,
					addNewProduct,
					editProduct,
					removeProduct,
					loading,
					error,
				}}
			>
				{children}
			</ProductContext.Provider>
		</>
	);
};

export default React.memo(ProductProvider);
