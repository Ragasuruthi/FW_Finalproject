import mongoose, { Schema, Document } from "mongoose";

export interface IUserPreferences extends Document {
  userId: mongoose.Types.ObjectId;
  preferredLanguage: string;
  learningStyle: "visual" | "auditory" | "kinesthetic" | "reading-writing";
  difficulty: "beginner" | "intermediate" | "advanced";
  dailyGoalXp: number;
  notificationsEnabled: boolean;
  darkMode: boolean;
  theme: "light" | "dark" | "auto";
  updatedAt: Date;
}

const UserPreferencesSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    preferredLanguage: { type: String, default: "english" },
    learningStyle: {
      type: String,
      enum: ["visual", "auditory", "kinesthetic", "reading-writing"],
      default: "visual"
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    },
    dailyGoalXp: { type: Number, default: 100 },
    notificationsEnabled: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: true },
    theme: {
      type: String,
      enum: ["light", "dark", "auto"],
      default: "dark"
    }
  },
  { timestamps: true }
);

const UserPreferences = mongoose.model<IUserPreferences>(
  "UserPreferences",
  UserPreferencesSchema
);
export default UserPreferences;
