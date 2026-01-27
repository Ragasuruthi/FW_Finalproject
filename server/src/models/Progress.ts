import mongoose, { Schema, Document } from "mongoose";

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  completed: boolean;
  score?: number;
  updatedAt: Date;
}

const ProgressSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    lessonId: { type: Schema.Types.ObjectId, ref: "Lesson", required: true, index: true },
    completed: { type: Boolean, default: false },
    score: { type: Number },
  },
  { timestamps: true }
);

ProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

const Progress = mongoose.model<IProgress>("Progress", ProgressSchema);
export default Progress;
