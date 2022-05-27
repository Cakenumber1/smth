import * as jwt from 'jsonwebtoken';

export const verifyAccessToken = (
  token: string,
) => jwt.verify(token, process.env.NEXT_PUBLIC_SECRET as jwt.Secret);
