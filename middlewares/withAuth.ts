import {auth} from 'utils/admin.firebase';
import {NextApiRequest, NextApiResponse} from 'next';
import {parseCookies} from 'nookies';

export interface IRequest extends NextApiRequest {
	user: {
		uid: string;
		email: string;
	};
}

const withAuth = async (handler: Function) => {
	return async (req: NextApiRequest, res: NextApiResponse) => {
		const cookies = parseCookies({req});
		const token = cookies.token;

		if (!token) return res.status(401).json({error: 'No Token Provided!'});

		const {uid, email} = await auth.verifyIdToken(cookies.token);

		if (!uid || !email) {
			return res.status(401).json({error: 'Invalid User!'});
		}

		return handler({...req, user: {uid, email}} as IRequest, res);
	};
};

export default withAuth;
