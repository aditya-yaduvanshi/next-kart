import useLocalStorage from 'hooks/useLocalStorage';
import React, {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useState,
} from 'react';

export interface IProduct {
	title: string;
	slug: string;
	price: number;
	thumbnail: string;
	id: string;
	rating: number;
}

export interface IProductDetail extends IProduct {
	description?: string;
	images?: string[];
	stock: number;
	category: string;
}

interface IProductContext {
	products: IProduct[];
	loading: boolean;
	error: string;
	getProducts: () => void;
	getProductDetails: () => void;
	addNewProduct: () => void;
	editProduct: () => void;
	removeProduct: () => void;
}

const ProductContext = createContext<IProductContext | null>(null);

export const useProducts = () => {
	return useContext(ProductContext) as IProductContext;
};

const ProductProvider: React.FC<PropsWithChildren> = ({children}) => {
	const [products, setProducts] = useLocalStorage<IProductContext['products']>(
		'products',
		[]
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const getProducts: IProductContext['getProducts'] = useCallback(async () => {
		try {
		} catch (err) {}
	}, []);

	const getProductDetails: IProductContext['getProductDetails'] =
		useCallback(async () => {
			try {
			} catch (err) {}
		}, []);

	const addNewProduct: IProductContext['addNewProduct'] =
		useCallback(async () => {
			try {
			} catch (err) {}
		}, []);

	const editProduct: IProductContext['editProduct'] = useCallback(async () => {
		try {
		} catch (err) {}
	}, []);

	const removeProduct: IProductContext['removeProduct'] =
		useCallback(async () => {
			try {
			} catch (err) {}
		}, []);

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