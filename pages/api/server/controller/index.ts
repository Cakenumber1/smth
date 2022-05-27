import { Chat } from 'api/server/models/Chat';
import { User } from 'api/server/models/User';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { generateAccessToken } from 'util/accessToken/generateAccessTokem';

const url = `mongodb+srv://admin:${process.env.NEXT_PUBLIC_PASSWORD}@cluster0.dfouy.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url).then();

export const createChat = async () => {
  const chatModel = new Chat({ name: 'Chat1' });
  await chatModel.save();
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
