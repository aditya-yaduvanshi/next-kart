import {USERS_URL} from 'constants/urls';
import {
	User,
	signOut,
	signInWithEmailAndPassword,
	signInWithPopup,
	OAuthProvider,
	createUserWithEmailAndPassword,
} from 'firebase/auth';
import React, {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useState,
} from 'react';
import {auth} from 'utils/firebase';

export type Role = 'admin' | 'customer';
export type ClaimType = 'register' | 'signin';

const google = new OAuthProvider('google.com');
google.addScope('email');
google.addScope('profile');

export interface IUser {
	name?: string | null;
	email?: string | null;
	phone?: string | null;
	role?: Role;
	avatar?: string | null;
	uid: string;
}

export interface IAuthContext {
	user: IUser | null;
	loading: boolean;
	error?: string;
	signout: () => Promise<void>;
	claimUser: (user: User, type: ClaimType) => Promise<void>;
	signin: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string) => Promise<void>;
	googleSignin: () => Promise<void>;
}

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
	const [user, setUser] = useState<IAuthContext['user']>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>();

	const claimUser: IAuthContext['claimUser'] = useCallback(
		async (user, type) => {
			try {
				setLoading(true);
				let token = await user.getIdToken();
				const res = await fetch(USERS_URL, {
					method: 'POST',
					body: JSON.stringify({
						token,
						type,
					}),
					headers: getHeaders(token),
				});
				switch (res.status) {
					case 200: {
						const result = (await res.json()) as IUser;
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
		[USERS_URL, getHeaders]
	);

	const register: IAuthContext['register'] = useCallback(
		async (email, password) => {
			try {
				const {user} = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);
				await claimUser(user, 'register');
			} catch (err) {
				setError((err as Error).message);
				setLoading(false);
			}
		},
		[claimUser, createUserWithEmailAndPassword, auth]
	);

	const signin: IAuthContext['signin'] = useCallback(
		async (email, password) => {
			try {
				const {user} = await signInWithEmailAndPassword(auth, email, password);
				await claimUser(user, 'signin');
			} catch (err) {
				setError((err as Error).message);
				setLoading(false);
			}
		},
		[claimUser, signInWithEmailAndPassword, auth]
	);

	const googleSignin: IAuthContext['googleSignin'] = useCallback(async () => {
		try {
			const {user} = await signInWithPopup(auth, google);
			await claimUser(user, 'register');
		} catch (err) {
			setError((err as Error).message);
			setLoading(false);
		}
	}, [claimUser, signInWithPopup, google, auth]);

	const signout = useCallback(async () => {
		await signOut(auth);
		setUser(null);
	}, []);

	return (
		<>
			<AuthContext.Provider
				value={{
					user: user ? {...user} : user,
					claimUser,
					loading,
					error,
					signout,
					signin,
					googleSignin,
					register
				}}
			>
				{children}
			</AuthContext.Provider>
		</>
	);
};

export default React.memo(AuthProvider);
