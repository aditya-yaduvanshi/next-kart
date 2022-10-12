import {useAuth} from 'contexts/auth';
import {useRouter} from 'next/router';
import React, {useEffect} from 'react';
import {RouteProps} from 'hoc/PrivateRoute';

export const protectedRoute = ({Component, redirectTo}: RouteProps) => {
	const ProtectedRoute = (props: any) => {
		const {user, loading} = useAuth();
		const {push, pathname} = useRouter();

		useEffect(() => {
			if (!user && !loading)
				push(`/auth/signin?redirect=${redirectTo ?? pathname}`);
			if (user && user.role !== 'admin') push('/products');
		}, [user, loading]);

		if (loading) return <>loading...</>;

		return <Component {...props} />;
	};
	return React.memo(ProtectedRoute);
};

export default protectedRoute;
