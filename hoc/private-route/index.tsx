import {useAuth} from 'contexts/auth';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import type { AppProps } from 'next/app';
import {useRouter} from 'next/router';
import React, {useLayoutEffect} from 'react';
import {auth} from 'utils/firebase';
import {parseCookies} from 'nookies';

export interface RouteProps extends AppProps {
	Component: NextPage;
	redirectTo?: string;
};

const PrivateRoute = ({Component, redirectTo, ...props}: RouteProps) => {
	const {user, loading} = useAuth();
	const {push, query} = useRouter();
	const redirect = query.redirect as string;

	useLayoutEffect(() => {
		if (!user && !loading)
			push('/auth', {query: {redirect: redirect ?? redirectTo}});
	}, [user, loading]);

	if (loading) return <>loading...</>;

	return Component;
};

export const privateRoute = (gssp: GetServerSideProps) => {
	return async (ctx: GetServerSidePropsContext) => {
		let cookies = parseCookies(ctx)
		console.log(cookies.user)
		if (ctx.req.headers.cookie)
			return {
				redirect: {
					permanent: false,
					destination: '/auth/signin',
				},
			};
		// if (auth.currentUser.role !== 'admin')
		// 	return {
		// 		redirect: {
		// 			permanent: false,
		// 			destination: '/',
		// 		},
		// 	};
		return gssp(ctx);
	};
};

export default PrivateRoute;
