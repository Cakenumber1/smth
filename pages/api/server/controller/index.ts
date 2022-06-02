import { RpcRoom } from 'api/server/models/Room';
import { User } from 'api/server/models/User';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { generateAccessToken } from 'util/accessToken';
import { RoomStatus } from 'util/enums';

const url = `mongodb+srv://admin:${process.env.NEXT_PUBLIC_PASSWORD}@cluster0.dfouy.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url).then();

const clearRooms = () => {
  const outdated = new Date(Date.now() - 300000);

  RpcRoom.deleteMany({
    $and: [
      { created: { $lt: outdated } },
      { status: RoomStatus.PREP },
    ],
  }, (err) => {
    if (err) console.log(err);
    console.log('Successful deletion');
  });
};

setInterval(() => {
  clearRooms();
}, 300000); // repeat in 5 min

export const createRpcRoom = async (
  access: boolean,
  owner: string,
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

export const getNonPrivateRpcRooms = async () => {
  try {
    const rooms = await RpcRoom.find({ access: true });
    return rooms;
  } catch (e) {
    return [];
  }
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
