import type {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';
import {auth} from 'utils/admin.firebase';
import {serialize} from 'cookie';

interface IClaim {
	token: string;
	type: 'register' | 'signin';
}

const createSession = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const body = req.body as IClaim;
		if (!body.token)
			return res.status(400).json({error: 'Id token is required!'});

		let RECENT_DURATION = 5 * 60;

		let claim = await auth.verifyIdToken(body.token, true);
		if (new Date().getTime() / 1000 - claim.auth_time > RECENT_DURATION)
			return res.status(400).json({error: 'Recent signin is required!'});

		let EXPIRES_IN = 5 * 60 * 60 * 1000;

		let customClaim;

		if (body.type === 'register') {
			customClaim = {
				role: claim.email === 'admin@nextkart.com' ? 'admin' : 'customer',
			};
			await auth.setCustomUserClaims(claim.uid, customClaim);
		}

		let options = {
			maxAge: EXPIRES_IN,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			path: '/',
		};
		let [cookie, authUser] = await Promise.all([
			auth.createSessionCookie(body.token, {
				expiresIn: EXPIRES_IN,
			}),
			await auth.getUser(claim.uid),
		]);

		res.setHeader('set-cookie', serialize('user', cookie, options));
		return res.status(200).json({
			name: authUser.displayName,
			email: authUser.email,
			phone: authUser.phoneNumber,
			avatar: authUser.photoURL,
			uid: authUser.uid,
			...authUser.customClaims,
		});
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
};

const clearSession = async (req: NextApiRequest, res: NextApiResponse) => {
	res.setHeader('set-cookie', serialize('user', '', {maxAge: -1, path: '/'}));
	return res.status(204).end();
};

const handler: NextApiHandler = async (req, res) => {
	switch (req.method) {
		case 'GET':
			return await clearSession(req, res);
		case 'POST':
			return await createSession(req, res);
		default: {
			return res.status(405).end();
		}
	}
};

export default handler;
