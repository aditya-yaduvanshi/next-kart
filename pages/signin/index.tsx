import {NextPage} from 'next';
import React, {useEffect} from 'react';
import {useSignInWithGoogle} from 'react-firebase-hooks/auth';
import {auth} from 'utils/firebase';
import {useAuth} from 'contexts/auth';
import {useRouter} from 'next/router';
import {FaGoogle} from 'react-icons/fa';

const Signin: NextPage = () => {
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
			<section className='h-full flex justify-center items-center'>
				<div className='p-32 rounded border border-slate-500 bg-zinc-100'>
					<h1 className='text-xl uppercase text-center'>Sign In</h1>
					<button
						onClick={() => googleSignin(['email', 'profile'])}
						className='bg-red-500 flex justify-center items-center mt-5 p-2 gap-2 text-white rounded hover:shadow-lg'
					>
						<FaGoogle size='20' /> <span>Continue With Google</span>
					</button>
				</div>
			</section>
		</>
	);
};

export default React.memo(Signin);
