import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import lessonsRoutes from "./routes/lessons";
import progressRoutes from "./routes/progress";
import userRoutes from "./routes/user";
import debugRoutes from "./routes/debug";
import conversationsRoutes from "./routes/conversations";
import preferencesRoutes from "./routes/preferences";
import Lesson from "./models/Lesson";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send({ status: "ok", message: "Learning-web backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/user", userRoutes);
app.use("/api/conversations", conversationsRoutes);
app.use("/api/preferences", preferencesRoutes);
if (process.env.NODE_ENV !== "production") {
  app.use("/api/debug", debugRoutes);
}

async function start() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/learning-web";
  try {
    // Helpful dev settings
    mongoose.set("strictQuery", false);
    if (process.env.NODE_ENV !== "production") {
      mongoose.set("debug", true);
    }

    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected, state=", mongoose.connection.readyState);
    });
    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err && (err as any).message ? (err as any).message : err);
    });

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
    // Seed sample lessons if none exist
    try {
      const count = await Lesson.countDocuments();
      if (count === 0) {
        const sample = [
          {
            title: "Intro to Hiragana",
            language: "Japanese",
            content: "Learn the basic hiragana characters and pronunciation.",
            questions: [
              { question: "What is the hiragana for 'a' ?", options: ["あ", "い", "う", "え"], correct: 0 },
              { question: "What is the hiragana for 'i' ?", options: ["お", "い", "う", "え"], correct: 1 },
              { question: "What is the hiragana for 'u' ?", options: ["あ", "い", "う", "え"], correct: 2 },
              { question: "What is the hiragana for 'e' ?", options: ["あ", "い", "う", "え"], correct: 3 },
              { question: "Which hiragana is 'na'?", options: ["な", "に", "ぬ", "ね"], correct: 0 },
              { question: "Which hiragana is 'mi'?", options: ["む", "め", "み", "も"], correct: 2 }
            ]
          },
          {
            title: "Basic English Grammar",
            language: "English",
            content: "Nouns, verbs, and simple sentence structure.",
            questions: [
              { question: "Which word is a noun?", options: ["Run", "Quickly", "Table", "Blue"], correct: 2 },
              { question: "Which is a verb?", options: ["Happy", "Eat", "Big", "Yellow"], correct: 1 },
              { question: "Choose the plural noun:", options: ["Child", "Children", "Childs", "Childes"], correct: 1 },
              { question: "Which is an adjective?", options: ["Run", "Happy", "Quickly", "He"], correct: 1 },
              { question: "Select the pronoun:", options: ["Apple", "They", "Walk", "Green"], correct: 1 }
            ]
          },
          {
            title: "Spanish Greetings",
            language: "Spanish",
            content: "Common greetings and polite phrases.",
            questions: [
              { question: "How do you say 'Hello' in Spanish?", options: ["Hola", "Bonjour", "Ciao", "Hallo"], correct: 0 },
              { question: "What does 'Gracias' mean?", options: ["Please", "Thank you", "Goodbye", "Hello"], correct: 1 },
              { question: "How do you say 'Good morning'?", options: ["Buenas noches", "Buenos días", "Buenas tardes", "Adiós"], correct: 1 },
              { question: "Which is a polite way to say 'please'?", options: ["Por favor", "Gracias", "De nada", "Lo siento"], correct: 0 },
              { question: "How do you say 'See you later'?", options: ["Hasta luego", "Hola", "Adiós", "Buenos días"], correct: 0 }
            ]
          }
        ];
        await Lesson.insertMany(sample);
        console.log("Seeded sample lessons with questions");
      } else {
        console.log(`Lessons collection has ${count} documents`);
      }
    } catch (err) {
      console.error("Failed to seed lessons:", err && (err as any).message ? (err as any).message : err);
    }
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

start();
