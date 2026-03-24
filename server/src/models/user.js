import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  languages: { type: [String], default: ["English", "Japanese", "German", "Spanish", "French", "Italian"] },
  learningStyle: { type: String, default: "visual" }
}, { timestamps: true });

export default mongoose.model("User", userSchema);