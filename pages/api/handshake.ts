// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { checkUserExists } from 'api/server/controller';
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAccessToken } from 'util/accessToken/verifyAccessToken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST': {
      const { token } = req.body;
      try {
        // @ts-ignore
        const { mail } = verifyAccessToken(token as string);
        const exists = await checkUserExists(mail);
        if (exists) {
          return res.status(200).json(token);
        }
        return res.status(404).json('User doesn\'t exist any more');
      } catch (e) {
        return res.status(403).json('Need to login again');
      }
    }
    default:
  }
  return res.status(400).json('Smth went wrong');
}
