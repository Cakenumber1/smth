import bcrypt from 'bcrypt';
import { EventEmitter } from 'events';
import mongoose, { Types } from 'mongoose';
import { generateAccessToken } from 'util/accessToken';
import { RoomStatus } from 'util/enums';
import { RpcRoom } from 'util/models/Room';
import { User } from 'util/models/User';

export const serverEventEmitter = new EventEmitter();

const url = `mongodb+srv://admin:${process.env.NEXT_PUBLIC_PASSWORD}@cluster0.dfouy.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url).then();

const clearExpiredRooms = () => {
  const outdated = new Date(Date.now() - 300000);

  RpcRoom.deleteMany({
    $and: [
      { created: { $lt: outdated } },
      { status: RoomStatus.PREP },
    ],
  }, (err) => {
    if (err) console.log(err);
    serverEventEmitter.emit('invterval-rooms-deleted');
  });
};

setInterval(() => {
  clearExpiredRooms();
}, 300000); // repeat in 5 min (300000)

export const createRpcRoom = async (
  access: boolean,
  owner: Types.ObjectId,
  password?: string,
): Promise<any> => {
  const rooms = await RpcRoom.find({ owner });
  if (rooms.length > 3) {
    return { error: 'limit of rooms per user reached' };
  }
  const rpcModel = new RpcRoom({
    access, owner, password,
  });
  const a = await rpcModel.save();
  return a;
};

export const deleteRpcRoom = async (
  rid: Types.ObjectId,
): Promise<any> => {
  await RpcRoom.findByIdAndDelete({ _id: rid });
};

export const getNonPrivateRpcRooms = async () => {
  try {
    const rooms = await RpcRoom.find({
      $and: [
        { access: true },
        { status: RoomStatus.PREP },
      ],
    });
    return rooms;
  } catch (e) {
    return [];
  }
};

export const addRoomMember = async (uid: Types.ObjectId, rid: Types.ObjectId) => {
  const room = await RpcRoom.findById({ _id: rid });
  const user = await User.findById({ _id: uid });
  if (!room || !user || user.room) {
    return null;
  }
  if (room.members!.length < 2 && (room.members!.indexOf(uid) === -1)) {
    room.members!.push(uid);
    await room.save();
    user.room = rid;
    await user.save();
    return room;
  }
  return null;
};

export const removeRoomMember = async (uid: Types.ObjectId, rid: Types.ObjectId) => {
  const room = await RpcRoom.findById({ _id: rid });
  const user = await User.findById({ _id: uid });
  if (!room || !user) {
    return null;
  }
  user.room = undefined;
  await user.save();
  const index = room.members!.indexOf(uid);
  if (index !== -1) {
    room.members!.splice(index, 1);
    await room.save();
    return room;
  }
  return null;
};
// todo: updRoomStatus
export const updRoomStatus = () => {
  const a = 1;
  const b = 2;
  return a + b;
};

export const register = async (mail: string, username: string, password: string) => {
  const candidate = await User.findOne({ mail });
  if (candidate) {
    return false;
  }
  const hPass = bcrypt.hashSync(password, 5);
  const user = new User({ mail, username, password: hPass });
  await user.save();
  return generateAccessToken(user);
};

export const checkUserExists = async (mail: string) => User.findOne({ mail });

export const login = async (mail: string, password: string) => {
  const user = await checkUserExists(mail);
  if (!user) {
    return 404;
  }
  const validatePass = bcrypt.hashSync(password, user.password);
  if (!validatePass) {
    return 403;
  }
  return generateAccessToken(user);
};
