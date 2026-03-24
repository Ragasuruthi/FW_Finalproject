import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  language: { type: String, required: true },
  level: { type: Number, default: 1 },
  completedLessons: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Progress", progressSchema);