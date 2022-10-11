import {IUser} from 'contexts/auth';
import type {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';
import {db, auth} from 'utils/admin.firebase';
import {serialize} from 'cookie';

interface IClaim {
	token: string;
	type: 'register' | 'signin';
}

// const postUser = async (req: NextApiRequest, res: NextApiResponse) => {
// 	try {
// 		const body = req.body as IUser;

// 		let snaps = await db
// 			.collection('users')
// 			.where('email', '==', body.email)
// 			.get();

// 		if (snaps.docs.length)
// 			return res.status(400).json({error: 'User already exists!'});

// 		let user = {
// 			...body,
// 			role: body.email === 'admin@nextkart.com' ? 'admin' : 'customer',
// 		};
// 		await auth.setCustomUserClaims(user.uid, {
// 			role: user.email === 'admin@nextkart.com' ? 'admin' : 'customer',
// 		});
// 		let userRef = db.collection('users').doc();
// 		await userRef.create(user);
// 		user.id = userRef.id;

// 		res.setHeader(
// 			'set-cookie',
// 			`user=${JSON.stringify(user)}; path=/; samesite=lax; httponly;`
// 		);

// 		res.setHeader('Location', userRef.id);

// 		return res.status(201).end();
// 	} catch (err) {
// 		return res.status(400).json({error: (err as Error).message});
// 	}
// };

const claimUser = async (req: NextApiRequest, res: NextApiResponse) => {
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

		if(body.type === 'register'){
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
		let [cookie, authUser] = await Promise.all([auth.createSessionCookie(body.token, {
			expiresIn: EXPIRES_IN,
		}), await auth.getUser(claim.uid)]);

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

const handler: NextApiHandler = async (req, res) => {
	switch (req.method) {
		case 'POST':
			return await claimUser(req, res);
		default: {
			return res.status(405).end();
		}
	}
};

export default handler;
