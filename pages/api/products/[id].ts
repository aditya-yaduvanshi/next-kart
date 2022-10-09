import { IProductDetail } from 'contexts/products';
import {DocumentReference} from 'firebase-admin/firestore';
import withAdmin from 'middlewares/withAdmin';
import withAuth, {IRequest} from 'middlewares/withAuth';
import type {NextApiResponse} from 'next';
import {db} from 'utils/admin.firebase';
import validation from 'utils/validation';

const getProductDetails = async (req: IRequest, res: NextApiResponse) => {
	try {
		const id = req.query.id as string;
		if (!id) return res.status(400).json({error: 'Invalid product id!'});

		let product = await db.collection('products').doc(id).get();
    if(!product.exists) return res.status(404).json({error: 'Product no longer exists!'});

		let category = await (product.get('category') as DocumentReference).get();

		return res
			.status(200)
			.json({
				id: product.id,
				...product.data(),
				category: {id: category.id, ...category.data()},
			});
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
};

const updateProduct = async (req: IRequest, res: NextApiResponse) => {
	try {
    const id = req.query.id as string;
		if (!id) return res.status(400).json({error: 'Invalid product id!'});
    const body = req.body as Partial<IProductDetail>;

		if (
			!body.title &&
			!body.price &&
			!body.thumbnail &&
			!body.stock &&
			!body.category &&
      !body.images
		)
			return res.status(400).json({error: 'Body cannot be empty!'});

    let updatedData = {};
    if(body.price && typeof body.price === 'number')
      updatedData = {
        ...updatedData,
        price: body.price,
      }
    if(body.description && typeof body.description === 'string')
      updatedData = {
        ...updatedData,
        description: body.description,
      }
    if(body.stock && typeof body.stock === 'number')
      updatedData = {
        ...updatedData,
        stock: body.stock,
      }
    if(body.thumbnail && typeof body.thumbnail === 'string' && validation.isImageUrl(body.thumbnail))
      updatedData = {
        ...updatedData,
        thumbnail: body.thumbnail,
      }
    if (body.images && typeof body.images === 'object') {
      let invalid = false;
      for (let i of body.images) {
        if (!validation.isImageUrl(i)) {
          invalid = true;
          break;
        }
      }
      if (!invalid)
        updatedData = {
          ...updatedData,
          images: body.images,
        } 
      else return res.status(400).json({error: 'Images should be a list of vaild image urls!'});
    }
    if(body.category && typeof body.category === 'string'){
      let category = await db.collection('categories').doc(body.category).get();
      if(category.exists)
        updatedData = {
          ...updatedData,
          category: category.ref,
        }
      else return res.status(400).json({error: 'Category no longer exists!'});
    }

    let product = await db.collection('products').doc(id).get();
    if(!product.exists) return res.status(404).json({error: 'Product no longer exists!'});

    if(body.title && typeof body.title === 'string')
      updatedData = {
        ...updatedData,
        title: body.title,
        slug: `${body.title.toLowerCase().split(' ').join('-')}_${product.id}`,
      }

    return res.status(200).json(updatedData);
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
};

const removeProduct = async (req: IRequest, res: NextApiResponse) => {
	try {
    const id = req.query.id as string;
		if (!id) return res.status(400).json({error: 'Invalid product id!'});

    await db.collection('products').doc(id).delete();
    return res.status(204).end();
	} catch (err) {
		return res.status(400).json({error: (err as Error).message});
	}
};

const handler = async (req: IRequest, res: NextApiResponse) => {
	switch (req.method) {
		case 'GET':
			return await getProductDetails(req, res);
		case 'PUT':
			return withAuth(withAdmin(updateProduct));
		case 'DELETE':
			return withAuth(withAdmin(removeProduct));
		default:
			return res.status(405).end();
	}
};

export default handler;
