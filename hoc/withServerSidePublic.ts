import {GetServerSideProps, GetServerSidePropsContext} from 'next';

const withServerSidePublic = (gssp: GetServerSideProps, redirect?: string) => {
	return async (ctx: GetServerSidePropsContext) => {
		const cookie = ctx.req.cookies['user'];

		if (cookie)
			return {
				redirect: {
					destination: redirect ?? '/',
					permanent: false,
				},
			};

		return gssp(ctx);
	};
};

export default withServerSidePublic;
