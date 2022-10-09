import withAdmin from 'middlewares/withAdmin';
import withAuth, { IRequest } from 'middlewares/withAuth';
import type { NextApiResponse } from 'next';
import {db} from 'utils/admin.firebase';
import { ICategory } from '.';

const getCategory = async (req: IRequest, res: NextApiResponse) => {
  try {
    const id = req.query.id as string;
    let category = await db.collection('categories').doc(id).get();
    return res.status(200).json({id: category.id, ...category.data()});
  } catch (err) {
    return res.status(400).json({error: (err as Error).message});
  }
}

const updateCategory = async (req: IRequest, res: NextApiResponse) => {
  try {
    const id = req.query.id as string;
    const body = req.body as Partial<ICategory>;

    if(!body.name && !body.image) return res.status(400).json({error: 'Required Fields Cannot Be Empty!'});

    let category = {};

    if(body.name) {
      category = {
        ...category,
        name: body.name,
      }
    }
    if(body.image) {
      category = {
        ...category,
        image: body.image,
      }
    }

    await db.collection('categories').doc(id).update(category);

    return res.status(200).json(category);
  } catch (err) {
    return res.status(400).json({error: (err as Error).message});
  }
}

// const deleteCategory = async (req: IRequest, res: NextApiResponse) => {
//   try {
//     const id = req.query.id as string;

//     await db.collection('categories').doc(id).delete();

//     return res.status(204).end();
//   } catch (err) {
//     return res.status(400).json({error: (err as Error).message});
//   }
// }


const handler = async (
  req: IRequest,
  res: NextApiResponse
) => {
  const id = req.query.id as string;
  if(!id) return res.status(404).json({error: 'Id Not Provided!'});
  switch (req.method) {
    case 'GET': return getCategory(req, res);
    case 'PUT': return updateCategory(req, res);
    default: return res.status(405).end();
  }
}

export default withAuth(withAdmin(handler));
