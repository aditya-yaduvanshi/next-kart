import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case 'GET':
    case 'POST':
    default: return res.status(405).end();
  }
}

export default handler;
