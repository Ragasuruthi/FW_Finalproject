import { useState, useEffect } from "react";
import apiFetch from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import pandaHappy from "@/assets/panda-happy.png";
import pandaSurprised from "@/assets/panda-surprised.png";
import { CheckCircle2, XCircle, Sparkles, Zap } from "lucide-react";

const fallbackQuestions = [
  {
    question: "How do you say 'Hello' in Spanish?",
    options: ["Hola", "Bonjour", "Ciao", "Hallo"],
    correct: 0,
  },
  {
    question: "What does 'Gracias' mean?",
    options: ["Please", "Thank you", "Goodbye", "Hello"],
    correct: 1,
  },
  {
    question: "How do you say 'Goodbye' in Spanish?",
    options: ["Buenos días", "Buenas noches", "Adiós", "Hasta luego"],
    correct: 2,
  },
];

const Lesson = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [particles, setParticles] = useState<Array<{id: number; emoji: string}>>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const lessonId = params.get("lessonId");

  const [questions, setQuestions] = useState(fallbackQuestions);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // fetch lesson by id and use its questions if available
    const load = async () => {
      if (!lessonId) return;
      setLoading(true);
      try {
        const data = await apiFetch(`/api/lessons/${lessonId}`);
        // server may return { lesson } or just the lesson object
        const maybeQuestions = data?.questions ?? data?.lesson?.questions ?? data?.lesson?.data?.questions;
        if (maybeQuestions && Array.isArray(maybeQuestions) && maybeQuestions.length > 0) {
          setQuestions(maybeQuestions);
          // reset quiz state so the newly-loaded questions start from beginning
          setCurrentQuestion(0);
          setScore(0);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setShowResult(false);
        }
      } catch (e) {
        console.error("Failed to fetch lesson:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [lessonId]);

  const createParticles = (isCorrectAnswer: boolean) => {
    const emojis = isCorrectAnswer
      ? ["🎉", "⭐", "✨", "🎊", "🏆", "🌟", "💫"]
      : ["😊", "💪", "🔥", "⚡", "📚"];

    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));

    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1500);
  };

  const handleAnswer = (answerIndex: number) => {
    const correct = answerIndex === questions[currentQuestion].correct;
    setSelectedAnswer(answerIndex);
    setIsCorrect(correct);
    createParticles(correct);

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const percentage = Math.round((score / questions.length) * 100);

  if (showResult) {
    const isExcellent = percentage >= 80;
    const isGood = percentage >= 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500/5 via-background to-purple-500/5 p-4 md:p-8 relative overflow-hidden flex items-center justify-center">
        {/* Animated background */}
        <motion.div
          className="absolute top-10 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 50, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="relative z-10"
        >
          <Card className="p-8 md:p-16 text-center border-2 shadow-2xl max-w-2xl bg-gradient-to-br from-background to-muted/30">
            {/* Confetti Animation */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                initial={{
                  x: 0,
                  y: 0,
                  scale: 1,
                  rotate: 0,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 400,
                  y: -300,
                  scale: [1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 0.3,
                  ease: "easeOut",
                }}
              >
                {["🎉", "⭐", "✨", "🎊", "🏆"][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}

            {/* Animated Panda */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 0.6, repeat: 2 }}
              className="mb-8"
            >
              <img
                src={pandaHappy}
                alt="Celebrating panda"
                className="w-32 h-32 md:w-40 md:h-40 mx-auto drop-shadow-lg"
              />
            </motion.div>

            {/* Result Text */}
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6 }}
            >
              {isExcellent ? "Outstanding! 🔥" : isGood ? "Great Job! 🌟" : "Good Effort! 💪"}
            </motion.h2>

            {/* Score Display */}
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-6xl md:text-7xl font-bold mb-2 text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text"
              >
                {percentage}%
              </motion.div>
              <p className="text-xl md:text-2xl text-muted-foreground mb-2">
                You scored {score} out of {questions.length}
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl font-semibold text-orange-500 flex items-center justify-center gap-2"
              >
                <Zap className="w-6 h-6" />
                +{score * 50} XP earned!
              </motion.p>
            </div>

            {/* Performance Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.3, duration: 1 }}
              className="mb-8"
            >
              <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden border border-muted-foreground/20">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${
                    isExcellent
                      ? "from-green-500 to-emerald-500"
                      : isGood
                      ? "from-blue-500 to-cyan-500"
                      : "from-orange-500 to-yellow-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: 0.5, duration: 1.5 }}
                />
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              className="grid grid-cols-3 gap-4 mb-8 py-6 px-4 bg-muted/30 rounded-lg border border-muted-foreground/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div>
                <p className="text-sm text-muted-foreground mb-1">Correct</p>
                <p className="text-2xl font-bold text-green-500">{score}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Incorrect</p>
                <p className="text-2xl font-bold text-red-500">
                  {questions.length - score}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                <p className="text-2xl font-bold text-blue-500">{percentage}%</p>
              </div>
            </motion.div>

            {/* Motivational Message */}
            <motion.p
              className="text-base md:text-lg text-muted-foreground mb-8 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {isExcellent
                ? "Amazing! You're a natural at this! Keep it up! 🚀"
                : isGood
                ? "Well done! Just a bit more practice and you'll be perfect!"
                : "Good start! Review the material and try again to improve!"}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button
                onClick={async () => {
                  try {
                    // send progress to backend (best-effort)
                    if (lessonId) {
                      await fetch("/api/progress", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
                        },
                        body: JSON.stringify({
                          lessonId,
                          completed: true,
                          score: percentage,
                        }),
                      });
                    }
                  } catch (e) {
                    // ignore
                  }
                  navigate("/dashboard");
                }}
                className="flex-1 h-12 md:h-14 text-base md:text-lg bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 font-semibold gap-2"
              >
                <span>Continue to Dashboard</span>
                <Sparkles className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="flex-1 h-12 md:h-14 text-base md:text-lg border-2 font-semibold gap-2"
              >
                <span>Try Again</span>
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500/5 via-background to-purple-500/5 p-4 md:p-8">
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="fixed text-3xl md:text-4xl"
            initial={{
              x: "50%",
              y: "50%",
              opacity: 1,
              scale: 1,
            }}
            animate={{
              x: `${50 + (Math.random() - 0.5) * 200}%`,
              y: `${50 - Math.random() * 200}%`,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {particle.emoji}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto max-w-3xl relative z-10">
        {/* Header with Progress */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Learning Challenge
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-lg md:text-xl font-bold text-purple-500 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {score}/{questions.length} Correct
            </motion.div>
          </div>

          <div className="space-y-2">
            <div className="relative h-3 bg-muted/30 rounded-full overflow-hidden border border-muted-foreground/20">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "tween", duration: 0.5 }}
              >
                <motion.div
                  className="h-full bg-white/20"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            </div>
            <p className="text-center text-sm text-muted-foreground font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-6 md:p-10 border-2 shadow-xl bg-gradient-to-br from-background to-muted/30">
              {/* Animated Panda Reaction */}
              <motion.div
                animate={
                  isCorrect !== null
                    ? {
                        scale: [1, 1.15, 1],
                        rotate: [0, 5, -5, 0],
                      }
                    : { scale: 1 }
                }
                transition={{ duration: 0.6 }}
                className="flex justify-center mb-8"
              >
                <img
                  src={isCorrect === false ? pandaSurprised : pandaHappy}
                  alt="Panda reaction"
                  className="w-28 h-28 md:w-32 md:h-32 drop-shadow-lg"
                />
              </motion.div>

              {/* Question Text */}
              <motion.h2
                className="text-2xl md:text-4xl font-bold text-center mb-10 leading-snug"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {questions[currentQuestion].question}
              </motion.h2>

              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => selectedAnswer === null && handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    whileHover={
                      selectedAnswer === null ? { scale: 1.05, y: -4 } : {}
                    }
                    whileTap={{ scale: 0.98 }}
                    className={`relative p-5 md:p-6 text-lg md:text-xl font-semibold rounded-2xl border-2 transition-all duration-200 ${
                      selectedAnswer === index
                        ? isCorrect
                          ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/70 shadow-lg shadow-green-500/20"
                          : "bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/70 shadow-lg shadow-red-500/20"
                        : "bg-card border-border/50 hover:border-orange-500/50 hover:shadow-lg"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span>{option}</span>
                      {selectedAnswer === index && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", damping: 10 }}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-500" />
                          )}
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Feedback Message */}
              <AnimatePresence>
                {isCorrect !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={`p-4 md:p-6 rounded-xl font-bold text-center text-lg md:text-xl ${
                      isCorrect
                        ? "bg-green-500/20 border border-green-500/50 text-green-600"
                        : "bg-red-500/20 border border-red-500/50 text-red-600"
                    }`}
                  >
                    {isCorrect
                      ? "✨ Correct! Amazing work! ✨"
                      : "💪 That's okay! Keep learning! 💪"}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Lesson;
