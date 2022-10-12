import React, {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useState,
} from 'react';

export interface ISiderContext {
	state: boolean;
	toggleSider: () => void;
}

const SiderContext = createContext<ISiderContext | null>(null);

export const useSider = () => {
	return useContext(SiderContext) as ISiderContext;
};

const SiderProvider: React.FC<PropsWithChildren> = ({children}) => {
	const [sider, setSider] = useState(false);

	const toggleSider = useCallback(() => {
		setSider((prev) => !prev);
	}, []);

	return (
		<>
			<SiderContext.Provider value={{state: !!sider, toggleSider}}>
				{children}
			</SiderContext.Provider>
		</>
	);
};

export default React.memo(SiderProvider);
