import mongoose from "mongoose";

const messageDataSchema = mongoose.Schema({
  user: String,
  type: String,
  ts: String,
  text: String,
});

const MessageType = ["SENDER", "RECEIVER"];

const messageSchema = mongoose.Schema({
  channel: String,
  ts: String,
  message_data: messageDataSchema,
  // title: String,
  // description: String,
  senderUserId: String,
  senderChannelId: String,
  message_type: {
    type: String,
    enum: MessageType,
  },
});

export const Message = mongoose.model("Message", messageSchema);
