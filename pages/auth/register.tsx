import Input from 'components/input';
import {NextPage} from 'next';
import React, {useEffect, useRef, useState} from 'react';
import {FaGoogle} from 'react-icons/fa';
import styles from './auth.module.css';
import {useAuth} from 'contexts/auth';
import {useRouter} from 'next/router';
import Spinner from 'components/spinner';

const Register: NextPage = () => {
	const {user, loading, googleSignin, register, error} = useAuth();
	const {push, query} = useRouter();

	const emailRef = useRef<HTMLInputElement | null>(null);
	const passwordRef = useRef<HTMLInputElement | null>(null);
	const password2Ref = useRef<HTMLInputElement | null>(null);
	const [inputError, setInputError] = useState(error ?? '');

	useEffect(() => {
		if (!user) return;
		push(
			user.role === 'admin'
				? (query.redirect as string) ?? '/admin/dashboard'
				: (query.redirect as string) ?? '/'
		);
	}, [push, query, user]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!emailRef.current?.value.trim()) return;
		if (!passwordRef.current?.value.trim()) return;
		if (passwordRef.current?.value !== password2Ref.current?.value)
			return setInputError('Password do not matches!');
		await register(emailRef.current.value, passwordRef.current.value);
	};

	return (
		<>
			<div className={styles.section}>
				<div className={styles.div}>
					<h1 className={styles.h1}>Register</h1>
					{loading && <Spinner className={styles.loader} />}
					<form onSubmit={handleSubmit} className={styles.form}>
						<Input
							placeholder='Email'
							type='email'
							name='email'
							minLength={6}
							maxLength={64}
							ref={emailRef}
							className={styles.input}
							autoComplete='off'
						/>
						<Input
							placeholder='Password'
							type='password'
							name='password'
							minLength={6}
							maxLength={16}
							ref={passwordRef}
							className={styles.input}
							autoComplete='off'
						/>
						<Input
							placeholder='Confirm Password'
							type='password'
							name='password2'
							minLength={6}
							maxLength={16}
							ref={password2Ref}
							className={styles.input}
							autoComplete='off'
						/>
						{inputError ? <p className={styles.error}>{inputError}</p> : null}
						{error ? <p className={styles.error}>{error}</p> : null}
						<button
							type='submit'
							className={`${styles.button} ${styles.submit}`}
						>
							Submit
						</button>
					</form>
					<hr className={styles.line} />
					<button
						onClick={googleSignin}
						className={`${styles.button} ${styles.google}`}
					>
						<FaGoogle size='20' /> <span>Register With Google</span>
					</button>
				</div>
			</div>
		</>
	);
};

export default React.memo(Register);
