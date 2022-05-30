import { model, Schema } from 'mongoose';
import { RoomStatus } from 'util/enums';

const RoomSchema = new Schema({
  access: { type: Boolean, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'UserSchema', required: true },
  status: { type: String, required: true, default: RoomStatus.PREP },
  created: { type: Date, required: true, default: Date.now() },
  password: { type: String },
  guest: { type: Schema.Types.ObjectId, ref: 'UserSchema' },
  chat: {
    type: [{
      message: {
        text: { type: String }, from: { type: String }, date: { type: Date },
      },
    }],
  },
});

export const RpcRoom = model('RpcRoom', RoomSchema);
