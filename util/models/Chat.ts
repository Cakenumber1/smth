import { model, Schema } from 'mongoose';

const ChatSchema = new Schema({
  name: { type: String, unique: true, required: true },
  messages: [{
    type: {
      from: String,
      text: String,
      date: Date,
    },
  }],
});

export const Chat = model('Chat', ChatSchema);
