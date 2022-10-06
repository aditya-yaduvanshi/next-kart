import {useAuth} from 'contexts/auth';
import {NextPage} from 'next';
import {useRouter} from 'next/router';
import React, {useLayoutEffect} from 'react';

export type RouteProps = {
	Component: NextPage;
	redirectTo?: string;
};

const PrivateRoute = ({Component, redirectTo}: RouteProps) => {
	const {user, loading} = useAuth();
	const {push, query} = useRouter();
	const redirect = query.redirect as string;

	useLayoutEffect(() => {
		if (!user && !loading)
			push('/auth/signin', {query: {redirect: redirect ?? redirectTo}});
	}, [user, loading]);

	if (loading) return <>loading...</>;

	return Component;
};

export default PrivateRoute;
