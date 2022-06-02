import { model, Schema } from 'mongoose';
import { IUser } from 'util/interfaces';

const UserSchema = new Schema<IUser>({
  mail: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export const User = model<IUser>('User', UserSchema);
