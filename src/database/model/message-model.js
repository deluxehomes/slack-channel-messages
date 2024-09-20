import mongoose from "mongoose";

const messageDataSchema = mongoose.Schema({
  user: String,
  type: String,
  ts: String,
  text: String,
});

const messageSchema = mongoose.Schema({
  channel: String,
  ts: String,
  message_data: messageDataSchema,
  senderUserId: String, // the user who execute the command
  senderChannelId: String, // where the command is executed
  message_type: String, //command type(/issue)
});

export const Message = mongoose.model("Message", messageSchema);
