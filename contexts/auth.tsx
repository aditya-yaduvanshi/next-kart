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
	useEffect,
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
	token?: string | null;
}

export interface IAuthContext {
	user: IUser | null;
	loading: boolean;
	error: string;
	signout: () => Promise<void>;
	claimUser: (user: User, type: ClaimType) => Promise<void>;
	signin: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string) => Promise<void>;
	googleSignin: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const useAuth = () => {
	return useContext(AuthContext) as IAuthContext;
};

const AuthProvider: React.FC<PropsWithChildren> = ({children}) => {
	const [user, setUser] = useState<IAuthContext['user']>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		if (!error) return;
		let timeout = setTimeout(() => setError(''), 5000);
		return () => clearTimeout(timeout);
	}, [error]);

	const claimUser: IAuthContext['claimUser'] = useCallback(
		async (authUser, type) => {
			try {
				setLoading(true);
				let token = await authUser.getIdToken();
				const res = await fetch(USERS_URL, {
					method: 'POST',
					body: JSON.stringify({
						token: token,
						type,
					}),
					headers: {
						'Content-Type': 'application/json',
					},
				});
				switch (res.status) {
					case 200: {
						const result = (await res.json()) as IUser;
						setUser((current) => {
							if (!current) return result;
							return {...current, ...result};
						});
						setLoading(false);
						return;
					}
					case 400: {
						let result = await res.json();
						console.log(result)
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
				setError('Something Went Wrong! Please try again later!');
				setLoading(false);
			}
		},
		[USERS_URL]
	);

	const updateSession = useCallback(
		async (authUser: User) => {
			try {
				setLoading(true);
				let token = await authUser.getIdToken();
				const res = await fetch(USERS_URL, {
					method: 'PUT',
					body: JSON.stringify({
						token: token,
					}),
					headers: {
						'Content-Type': 'application/json',
					},
				});
				switch (res.status) {
					case 204: {
						setUser((current) => {
							if (!current) return null;
							return {...current, token};
						});
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
				setError('Something Went Wrong! Please try again later!');
				setLoading(false);
			}
		},
		[USERS_URL]
	);

	const register: IAuthContext['register'] = useCallback(
		async (email, password) => {
			try {
				setLoading(true);
				const {user} = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);
				await claimUser(user, 'register');
				setLoading(false);
			} catch (err) {
				setError('Something Went Wrong! Please try again later!');
				setLoading(false);
			}
		},
		[claimUser, createUserWithEmailAndPassword, auth]
	);

	const signin: IAuthContext['signin'] = useCallback(
		async (email, password) => {
			try {
				setLoading(true);
				const {user} = await signInWithEmailAndPassword(auth, email, password);
				await claimUser(user, 'signin');
				setLoading(false);
			} catch (err) {
				setError('Something Went Wrong! Please try again later!');
				setLoading(false);
			}
		},
		[claimUser, signInWithEmailAndPassword, auth]
	);

	const googleSignin: IAuthContext['googleSignin'] = useCallback(async () => {
		try {
			setLoading(true);
			const {user} = await signInWithPopup(auth, google);
			await claimUser(user, 'register');
			setLoading(false);
		} catch (err) {
			setError((err as Error).message);
			setLoading(false);
		}
	}, [claimUser, signInWithPopup, google, auth]);

	const signout = useCallback(async () => {
		setLoading(true);
		await fetch(USERS_URL);
		await signOut(auth);
		setUser(null);
		setLoading(false);
	}, [USERS_URL, signOut, auth]);

	useEffect(() => {
		let unsubscribe = auth.onIdTokenChanged(async (currentUser) => {
			if (!currentUser) return;
			let [token, result] = await Promise.all([currentUser.getIdToken(), currentUser.getIdTokenResult()]);
			if(!user) {
				setUser({
					name: currentUser.displayName,
					email: currentUser.email,
					phone: currentUser.phoneNumber,
					avatar: currentUser.photoURL,
					uid: currentUser.uid,
					role: result.claims.role,
					token,
				});
			}
			if (token === user?.token) return;
			await updateSession(currentUser);
		});
		return () => unsubscribe();
	}, [auth, updateSession]);

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
					register,
				}}
			>
				{children}
			</AuthContext.Provider>
		</>
	);
};

export default React.memo(AuthProvider);
