import withAuth, {IRequest} from 'middlewares/withAuth';
import type {NextApiResponse} from 'next';
import {db} from 'utils/admin.firebase';
import {DocumentReference} from 'firebase-admin/firestore';
import {ICartItem} from '.';

const getItem = async (req: IRequest, res: NextApiResponse) => {
	try {
		const user = req.user;
		const id = req.query.id as string;
		let item = await db.collection('carts').doc(id).get();
		if (!item.exists)
			return res.status(400).json({error: "Item Didn't Exists!"});
		
		if(item.get('user') !== user.uid)
			return res.status(403).json({error: "This item does not belongs to you!"});
		
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

		let itemRef = db.collection('carts').doc(id);
		let item = await itemRef.get();
		if (!item.exists)
			return res.status(400).json({error: 'Item no longer exists!'});

		if(item.get('user') !== user.uid)
			return res.status(403).json({error: 'This item does not belongs to you!'});
		
		if (
			body.quantity == null ||
			(body.quantity != null && typeof body.quantity !== 'number')
		)
			return res
				.status(400)
				.json({error: 'Quantity is required and should be a positive number!'});

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
		let itemRef = db.collection('carts').doc(id);
		let item = await itemRef.get();

		if(!item.exists) 
			return res.status(400).json({error: 'Item did not exists!'});

		if(item.get('user') !== user.uid)
			return res.status(403).json({error: 'This item does not belongs to you!'});

		await itemRef.delete();
		return res.status(204).end();
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
};

const handler = async (req: IRequest, res: NextApiResponse) => {
	switch (req.method) {
		case 'GET':
			return await getItem(req, res);
		case 'PUT':
			return await updateItem(req, res);
		case 'DELETE':
			return await deleteItem(req, res);
		default:
			return res.status(405).end();
	}
};

export default withAuth(handler);
