import withAuth, {IRequest} from 'middlewares/withAuth';
import type {NextApiResponse} from 'next';
import {db} from 'utils/admin.firebase';
import {DocumentReference} from 'firebase-admin/firestore';
import {ICartItem} from '.';

const getItem = async (req: IRequest, res: NextApiResponse) => {
	try {
		const user = req.user;
		const id = req.query.id as string;
		let item = await db.collection(`users/${user.id}/cart`).doc(id).get();
		if (!item.exists)
			return res.status(400).json({error: "Item Didn't Exists!"});
		return res.status(200).json({id: item.id, ...item.data()});
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
};

const updateItem = async (req: IRequest, res: NextApiResponse) => {
	try {
		const id = req.query.id as string;
		const body = req.body as Partial<ICartItem>;
		const user = req.user;
		if (
			body.quantity == null ||
			(body.quantity != null && typeof body.quantity !== 'number')
		)
			return res
				.status(400)
				.json({error: 'Quantity is required and should be a positive number!'});

		let itemRef = db.collection(`users/${user.id}/cart`).doc(id);
		let item = await itemRef.get();
		if (!item.exists)
			return res.status(400).json({error: 'Item no longer exists!'});

		let product = await (item.get('product') as DocumentReference).get();

		let updatedData = {
			quantity: body.quantity,
			price: product.get('price') * body.quantity,
		};
		await itemRef.update(updatedData);
		return res.status(200).json(updatedData);
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
};

const deleteItem = async (req: IRequest, res: NextApiResponse) => {
	try {
		const user = req.user;
		const id = req.query.id as string;
		let itemRef = db.collection(`users/${user.id}/cart`).doc(id);
		await itemRef.delete();
		return res.status(204);
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
};

const handler = async (req: IRequest, res: NextApiResponse) => {
	switch (req.method) {
		case 'GET':
			return getItem(req, res);
		case 'PUT':
			return updateItem(req, res);
		case 'DELETE':
			return deleteItem(req, res);
		default:
			return res.status(405).end();
	}
};

export default withAuth(handler);
