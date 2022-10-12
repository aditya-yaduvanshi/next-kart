import {useAuth} from 'contexts/auth';
import {NextPage} from 'next';
import {useRouter} from 'next/router';
import React, {useEffect} from 'react';
import Spinner from 'components/spinner';

export interface RouteProps {
	Component: NextPage<any>;
	redirectTo?: string;
}

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
	};
	return React.memo(PrivateRoute);
};

export default privateRoute;
