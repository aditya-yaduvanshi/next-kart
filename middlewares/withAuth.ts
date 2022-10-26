import {auth, db} from 'utils/admin.firebase';
import {NextApiRequest, NextApiResponse} from 'next';
import { serialize } from 'cookie';

export interface IRequest extends NextApiRequest {
	user: {
		uid: string;
		email: string;
		role: string;
	};
}

const withAuth = (handler: Function) => {
	return async (req: NextApiRequest, res: NextApiResponse) => {
		try {
			let token = req.cookies['user'];
			if (!token) return res.status(401).json({error: 'Token Not Provided!'});

			const {uid, email, role} = await auth.verifySessionCookie(token, true);

			if (!email) return res.status(401).json({error: 'Invalid User!'});
			return await handler({...req, user: {uid, email, role}} as IRequest, res);
		} catch (err) {
			if((err as Error).name === 'auth/user-disabled' || (err as Error).name === 'auth/id-token-revoked')
				res.setHeader('set-cookie', serialize('user', '', {maxAge: -1}));
			return res.status(400).json({error: (err as Error).message});
		}
	};
};

export default withAuth;
