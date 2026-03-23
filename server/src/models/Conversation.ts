import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  messages: IMessage[];
  title: string;
  language?: string;
  topic?: string;
  mode: "tutor" | "practice" | "grammar-check" | "vocabulary";
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  },
  { _id: false }
);

const ConversationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    messages: [MessageSchema],
    title: { type: String, required: true },
    language: { type: String },
    topic: { type: String },
    mode: {
      type: String,
      enum: ["tutor", "practice", "grammar-check", "vocabulary"],
      default: "tutor"
    }
  },
  { timestamps: true }
);

const Conversation = mongoose.model<IConversation>("Conversation", ConversationSchema);
export default Conversation;
