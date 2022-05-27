// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { login } from 'api/server/controller';
import type { NextApiRequest, NextApiResponse } from 'next';
import validate from 'util/midllewares/validate';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': {
      if (req.body.validate) {
        return res.status(400).json(req.body.validate);
      }
      const { mail, pass } = req.body;
      const r = await login(mail, pass);
      switch (r) {
        case 404:
          return res.status(404).json(`User with ${mail} doesn't exist`);
        case 403:
          return res.status(403).json('Wrong password');
        default:
          return res.status(200).json(r);
      }
    }
    default:
  }
  return res.status(400).json('Smth went wrong');
}

export default validate(handler);
