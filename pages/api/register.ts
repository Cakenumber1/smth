// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { register } from 'api/server/controller';
import type { NextApiRequest, NextApiResponse } from 'next';
import validate from 'util/midllewares/validate';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': {
      if (req.body.validate) {
        return res.status(400).json(req.body.validate);
      }
      const { mail, username, password } = req.body;
      const r = await register(mail, username, password);
      if (r) {
        return res.status(200).json(r);
      }
      return res.status(400).json(`User ${username} already exists`);
    }
    default:
  }
  return res.status(400).json('Smth went wrong');
}

export default validate(handler);
