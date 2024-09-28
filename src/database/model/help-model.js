import mongoose from "mongoose";

const helpSchema = mongoose.Schema({
  help_message: String,
});

export const Help = mongoose.model("Help", helpSchema);
