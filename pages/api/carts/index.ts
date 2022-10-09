import withAuth, {IRequest} from 'middlewares/withAuth';
import type {NextApiResponse} from 'next';
import {db} from 'utils/admin.firebase';

export interface IQuery {
	limit?: number;
	page?: number;
}

export interface ICartItem {
	id: string;
	product: string;
	quantity: number;
	price: number;
}

const getItems = async (req: IRequest, res: NextApiResponse) => {
	try {
		const query = req.query as IQuery;
		const user = req.user;

		if (query.limit != null && typeof query.limit !== 'number')
			return res
				.status(400)
				.json({error: 'Limit Should Be A Positive Number!'});
		if (query.page != null && typeof query.page !== 'number')
			return res.status(400).json({error: 'Page Should Be A Positive Number!'});

		let page = query.page ?? 1;
		let limit = query.limit ?? 10;
		let offset = page * limit > 10 ? page * limit : 0;

		let items = await db
			.collection(`users/${user.id}/cart`)
			.offset(offset)
			.limit(limit)
			.get();
		return res
			.status(200)
			.json(items.docs.map((doc) => ({id: doc.id, ...doc.data()})));
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
};

const addItem = async (req: IRequest, res: NextApiResponse) => {
	try {
		const user = req.user;
		const body = req.body as ICartItem;

		if (!body.product)
			return res.status(400).json({error: 'Product Is Required!'});

		let product = await db.collection('products').doc(body.product).get();

		if (!product.exists)
			return res.status(400).json({error: 'Product No Longer Exists!'});

		if (body.quantity != null && typeof body.quantity !== 'number')
			return res
				.status(400)
				.json({error: 'Quantity Should Be A Positive Number!'});

		let item = {
			product: product.ref,
			user: db.collection('users').doc(user.id),
			quantity: body.quantity ?? 1,
		};

		let itemRef = db.collection(`users/${user.id}/cart`).doc();

		await itemRef.create({
			...item,
			price: item.quantity * product.get('price'),
		});

		res.setHeader('Location', itemRef.id);
		return res.status(201).end();
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
};

const handler = async (req: IRequest, res: NextApiResponse) => {
	switch (req.method) {
		case 'GET':
			return getItems(req, res);
		case 'POST':
			return addItem(req, res);
		default:
			return res.status(405).end();
	}
};

export default withAuth(handler);
