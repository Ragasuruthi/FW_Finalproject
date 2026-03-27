import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const languages = [
  { name: "English", emoji: "🇬🇧", color: "from-blue-400 to-blue-600" },
  { name: "Spanish", emoji: "🇪🇸", color: "from-yellow-400 to-orange-500" },
  { name: "French", emoji: "🇫🇷", color: "from-blue-500 to-red-500" },
  { name: "Japanese", emoji: "🇯🇵", color: "from-red-400 to-pink-500" },
  { name: "German", emoji: "🇩🇪", color: "from-gray-600 to-yellow-500" },
  { name: "Chinese", emoji: "🇨🇳", color: "from-red-500 to-yellow-400" },
];

const LanguageSelect = () => {
  const navigate = useNavigate();

  const handleSelect = (langName: string) => {
    // Save selection so the Lessons page knows what to fetch
    localStorage.setItem("selectedLanguage", langName.toLowerCase());
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-accent/20 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Choose Your Language
          </h1>
          <p className="text-2xl text-muted-foreground">
            Which language would you like to learn? 🌍
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {languages.map((language, index) => (
            <motion.div
              key={language.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                onClick={() => handleSelect(language.name)}
                className={`cursor-pointer p-8 text-center border-2 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${language.color} bg-opacity-10`}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                  className="text-8xl mb-4"
                >
                  {language.emoji}
                </motion.div>
                <h3 className="text-3xl font-bold">{language.name}</h3>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LanguageSelect;