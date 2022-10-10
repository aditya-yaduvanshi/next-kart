import {useAuth} from 'contexts/auth';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import {useRouter} from 'next/router';
import React, {useEffect} from 'react';
import Spinner from 'components/spinner';

export interface RouteProps {
	Component: NextPage<any>;
	redirectTo?: string;
};

export const privateRoute = ({Component, redirectTo}: RouteProps) => {
	const PrivateRoute = (props: any) => {
		const {user, loading} = useAuth();
		const {push, query, pathname} = useRouter();
		const redirect = query.redirect as string;

		useEffect(() => {
			if (!user && !loading)
				push(`/auth/signin?redirect=${redirect ?? redirectTo ?? pathname}`);
		}, [user, loading]);

		if (loading) return <Spinner />;

		return <Component {...props} />;
	}
	return React.memo(PrivateRoute);
};

// export const serverSidePrivateRoute = (gssp: GetServerSideProps) => {
// 	return async (ctx: GetServerSidePropsContext) => {
// 		const auth = (await import('utils/admin.firebase')).auth;
// 		let cookies = ctx.req.cookies;

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
