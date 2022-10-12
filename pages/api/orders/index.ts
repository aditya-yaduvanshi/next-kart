import withAuth, { IRequest } from 'middlewares/withAuth';
import type { NextApiResponse } from 'next'

interface IOrder {
  product: string;
  user: string;
  id: string;
  quantity: number;
  price: number;
  deliveryStatus: 'dispatched' | 'ordered' | 'recieved' | 'returned' | 'replaced';
  paymentMethod: 'COD' | 'UPI' | 'NET BANKING' | 'CARD';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  address: string;
  deliveryDate: Date;
  orderDate: Date;
}

const getOrders = async (req: IRequest, res: NextApiResponse) => {
  try {

  } catch (err) {

  }
}

const newOrder = async (req: IRequest, res: NextApiResponse) => {
  try {
    const user = req.user;
    const body = req.body as IOrder;
  } catch (err) {
    
  }
}

const handler = async (
  req: IRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'GET': return getOrders(req, res)
    case 'POST': return newOrder(req, res);
    default: return res.status(405).end();
  }
}

export default withAuth(handler);
