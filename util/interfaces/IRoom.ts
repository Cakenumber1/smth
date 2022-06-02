import { Types } from 'mongoose';
import { IMessage } from 'util/interfaces/IMessage';

export type IRoom = {
  access: boolean,
  owner: Types.ObjectId,
  status: string,
  created: number,
  chat: IMessage[],
  password?: string,
  members?: Types.ObjectId[],
};
