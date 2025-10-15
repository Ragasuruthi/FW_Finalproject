import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import pandaHappy from "@/assets/panda-happy.png";
import pandaSurprised from "@/assets/panda-surprised.png";

const questions = [
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
  const navigate = useNavigate();

  const handleAnswer = (answerIndex: number) => {
    const correct = answerIndex === questions[currentQuestion].correct;
    setSelectedAnswer(answerIndex);
    setIsCorrect(correct);

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

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <Card className="p-12 text-center border-2 shadow-2xl max-w-md">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <img
                src={pandaHappy}
                alt="Celebrating panda"
                className="w-32 h-32 mx-auto"
              />
            </motion.div>
            <h2 className="text-4xl font-bold mb-4">Awesome! 🎉</h2>
            <p className="text-2xl mb-2">
              You scored {score} out of {questions.length}
            </p>
            <p className="text-xl text-muted-foreground mb-8">
              +{score * 50} XP earned!
            </p>
            
            {/* Confetti-like elements */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{
                  x: "50%",
                  y: "50%",
                  scale: 0,
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: [0, 1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 1,
                  delay: Math.random() * 0.5,
                }}
              >
                {["🎉", "⭐", "✨", "🎊"][Math.floor(Math.random() * 4)]}
              </motion.div>
            ))}
            
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full h-12 text-lg bg-gradient-to-r from-primary to-accent"
            >
              Back to Dashboard
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 p-8">
      <div className="container mx-auto max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-4" />
          <p className="text-center mt-2 text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8 border-2 shadow-2xl">
              {/* Panda Reaction */}
              <motion.div
                animate={isCorrect !== null ? { scale: [1, 1.2, 1] } : {}}
                className="flex justify-center mb-8"
              >
                <img
                  src={isCorrect === false ? pandaSurprised : pandaHappy}
                  alt="Panda reaction"
                  className="w-24 h-24"
                />
              </motion.div>

              {/* Question */}
              <h2 className="text-3xl font-bold text-center mb-8">
                {questions[currentQuestion].question}
              </h2>

              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => selectedAnswer === null && handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    whileHover={{ scale: selectedAnswer === null ? 1.05 : 1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-6 text-xl font-medium rounded-2xl border-2 transition-all ${
                      selectedAnswer === index
                        ? isCorrect
                          ? "bg-green-500/20 border-green-500"
                          : "bg-red-500/20 border-red-500"
                        : "bg-card border-border hover:border-primary"
                    }`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {isCorrect !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-8 text-center"
                  >
                    <p className={`text-2xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                      {isCorrect ? "Correct! 🎉" : "Oops! Try again next time 😊"}
                    </p>
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
