import mongoose from "mongoose";
import "dotenv/config";
const MONGO_DB_URL = process.env.MONGO_DB_URL;

let connection = null;
export const connect = async () => {
  if (connection == null) {
    console.log("connecting to db");
    connection = mongoose.connect(MONGO_DB_URL, {
      // serverSelectionTimeoutMS: 5000,
    });
    await connection;
  }
  return connection;
};

export const isDbConnected = () => {
  // Mongoose connection states:
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  console.log(mongoose.connection.readyState);
  return mongoose.connection.readyState === 1;
};
