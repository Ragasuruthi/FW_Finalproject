import { Router, Request, Response } from "express";
import { User, Lesson } from "../models";
import mongoose from "mongoose";

const router = Router();

// Development-only debug endpoints to inspect DB contents quickly.
router.get("/users", async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("_id email name createdAt").limit(100);
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

router.get("/lessons", async (_req: Request, res: Response) => {
  try {
    const lessons = await Lesson.find().limit(100);
    res.json({ lessons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

// POST /api/debug/seed-lessons?force=true
// Development helper: seed sample lessons with questions. If `force=true` it will delete existing lessons first.
router.post("/seed-lessons", async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "not allowed in production" });
  }

  const force = req.query.force === "true";
  try {
    if (force) {
      await Lesson.deleteMany({});
    }

    const existing = await Lesson.countDocuments();
    if (existing > 0 && !force) {
      return res.status(400).json({ error: "lessons already exist, use ?force=true to replace" });
    }

    const sample = [
      // ENGLISH - Lesson 1: Grammar
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
      // ENGLISH - Lesson 2: Common Phrases
      {
        title: "English Daily Phrases",
        language: "English",
        content: "Essential phrases for everyday conversation.",
        questions: [
          { question: "How do you ask someone's name politely?", options: ["What is your name?", "Name?", "Who are you?", "Tell me your name"], correct: 0 },
          { question: "Which is NOT a greeting?", options: ["Hello", "Hi", "Good morning", "Goodbye"], correct: 3 },
          { question: "How do you apologize?", options: ["Excuse me", "Sorry", "Pardon", "I regret"], correct: 1 },
          { question: "What do you say before leaving?", options: ["See you later", "Goodbye", "Have a nice day", "All of the above"], correct: 3 },
          { question: "How do you offer help?", options: ["Can I help you?", "Do you need help?", "How can I assist?", "All of the above"], correct: 3 }
        ]
      },
      // SPANISH - Lesson 1: Greetings
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
      },
      // SPANISH - Lesson 2: Numbers & Time
      {
        title: "Spanish Numbers & Time",
        language: "Spanish",
        content: "Learn numbers, days of the week, and telling time.",
        questions: [
          { question: "What is the number 5 in Spanish?", options: ["Cuatro", "Cinco", "Seis", "Siete"], correct: 1 },
          { question: "Which day is Monday?", options: ["Lunes", "Domingo", "Jueves", "Viernes"], correct: 0 },
          { question: "What does 'Mañana' mean?", options: ["Today", "Tonight", "Tomorrow", "Yesterday"], correct: 2 },
          { question: "How do you say 'It is 3 o'clock'?", options: ["Son las tres", "Es las tres", "Hay las tres", "Seis horas"], correct: 0 },
          { question: "What is Saturday in Spanish?", options: ["Sábado", "Domingo", "Lunes", "Miércoles"], correct: 0 }
        ]
      },
      // FRENCH - Lesson 1: Greetings & Basics
      {
        title: "French Greetings & Basics",
        language: "French",
        content: "Introduction to common French greetings and phrases.",
        questions: [
          { question: "How do you say 'Hello' in French?", options: ["Bonjour", "Hola", "Ciao", "Namaste"], correct: 0 },
          { question: "What does 'Merci' mean?", options: ["Please", "Thank you", "Goodbye", "Never mind"], correct: 1 },
          { question: "How do you say 'Good evening'?", options: ["Bonjour", "Bonsoir", "Bonne nuit", "Bonne journée"], correct: 1 },
          { question: "What is 'Excusez-moi' used for?", options: ["Saying goodbye", "Saying hello", "Getting attention/apologizing", "Saying thanks"], correct: 2 },
          { question: "How do you say 'Yes' in French?", options: ["Oui", "Non", "Si", "Peut-être"], correct: 0 }
        ]
      },
      // FRENCH - Lesson 2: Food & Dining
      {
        title: "French Food & Dining",
        language: "French",
        content: "Food vocabulary and restaurant phrases in French.",
        questions: [
          { question: "What is bread in French?", options: ["Bon", "Pain", "Lait", "Vin"], correct: 1 },
          { question: "How do you order water at a restaurant?", options: ["Un café", "Une eau", "Un vin", "Un pain"], correct: 1 },
          { question: "What is the word for cheese?", options: ["Lait", "Fromage", "Pain", "Œuf"], correct: 1 },
          { question: "What does 'L'addition, s'il vous plaît' mean?", options: ["Water please", "The bill, please", "Hello", "Goodbye"], correct: 1 },
          { question: "What is milk in French?", options: ["Vin", "Lait", "Jus", "Café"], correct: 1 }
        ]
      },
      // JAPANESE - Lesson 1: Hiragana
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
      // JAPANESE - Lesson 2: Basic Phrases
      {
        title: "Japanese Basic Phrases",
        language: "Japanese",
        content: "Common everyday Japanese expressions.",
        questions: [
          { question: "How do you say 'Thank you' in Japanese?", options: ["ありがとう", "こんにちは", "さようなら", "お願いします"], correct: 0 },
          { question: "What does 'こんにちは' mean?", options: ["Good morning", "Hello/Good afternoon", "Goodbye", "Thank you"], correct: 1 },
          { question: "How do you say 'Goodby' in formal Japanese?", options: ["じゃあね", "さようなら", "またね", "おはよう"], correct: 1 },
          { question: "What is 'おはようございます' used for?", options: ["Good afternoon", "Good evening", "Good morning (polite)", "Goodnight"], correct: 2 },
          { question: "What does 'すみません' mean?", options: ["Please", "Thank you", "Excuse me/Sorry", "Hello"], correct: 2 }
        ]
      },
      // GERMAN - Lesson 1: Basics & Greetings
      {
        title: "German Basics & Greetings",
        language: "German",
        content: "Introduction to German greetings and essential phrases.",
        questions: [
          { question: "How do you say 'Hello' in German?", options: ["Hallo", "Bonjour", "Buenos días", "Ciao"], correct: 0 },
          { question: "What does 'Danke' mean?", options: ["Please", "Thank you", "Goodbye", "Good morning"], correct: 1 },
          { question: "How do you say 'Good morning' in German?", options: ["Guten Morgen", "Guten Abend", "Gute Nacht", "Auf Wiedersehen"], correct: 0 },
          { question: "What is 'Bitte' used for?", options: ["Saying hello", "Saying 'please'", "Saying goodbye", "Saying thank you"], correct: 1 },
          { question: "How do you say 'Goodbye' formally?", options: ["Auf Wiedersehen", "Tschüss", "Auf Wiedersehen", "Gute Nacht"], correct: 0 }
        ]
      },
      // GERMAN - Lesson 2: Colors & Objects
      {
        title: "German Colors & Objects",
        language: "German",
        content: "Learn colors, common objects, and descriptive words.",
        questions: [
          { question: "What is red in German?", options: ["Blau", "Rot", "Gelb", "Grün"], correct: 1 },
          { question: "How do you say 'blue' in German?", options: ["Rot", "Blau", "Gelb", "Weiß"], correct: 1 },
          { question: "What is the German word for 'house'?", options: ["Baum", "Haus", "Tür", "Fenster"], correct: 1 },
          { question: "What color is 'grün'?", options: ["Red", "Blue", "Green", "Yellow"], correct: 2 },
          { question: "How do you say 'table'?", options: ["Stuhl", "Tisch", "Fenster", "Bett"], correct: 1 }
        ]
      },
      // CHINESE - Lesson 1: Basic Greetings
      {
        title: "Chinese Greetings & Basics",
        language: "Chinese",
        content: "Learn basic Mandarin Chinese greetings and polite expressions.",
        questions: [
          { question: "How do you say 'Hello' in Mandarin?", options: ["你好", "谢谢", "再见", "是的"], correct: 0 },
          { question: "What does '谢谢' mean?", options: ["Please", "Thank you", "Goodbye", "Hello"], correct: 1 },
          { question: "How do you say 'Goodbye' in Chinese?", options: ["你好", "谢谢", "再见", "对不起"], correct: 2 },
          { question: "What is '对不起' used for?", options: ["Greeting", "Thanking", "Apologizing", "Asking for help"], correct: 2 },
          { question: "How do you ask 'How are you?' politely?", options: ["你是谁?", "你好吗?", "what是你?", "谢谢你"], correct: 1 }
        ]
      },
      // CHINESE - Lesson 2: Numbers & Common Words
      {
        title: "Chinese Numbers & Common Words",
        language: "Chinese",
        content: "Essential numbers, colors, and everyday vocabulary.",
        questions: [
          { question: "What is the number one in Mandarin?", options: ["二", "三", "一", "四"], correct: 2 },
          { question: "How do you say 'two' in Chinese?", options: ["一", "二", "三", "四"], correct: 1 },
          { question: "What does '水' (shuǐ) mean?", options: ["Fire", "Water", "Earth", "Metal"], correct: 1 },
          { question: "What color is '红色'?", options: ["Blue", "Red", "Green", "Yellow"], correct: 1 },
          { question: "How do you say 'friend' in Chinese?", options: ["老师", "朋友", "家人", "学生"], correct: 1 }
        ]
      }
    ];

    const docs = await Lesson.insertMany(sample);
    res.json({ inserted: docs.length, lessons: docs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

// Return Mongoose connection info to help diagnose wrong DB/URI
router.get("/info", (_req: Request, res: Response) => {
  try {
    const conn = mongoose.connection;
    const dbName = conn.db ? (conn.db.databaseName as string) : undefined;
    const readyState = conn.readyState; // 0 disconnected, 1 connected
    const debug = mongoose.get("debug") || false;
    // Mask the URI for safety
    const rawUri = process.env.MONGODB_URI || null;
    const maskedUri = rawUri ? rawUri.replace(/:(?:[^:@]+)@/, ':***@') : null;
    res.json({ readyState, dbName, debug, uri: maskedUri, nodeEnv: process.env.NODE_ENV || "development" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal error" });
  }
});

export default router;
