import type {NextApiRequest, NextApiResponse} from 'next';
import {db} from 'utils/firebase';
import {collection, getDocs} from 'firebase/firestore';
import withAuth, {IRequest} from 'middlewares/withAuth';

const handler = async (req: IRequest, res: NextApiResponse) => {
	try {
		const {uid, email} = req.user;
		let usersRef = collection(db, 'users');
		let snapshot = await getDocs(usersRef);
		let users = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

		return res.status(200).json({users});
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
};

export default withAuth(handler);
