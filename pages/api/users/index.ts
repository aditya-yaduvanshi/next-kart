import {IUser} from 'contexts/auth';
import type {NextApiRequest, NextApiResponse} from 'next';
import {db, auth} from 'utils/admin.firebase';

const postUser = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const body = req.body as IUser;

		let snaps = await db.collection('users').where('email', '==', body.email).get();

		if (snaps.docs.length)
			return res.status(400).json({error: 'User already exists!'});
		
		let user = {
			...body,
			role: body.email === 'admin@nextkart.com' ? 'admin' : 'customer',
		};
		await auth.setCustomUserClaims(user.uid, {
			role: user.email === 'admin@nextkart.com' ? 'admin' : 'customer',
		})
		let userRef = db.collection('users').doc();
		await userRef.create(user);
		user.id = userRef.id;

		res.setHeader(
			'set-cookie',
			`user=${JSON.stringify(user)}; path=/; samesite=lax; httponly;`
		);

		res.setHeader('Location', userRef.id);

		return res.status(201).end();
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case 'POST':
			return await postUser(req, res);
		default: {
			return res.status(405).end();
		}
	}
};

export default handler;
