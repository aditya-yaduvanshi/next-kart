import {useAuth} from 'contexts/auth';
import {useRouter} from 'next/router';
import React, {useLayoutEffect} from 'react';
import PrivateRoute, {RouteProps} from 'hoc/private-route';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { auth } from 'utils/firebase';

const ProtectedRoute = ({Component, redirectTo, ...props}: RouteProps) => {
	const {user, loading} = useAuth();
	const {push} = useRouter();

	useLayoutEffect(() => {
		if (!user && !loading) push('/auth');
		if (user && user.role !== 'admin') push('/');
	}, [user, loading]);

	if (loading) return <>loading...</>;

	return PrivateRoute({Component, redirectTo, ...props});
};

export const protectedRoute = (gssp: GetServerSideProps) => {
	return async (ctx: GetServerSidePropsContext) => {
		if(!auth.currentUser) 
			return {
				redirect: {
					permanent: false,
					destination: '/auth/signin',
				}
			}
		return gssp(ctx);
	}
}

export default ProtectedRoute;
