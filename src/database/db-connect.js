import mongoose from "mongoose";

const MONGO_DB_URL = process.env.MONGO_DB_URL;

export const connect = async () => {
  mongoose.connect(MONGO_DB_URL);
};
