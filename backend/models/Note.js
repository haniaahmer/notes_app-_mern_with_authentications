// models/Note.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 🔑 link to user
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
