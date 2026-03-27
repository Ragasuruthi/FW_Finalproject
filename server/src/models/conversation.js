import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  language: { type: String, required: true },
  messages: [
    {
      role: { type: String, enum: ["user", "assistant", "ai"] },
      content: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Conversation", conversationSchema);