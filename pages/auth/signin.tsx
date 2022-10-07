import Input from 'components/input';
import {NextPage} from 'next';
import React, {useEffect, useRef} from 'react';
import {FaGoogle} from 'react-icons/fa';
import styles from './auth.module.css';
import {
	useSignInWithEmailAndPassword,
	useSignInWithGoogle,
} from 'react-firebase-hooks/auth';
import {auth} from 'utils/firebase';
import { useAuth } from 'contexts/auth';
import { useRouter } from 'next/router';
import Img from 'components/img';
import Spinner from 'components/spinner';

const Signin: NextPage = () => {
	const emailRef = useRef<HTMLInputElement | null>(null);
	const passwordRef = useRef<HTMLInputElement | null>(null);

	const [signin] = useSignInWithEmailAndPassword(auth);
	const [google] = useSignInWithGoogle(auth);
  const {user, loading} = useAuth();
  const {push, query} = useRouter();

  useEffect(() => {
    if(!user) return;
    push(user.role === 'admin' ? (query.redirect as string ?? '/admin/dashboard') : (query.redirect as string ?? '/'))
  }, [push, query, user]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!emailRef.current?.value.trim()) return;
		if (!passwordRef.current?.value.trim()) return;
		await signin(emailRef.current.value, passwordRef.current.value);
	};

	return (
		<>
			<section className={styles.section}>
				<div className={styles.div}>
          {loading && <Spinner className={styles.loader} />}
					<h1 className={styles.h1}>Sign in</h1>
					<form onSubmit={handleSubmit} className='flex flex-col gap-3 my-5'>
						<Input
							placeholder='Email'
							type='email'
							name='email'
							minLength={6}
							maxLength={64}
							ref={emailRef}
							className={styles.input}
              autoComplete="off"
						/>
						<Input
							placeholder='Password'
							type='password'
							name='password'
							minLength={6}
							maxLength={16}
							ref={passwordRef}
							className={styles.input}
              autoComplete="off"
						/>
						<button type='submit' className={`${styles.button} ${styles.submit}`}>Submit</button>
					</form>
          <hr className={styles.line} />
					<button
						onClick={() => google(['email', 'profile'])}
						className={`${styles.button} ${styles.google}`}
					>
						<FaGoogle size='20' /> <span>Signin With Google</span>
					</button>
				</div>
			</section>
		</>
	);
};

export default React.memo(Signin);