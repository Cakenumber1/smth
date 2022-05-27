import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
  mail: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  chats: [{ type: [Schema.Types.ObjectId], ref: 'ChatSchema' }],
});

export const User = model('User', UserSchema);
