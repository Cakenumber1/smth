import { model, Schema } from 'mongoose';
import { RoomStatus } from 'util/enums';
import { IRoom } from 'util/interfaces';

const RoomSchema = new Schema<IRoom>({
  access: { type: Boolean, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'UserSchema', required: true },
  status: { type: String, required: true, default: RoomStatus.PREP },
  created: { type: Number, required: true, default: Date.now() },
  password: { type: String },
  members: { type: [Schema.Types.ObjectId], ref: 'UserSchema' },
  chat: {
    type: [{
      message: {
        text: { type: String }, from: { type: String }, date: { type: Date },
      },
    }],
  },
});

export const RpcRoom = model<IRoom>('RpcRoom', RoomSchema);
