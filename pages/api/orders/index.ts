import withAuth, { IRequest } from 'middlewares/withAuth';
import type { NextApiResponse } from 'next'

const getOrders = async (req: IRequest, res: NextApiResponse) => {
  try {

  } catch (err) {

  }
}

const createOrder = async (req: IRequest, res: NextApiResponse) => {
  try {

  } catch (err) {
    
  }
}

const handler = async (
  req: IRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'GET': return getOrders(req, res)
    case 'POST': return createOrder(req, res);
    default: return res.status(405).end();
  }
}

export default withAuth(handler);
