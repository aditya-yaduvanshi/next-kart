import withAdmin from 'middlewares/withAdmin';
import withAuth, {IRequest} from 'middlewares/withAuth';
import type {NextApiRequest, NextApiResponse} from 'next';
import {db} from 'utils/admin.firebase';
import validation from 'utils/validation';

export interface ICategory {
	name: string;
	image: string;
}

const getCategories = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const categories = await db.collection('categories').get();
		return res
			.status(200)
			.json(categories.docs.map((cat) => ({id: cat.id, ...cat.data()})));
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
};

const createCategory = async (req: IRequest, res: NextApiResponse) => {
	try {
		const body = req.body as ICategory;
		if (!body.name || !body.image)
			return res.status(400).json({error: 'All Fields Are Required!'});

		let category = await db
			.collection('categories')
			.where('name', '==', body.name.toLowerCase())
			.get();
		if (category.docs.length > 0)
			return res.status(400).json({error: 'Category name already exists!'});

		if (!validation.isImageUrl(body.image))
			return res.status(400).json({error: 'Image should be valid image url!'});

		let docRef = db.collection('categories').doc();

		let categoryData = {
			name: body.name.toLowerCase(),
			image: body.image,
		};
		await docRef.create(categoryData);

		res.setHeader('Location', docRef.id);
		return res.status(201).json({id: docRef.id, ...categoryData});
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case 'GET':
			return await getCategories(req, res);
		case 'POST':
			return await withAuth(withAdmin(createCategory))(req, res);
		default:
			return res.status(405).end();
	}
};

export default handler;
