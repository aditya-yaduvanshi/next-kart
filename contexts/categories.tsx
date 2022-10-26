import {CATEGORIES_URL} from 'constants/urls';
import React, {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import {useAuth} from './auth';

export interface ICategory {
	id: string;
	name: string;
	image: string;
}

export interface ICategoryContext {
	categories: ICategory[];
	getCategories: () => Promise<void>;
	createCategory: (category: Omit<ICategory, 'id'>) => Promise<void>;
	updateCategory: (id: ICategory['id'], category: Partial<ICategory>) => Promise<void>;
	loading: boolean;
	error: string;
}

const CategoryContext = createContext<ICategoryContext | null>(null);

export const useCategories = () => {
	return useContext(CategoryContext) as ICategoryContext;
};

const CategoryProvider: React.FC<PropsWithChildren> = ({children}) => {
	const {signout} = useAuth();
	const [categories, setCategories] = useState<ICategoryContext['categories']>(
		[]
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!error) return;
		let timeout = setTimeout(() => setError(''), 5000);
		return () => clearTimeout(timeout);
	}, [error]);

	const getCategories: ICategoryContext['getCategories'] =
		useCallback(async () => {
			try {
				setLoading(true);
				const res = await fetch(CATEGORIES_URL);
				switch (res.status) {
					case 200: {
						const result = (await res.json()) as ICategoryContext['categories'];
						setCategories(result);
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
				setError((err as Error).message);
				setLoading(false);
			}
		}, [CATEGORIES_URL]);

	const createCategory: ICategoryContext['createCategory'] = useCallback(
		async (category) => {
			try {
				setLoading(true);
				const res = await fetch(CATEGORIES_URL, {
					method: 'POST',
					body: JSON.stringify(category),
					headers: {
						'Content-Type': 'application/json'
					}
				});
				switch (res.status) {
					case 201: {
						const result = (await res.json()) as ICategory;
						setCategories((current) => [result, ...current]);
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
				setError((err as Error).message);
				setLoading(false);
			}
		},
		[CATEGORIES_URL]
	);

	const updateCategory: ICategoryContext['updateCategory'] = useCallback(
		async (id, category) => {
			try {
				const res = await fetch(`${CATEGORIES_URL}/${id}`, {
					method: 'PUT',
					body: JSON.stringify(category),
					headers: {
						'Content-Type': 'application/json'
					}
				});
				switch (res.status) {
					case 200: {
						const result = await res.json();
						setCategories((current) => {
							let index = current.findIndex((cat) => cat.id === id);
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
						return;
					}
				}
			} catch (err) {
				setError((err as Error).message);
				setLoading(false);
			}
		},
		[CATEGORIES_URL]
	);

	return (
		<>
			<CategoryContext.Provider
				value={{
					categories: [...categories],
					getCategories,
					createCategory,
					updateCategory,
					loading,
					error,
				}}
			>
				{children}
			</CategoryContext.Provider>
		</>
	);
};

export default React.memo(CategoryProvider);
