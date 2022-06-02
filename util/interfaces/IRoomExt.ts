import { Types } from 'mongoose';
import { IRoom } from 'util/interfaces/IRoom';

/* Interface for Room with _id,
 used for server responses,
 which provide data from Mongo Schemas */
export type IRoomExt = IRoom & { _id: Types.ObjectId };
