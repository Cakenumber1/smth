import { Types } from 'mongoose';

export type ITokenPayload = {
  _id: Types.ObjectId,
  username: string,
  mail: string,
};
