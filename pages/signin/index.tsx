import Input from 'components/input';
import {NextPage} from 'next';
import React, {useEffect, useRef, useState} from 'react';
import {signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import {useSignInWithGoogle} from 'react-firebase-hooks/auth';
import {auth} from 'utils/firebase';
import {useAuth} from 'contexts/auth';
import {useRouter} from 'next/router';

const Signin: NextPage = () => {
	const [googleSignin] = useSignInWithGoogle(auth);
	const {user, loading, error} = useAuth();
	const {push, query} = useRouter();
	const redirect = query.redirect as string;

	useEffect(() => {
		if (!user) return;
		push(redirect ?? '/');
	}, [user]);

	return (
		<>
			<section className='h-full flex justify-center items-center'>
				<div className='p-40'>
					{loading ? (
						'loading'
					) : (
						<button onClick={() => googleSignin(['email', 'profile'])}>
							Continue With Google
						</button>
					)}
				</div>
			</section>
		</>
	);
};

export default React.memo(Signin);
 