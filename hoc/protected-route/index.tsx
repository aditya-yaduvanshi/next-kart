import {useAuth} from 'contexts/auth';
import {useRouter} from 'next/router';
import React, {useLayoutEffect} from 'react';
import PrivateRoute, {RouteProps} from 'hoc/private-route';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { auth } from 'utils/firebase';
import { AppProps } from 'next/app';

export const protectedRoute = ({Component, redirectTo}: RouteProps) => {
	const ProtectedRoute = (props: any) => {
		const {user, loading} = useAuth();
		const {push, query} = useRouter();
	
		useLayoutEffect(() => {
			if (!user && !loading) push('/auth/signin');
			if (user && user.role !== 'admin') push('/products');
		}, [user, loading]);
	
		if (loading) return <>loading...</>;
	
		return <Component {...props} />;
	}
	return React.memo(ProtectedRoute);
};

// export const protectedRoute = (gssp: GetServerSideProps) => {
// 	return async (ctx: GetServerSidePropsContext) => {
// 		if(!auth.currentUser) 
// 			return {
// 				redirect: {
// 					permanent: false,
// 					destination: '/auth/signin',
// 				}
// 			}
// 		return gssp(ctx);
// 	}
// }

// export default ProtectedRoute;
