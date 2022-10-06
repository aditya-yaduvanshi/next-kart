import {useAuth} from 'contexts/auth';
import {useRouter} from 'next/router';
import React, {useLayoutEffect} from 'react';
import PrivateRoute, {RouteProps} from 'hoc/private-route';

const ProtectedRoute = ({Component, redirectTo}: RouteProps) => {
	const {user, loading} = useAuth();
	const {push} = useRouter();

	useLayoutEffect(() => {
		if (!user && !loading) push('/auth');
		if (user && user.role !== 'admin') push('/');
	}, [user, loading]);

	if (loading) return <>loading...</>;

	return PrivateRoute({Component, redirectTo});
};

export default ProtectedRoute;
