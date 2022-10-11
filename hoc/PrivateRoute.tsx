import {useAuth} from 'contexts/auth';
import {GetServerSideProps, GetServerSidePropsContext, NextPage} from 'next';
import {useRouter} from 'next/router';
import React, {useEffect} from 'react';
import Spinner from 'components/spinner';
import {auth} from 'utils/firebase';

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

export const serverSidePrivateRoute = (gssp: GetServerSideProps) => {
	return async (ctx: GetServerSidePropsContext) => {
		let cookie = ctx.req.cookies['user'];
		if(cookie){
			// let token = await auth.verifySessionCookie(cookie as string)
			// console.log('token',token)
			const result = await auth.currentUser?.getIdTokenResult()
			console.log('claims', result)
			console.log(cookie === ctx.req.headers.cookie?.split('user=')[1])
		}
			

		if (!ctx.req.headers.cookie)
			return {
				redirect: {
					permanent: false,
					destination: '/auth/signin',
				},
			};
		return gssp(ctx);
	};
};

export default privateRoute;
