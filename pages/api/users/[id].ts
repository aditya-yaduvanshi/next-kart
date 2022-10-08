import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import withAuth, {IRequest} from 'middlewares/withAuth';
import type {NextApiResponse} from 'next';
import {db} from 'utils/firebase';
import {auth} from 'utils/admin.firebase';

const getUser = async (req: IRequest, res: NextApiResponse) => {
	try {
		const {
			user,
			query: {id},
		} = req;

		let snaps = await getDocs(
			query(collection(db, 'users'), where('uid', '==', id))
		);
		if (!snaps.docs.length) return res.status(404).end();
		let userData = {id: snaps.docs[0].id, ...snaps.docs[0].data()};
		return res.status(200).json(userData);
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
};

const claimUser = async (req: IRequest, res: NextApiResponse) => {
	try {
		const {query: {id}, body} = req;
		let user = await auth.getUser(id as string);
		if(!user) return res.status(400).json({error: 'Invalid User Id!'});
		
		await auth.setCustomUserClaims(id as string, {
			role: body.email === 'admin@nextkart.com' ? 'admin' : 'customer',
		})
		return res.status(200).json({});
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
}

const updateUser = async (req: IRequest, res: NextApiResponse) => {
	try {
		const {
			body,
			query: {id},
			user,
		} = req;

		let snaps = await getDocs(
			query(collection(db, 'users'), where('uid', '==', id))
		);
		if (!snaps.docs.length) return res.status(404).end();

		await updateDoc(snaps.docs[0].ref, body);
		return res.status(200).end();
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
};

const removeUser = async (req: IRequest, res: NextApiResponse) => {
	try {
		const {
			query: {id},
			user,
		} = req;

		let snaps = await getDocs(
			query(collection(db, 'users'), where('uid', '==', id))
		);
		if (!snaps.docs.length) return res.status(404).end();

		await deleteDoc(snaps.docs[0].ref);
		return res.status(204).end();
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
};

const handler = async (req: IRequest, res: NextApiResponse) => {
	const {
		user,
		query: {id},
	} = req;
	if (!(id as string))
		return res.status(400).json({error: 'Id was not provided!'});
	if ((id as string) !== user.uid) return res.status(403).end();

	switch (req.method) {
		case 'GET':
			return await getUser(req, res);
		case 'POST':
			return await claimUser(req, res);
		case 'PUT':
			return await updateUser(req, res);
		case 'DELETE':
			return await removeUser(req, res);
		default:
			return res.status(405).end();
	}
};

export default withAuth(handler);
