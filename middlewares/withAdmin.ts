import {NextApiResponse} from 'next';
import {IRequest} from './withAuth';

const withAdmin = (handler: Function) => {
	return async (req: IRequest, res: NextApiResponse) => {
    const user = req.user;
		if (user.role !== 'admin')
			return res.status(403).json({error: 'Insufficient Permission!'});

		return await handler(req, res);
	};
};

export default withAdmin;
