import { USERS_URL } from 'constants/urls';
import {DecodedIdToken} from 'firebase-admin/lib/auth/token-verifier';
import {GetServerSideProps, GetServerSidePropsContext} from 'next';
import {auth} from 'utils/admin.firebase';

export interface WithServerSideAuthContext extends GetServerSidePropsContext {
	req: GetServerSidePropsContext['req'] & {
		user: DecodedIdToken;
	};
}

const withServerSideAuth = (gssp: GetServerSideProps, redirect?: string) => {
	return async (ctx: GetServerSidePropsContext) => {
		const cookie = ctx.req.cookies['user'];
		if (!cookie)
			return {
				redirect: {
					destination: `/auth/signin${redirect ? '?redirect=' + redirect : ''}`,
					permanent: false,
				},
			};

		try {
			const user = await auth.verifySessionCookie(cookie);
			if (!user)
				throw new Error('Session Expired! Please signin again!');

			(ctx.req as WithServerSideAuthContext['req']).user = user;
			return gssp(ctx);
		} catch (err) {
      await fetch(USERS_URL);
			return {
				redirect: {
					destination: `/auth/signin${redirect ? '?redirect=' + redirect : ''}`,
					permanent: false,
				},
			};
		}
	};
};

export default withServerSideAuth;
