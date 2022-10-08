import {auth, db} from 'utils/admin.firebase';
import {NextApiRequest, NextApiResponse} from 'next';

export interface IRequest extends NextApiRequest {
	user: {
		uid: string;
		email: string;
		role: string;
		id: string;
	};
}

const withAuth = (handler: Function) => {
	return async (req: NextApiRequest, res: NextApiResponse) => {
		try {
			const token = req.headers.authorization;
			let user = JSON.parse(req.cookies['user'] ?? '{}');
			if (!token) return res.status(401).json({error: 'Token Not Provided!'});

			const {uid, email, role} = await auth.verifyIdToken(token);

			if (!uid || !email) return res.status(401).json({error: 'Invalid User!'});

			return handler({...req, user: {uid, email, role, id: user.id}} as IRequest, res);
		} catch (err) {
			return res.status(400).json({error: (err as Error).message});
		}
	};
};

export default withAuth;
