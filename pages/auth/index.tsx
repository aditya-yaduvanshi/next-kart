import {NextPage} from 'next';
import React, {useEffect} from 'react';
import {useSignInWithGoogle} from 'react-firebase-hooks/auth';
import {auth} from 'utils/firebase';
import {useAuth} from 'contexts/auth';
import {useRouter} from 'next/router';
import {FaGoogle} from 'react-icons/fa';
import styles from './auth.module.css';

const Auth: NextPage = () => {
	const [googleSignin] = useSignInWithGoogle(auth);
	const {user} = useAuth();
	const {push, query} = useRouter();
	const redirect = query.redirect as string;

	useEffect(() => {
		if (!user) return;
		push(redirect ?? '/');
	}, [user]);

	return (
		<>
			<section className={styles.section}>
				<div className={styles.div}>
					<h1 className={styles.h1}>Authenticate</h1>
					<button
						onClick={() => googleSignin(['email', 'profile'])}
						className={styles.button}
					>
						<FaGoogle size='20' /> <span>Continue With Google</span>
					</button>
				</div>
			</section>
		</>
	);
};

export default React.memo(Auth);
