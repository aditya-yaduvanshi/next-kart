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

		if (query.limit != null && typeof Number(query.limit) !== 'number')
			return res
				.status(400)
				.json({error: 'Limit Should Be A Positive Number!'});
		if (query.page != null && typeof Number(query.page) !== 'number')
			return res.status(400).json({error: 'Page Should Be A Positive Number!'});

		let page = Number(query.page) ? Number(query.page) : 1;
		let limit = Number(query.limit) ? Number(query.limit) : 10;
		let offset = page * limit > 10 ? page * limit : 0;

		let items = await db
			.collection('carts')
			.where('user', '==', user.uid)
			.offset(offset)
			.limit(limit)
			.get();

		const cartItems = await Promise.all(
			items.docs.map(async (cartItem) => {
				let productRef = cartItem.get(
					'product'
				) as FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
				let product = await productRef.get();
				let item = {
					id: cartItem.id,
					...cartItem.data(),
					product: {
						id: product.id,
						thumbnail: product.get('thumbnail'),
						title: product.get('title'),
						slug: product.get('slug'),
						price: product.get('price'),
					},
				};
				return item;
			})
		);
		return res.status(200).json(cartItems);
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

		let items = await db.collection('carts').where('user', '==', user.uid).get();
		
		if(items.docs.find(item => item.get('product').id === product.id))
			return res.status(400).json({error: 'Item already exists!'});

		let itemRef = db.collection('carts').doc();

		let item = {
			product: product.ref,
			user: user.uid,
			quantity: body.quantity ?? 1,
		};

		let price = item.quantity * product.get('price');

		await itemRef.create({
			...item,
			price,
		});

		res.setHeader('Location', itemRef.id);
		let data = {
			id: itemRef.id,
			...item,
			product: {
				id: product.id,
				slug: product.get('slug'),
				thumbnail: product.get('thumbnail'),
				price: product.get('price'),
				title: product.get('title'),
			},
			price,
		};
		return res.status(201).json(data);
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
};

const removeItems = async (req: IRequest, res: NextApiResponse) => {
	try {
		const user = req.user;
		const items = await db
			.collection('carts')
			.where('user', '==', user.uid)
			.get();
		const batch = db.batch();

		items.docs.forEach((item) => {
			batch.delete(item.ref);
		});

		await batch.commit();
		return res.status(204).end();
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
};

const handler = async (req: IRequest, res: NextApiResponse) => {
	switch (req.method) {
		case 'GET':
			return await getItems(req, res);
		case 'POST':
			return await addItem(req, res);
		case 'DELETE':
			return await removeItems(req, res);
		default:
			return res.status(405).end();
	}
};

export default withAuth(handler);
