import {useAuth} from 'contexts/auth';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import type { AppProps } from 'next/app';
import {useRouter} from 'next/router';
import React, {useLayoutEffect} from 'react';
import {auth} from 'utils/firebase';
import Spinner from 'components/spinner';

export interface RouteProps {
	Component: NextPage;
	redirectTo?: string;
};

export const privateRoute = ({Component, redirectTo}: RouteProps) => {
	const PrivateRoute = (props: any) => {
		const {user, loading} = useAuth();
		const {push, query} = useRouter();
		const redirect = query.redirect as string;

		useLayoutEffect(() => {
			if (!user && !loading)
				push('/auth/signin', {query: {redirect: redirect ?? redirectTo}});
		}, [user, loading]);

		if (loading) return <Spinner />;

		return <Component {...props} />;
	}
	return React.memo(PrivateRoute);
};

// export const privateRoute = (gssp: GetServerSideProps) => {
// 	return async (ctx: GetServerSidePropsContext) => {
// 		let cookies = parseCookies(ctx)
// 		console.log(cookies.user)
// 		if (ctx.req.headers.cookie)
// 			return {
// 				redirect: {
// 					permanent: false,
// 					destination: '/auth/signin',
// 				},
// 			};
// 		// if (auth.currentUser.role !== 'admin')
// 		// 	return {
// 		// 		redirect: {
// 		// 			permanent: false,
// 		// 			destination: '/',
// 		// 		},
// 		// 	};
// 		return gssp(ctx);
// 	};
// };

export default privateRoute;
