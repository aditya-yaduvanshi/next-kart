import useLocalStorage from 'hooks/useLocalStorage';
import React, {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useState,
} from 'react';

interface ICategory {
	id: string;
	name: string;
	image: string;
}

interface ICategoryContext {
	categories: ICategory[];
	getCategories: () => void;
	createCategory: () => void;
	updateCategory: () => void;
	loading: boolean;
	error: string;
}

const CategoryContext = createContext<ICategoryContext | null>(null);

export const useCategories = () => {
	return useContext(CategoryContext) as ICategoryContext;
};

const CategoryProvider: React.FC<PropsWithChildren> = ({children}) => {
	const [categories, setCategories] = useLocalStorage<
		ICategoryContext['categories']
	>('categories', []);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const getCategories = useCallback(async () => {}, []);

	const createCategory = useCallback(async () => {}, []);

	const updateCategory = useCallback(async () => {}, []);

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
