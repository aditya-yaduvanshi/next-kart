import { IUser } from 'contexts/auth';
import type {NextApiRequest, NextApiResponse} from 'next';
import {db} from 'utils/firebase';
import {collection, where, query, getDocs, addDoc} from 'firebase/firestore'

const postUser = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const body = req.body as IUser;
		if(body.provider === 'google.com') {} // skip validating data
		let snaps = await getDocs(query(collection(db, 'users'), where('uid', '==', body.uid)));

		if(snaps.docs.length) return res.status(400).json({error: 'User already exists!'});
		await addDoc(collection(db, 'users'), {...body, role: body.email === 'admin@nextkart.com' ? 'admin' : 'customer'});

		return res.status(201).end();
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case 'POST': return await postUser(req, res);
		default: {
			return res.status(405).end();
		}
	}
};

export default handler;
