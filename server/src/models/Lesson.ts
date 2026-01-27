import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface ILesson extends Document {
  title: string;
  language: string;
  content?: string;
  questions?: IQuestion[];
}

const QuestionSchema: Schema = new Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correct: { type: Number, required: true },
  },
  { _id: false }
);

const LessonSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    language: { type: String, required: true },
    content: { type: String },
    questions: { type: [QuestionSchema], default: [] },
  },
  { timestamps: true }
);

const Lesson = mongoose.model<ILesson>("Lesson", LessonSchema);
export default Lesson;
