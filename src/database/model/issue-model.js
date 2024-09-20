import mongoose from "mongoose";

export const IssueStatus = [
  "IN-PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "DEFERRED",
];

const ObjectId = mongoose.Schema.Types.ObjectId;
const issueSchema = mongoose.Schema({
  message_id: {
    type: ObjectId,
    ref: "Message",
  },
  acknowledge_message_id: {
    type: ObjectId,
    ref: "Message",
  },
  status: {
    type: String,
    enum: IssueStatus,
  },
  create_date: {
    type: Date,
    default: Date.now,
  },
});

export const Issue = mongoose.model("Issue", issueSchema);
