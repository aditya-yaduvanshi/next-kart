import {GetServerSideProps, GetServerSidePropsContext} from 'next';
import {WithServerSideAuthContext} from './withServerSideAuth';

const withServerSideAdmin = (gssp: GetServerSideProps, redirect?: string) => {
	return async (ctx: WithServerSideAuthContext) => {
		const user = ctx.req.user;
		if (user.role !== 'admin')
			return {
				redirect: {
					destination: redirect ?? '/products',
					permanent: false,
				},
			};
    
    return gssp(ctx as GetServerSidePropsContext);
	};
};

export default withServerSideAdmin;
