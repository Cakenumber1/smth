import * as jwt from 'jsonwebtoken';
import { ITokenPayload } from 'util/interfaces';

export const generateAccessToken = (user: ITokenPayload) => {
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _id,
    username,
    mail,
  } = user;
  return jwt.sign({ _id, username, mail }, process.env.NEXT_PUBLIC_SECRET as jwt.Secret, { expiresIn: '12h' });
};
