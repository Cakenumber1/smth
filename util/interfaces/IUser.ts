import { Types } from 'mongoose';

export type IUser = {
  mail: string,
  username: string,
  password: string,
  room?: Types.ObjectId
};
