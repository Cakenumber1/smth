// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createRpcRoom } from 'api/server/controller';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': {
      const { owner } = req.body;
      const r = await createRpcRoom(true, owner);
      if (!r.error) {
        return res.status(200).json(r);
      }
      return res.status(400).json(r.error);
    }
    case 'GET': {
      console.log('get room');
      break;
    }
    default:
  }
  return res.status(400).json('Smth went wrong');
}

export default handler;
