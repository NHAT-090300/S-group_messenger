import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Schema = mongoose.Schema;

const messagesSchema = new Schema({
    senderID: Number,
    receiverID: Number,
    messages: String,
    createdAt: String,
});

const MessageModel = mongoose.model('message', messagesSchema);

export default MessageModel;
