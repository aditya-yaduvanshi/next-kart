import {USERS_URL} from 'constants/urls';
import {AuthProvider, User, signOut} from 'firebase/auth';
import React, {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from 'utils/firebase';

export type Role = 'admin' | 'customer';

export interface IUser {
	name?: string | null;
	email?: string | null;
	phone?: string | null;
	role?: Role;
	avatar?: string | null;
	uid: string;
	provider: AuthProvider['providerId'];
}

export interface IAuthContext {
	user: IUser | null;
	loading: boolean;
	error?: string;
	authUser?: User | null;
	authLoading: boolean;
	authError?: Error;
	signout: () => Promise<void>;
}

// interface IHandleResponse {
//   status: '200' | '201' | '204' | '400' | '401' | '403' | '404' | '500' | '502';
//   handler: {'200': Function, '201': Function, '204': Function, '206': Function, '400': Function, '401': Function, '403': Function, '404': Function, '500': Function, '502': Function};
// }

// const handleResponse = async ({status, handler}: IHandleResponse) => {
//   return handler[status];
// }

export const getHeaders = (token: string) => {
	return {
		'Content-Type': 'application/json',
		'Authorization': token,
	};
};

const AuthContext = createContext<IAuthContext | null>(null);

export const useAuth = () => {
	return useContext(AuthContext) as IAuthContext;
};

const AuthProvider: React.FC<PropsWithChildren> = ({children}) => {
	const [authUser, authLoading, authError] = useAuthState(auth);
	const [user, setUser] = useState<IAuthContext['user']>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>();

	useEffect(() => {
		setLoading(authLoading);
		if (authError) setError(authError.message);
	}, [authError, authLoading]);

	useEffect(() => {
		if (!authUser && !user) return;
		getUser();
	}, [authUser, USERS_URL]);

	const createUser = useCallback(
		async (user: IUser) => {
			if (!authUser) return;
			try {
				setLoading(true);
				const res = await fetch(USERS_URL, {
					method: 'POST',
					body: JSON.stringify(user),
					headers: getHeaders(await authUser.getIdToken()),
				});
				switch (res.status) {
					case 201: {
						setLoading(false);
						return;
					}
					case 400: {
						let result = await res.json();
						setError(result.error as string);
						setLoading(false);
						return;
					}
					default: {
						setError('Something Went Wrong! Please try again later!');
						setLoading(false);
						return;
					}
				}
			} catch (err) {
				setLoading(false);
				console.log((err as Error).message);
			}
		},
		[USERS_URL, authUser]
	);

	const getUser = useCallback(async () => {
		if (!authUser) return;
		try {
			setLoading(true);
			const res = await fetch(`${USERS_URL}/${authUser.uid}`, {
				headers: getHeaders(await authUser.getIdToken()),
			});
			switch (res.status) {
				case 200: {
					let result = await res.json();
					setUser(result);
					setLoading(false);
					return;
				}
				case 400: {
					let result = await res.json();
					setError(result.error as string);
					setLoading(false);
					return;
				}
				case 401: {
					setUser(null);
					setError('Please Signin Again!');
					setLoading(false);
					return;
				}
				case 404: {
					setLoading(false);
					let userData: IUser = {
						name: authUser.displayName,
						email: authUser.email,
						phone: authUser.phoneNumber,
						avatar: authUser.photoURL,
						uid: authUser.uid,
						role: 'customer',
						provider: authUser.providerData[0].providerId,
					};
					await createUser(userData);
					if (!error) setUser(userData);
					return;
				}
				default: {
					setError('Something Went Wrong! Please try again later!');
					setLoading(false);
					return;
				}
			}
		} catch (err) {
			setLoading(false);
			console.log((err as Error).message);
		}
	}, [authUser, createUser]);

	const signout = useCallback(async () => {
		await signOut(auth);
		setUser(null);
	}, []);

	return (
		<>
			<AuthContext.Provider
				value={{
					user: user ? {...user} : user,
					loading,
					error,
					authUser: authUser ? {...authUser} : authUser,
					authLoading,
					authError,
					signout
				}}
			>
				{children}
			</AuthContext.Provider>
		</>
	);
};

export default React.memo(AuthProvider);
