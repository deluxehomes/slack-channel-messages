import mongoose from "mongoose";

const MONGO_DB_URL = process.env.MONGO_DB_URL;

export const connect = async () => {
  mongoose.connect(MONGO_DB_URL);
};

export const isDbConnected = () => {
  // Mongoose connection states:
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  return mongoose.connection.readyState === 1;
};
