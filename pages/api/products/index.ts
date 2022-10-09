import {IProductDetail} from 'contexts/products';
import {DocumentReference, DocumentSnapshot} from 'firebase-admin/firestore';
import withAdmin from 'middlewares/withAdmin';
import withAuth, {IRequest} from 'middlewares/withAuth';
import type {NextApiRequest, NextApiResponse} from 'next';
import {db} from 'utils/admin.firebase';
import validation from 'utils/validation';
import {IQuery} from '../carts';

interface IProductQuery extends IQuery {
	category?: string;
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const query = req.query as IProductQuery;
		if (query.limit != null && typeof query.limit !== 'number')
			return res
				.status(400)
				.json({error: 'Limit Should Be A Positive Number!'});

		if (query.page != null && typeof query.page !== 'number')
			return res.status(400).json({error: 'Page Should Be A Positive Number!'});

		let category;
		if (query.category && typeof query.category === 'string') {
			category = (
				await db
					.collection('categories')
					.where('name', '==', query.category.toLowerCase())
					.get()
			).docs[0];
		}

		let page = query.page ?? 1;
		let limit = query.limit ?? 10;
		let offset = page * limit > 10 ? page * limit : 0;

		let products;
		if (category)
			products = await db
				.collection('products')
				.where('category', '==', category.ref)
				.offset(offset)
				.limit(limit)
				.get();
		else
			products = await db
				.collection('products')
				.offset(offset)
				.limit(limit)
				.get();

		return res.status(200).json(
			products.docs.map((doc) => ({
				id: doc.id,
				slug: doc.get('slug'),
				title: doc.get('title'),
				thumbnail: doc.get('thumbnail'),
				price: doc.get('price'),
				rating: doc.get('rating'),
			}))
		);
	} catch (err) {
		res.status(400).json({error: (err as Error).message});
	}
};

const addProduct = async (req: IRequest, res: NextApiResponse) => {
	try {
		const body = req.body as IProductDetail;

		if (
			!body.title ||
			!body.price ||
			!body.thumbnail ||
			!body.stock ||
			!body.category
		)
			return res.status(400).json({error: 'Required fields are missing!'});

		if (typeof body.title !== 'string')
			return res.status(400).json({error: 'Title should be a valid text!'});

		if (!validation.isImageUrl(body.thumbnail))
			return res
				.status(400)
				.json({error: 'Thumbnail should be valid image url!'});

		if (typeof body.price !== 'number')
			return res
				.status(400)
				.json({error: 'Price should be a positive number!'});

		if (typeof body.stock !== 'number')
			return res
				.status(400)
				.json({error: 'Stock should be a positive number!'});

		if (body.description && typeof body.description !== 'string')
			return res
				.status(400)
				.json({error: 'Description should be a valid text!'});

		if (body.images && typeof body.images !== 'object')
			return res
				.status(400)
				.json({error: 'Images should be a list of valid image urls!'});

		if (body.images) {
			let invalid = false;
			for (let i of body.images) {
				if (!validation.isImageUrl(i)) {
					invalid = true;
					break;
				}
			}
			if (invalid)
				return res
					.status(400)
					.json({error: 'Images should be a list of valid image urls!'});
		}

		let category = await db.collection('categories').doc(body.category).get();
		if (!category.exists)
			return res.status(400).json({error: 'Category is not supported yet!'});

		let productRef = db.collection('products').doc();
		await productRef.create({
			title: body.title,
			price: body.price,
			stock: body.stock,
			thumbnail: body.thumbnail,
			description: body.description ?? '',
			slug: `${(body.title as string).toLowerCase().split(' ').join('-')}_${
				productRef.id
			}`,
			images: body.images ?? [],
			category: category.ref,
		});
		res.setHeader('Location', productRef.id);
		return res.status(201).end();
	} catch (err) {
		res.status(400).json({error: (err as Error).message});
	}
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case 'GET':
			return await getProducts(req, res);
		case 'POST':
			withAuth(withAdmin(addProduct));
		default:
			return res.status(405).end();
	}
};

export default handler;
