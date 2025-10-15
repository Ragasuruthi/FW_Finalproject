import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FloatingElements from "@/components/FloatingElements";
import pandaMascot from "@/assets/panda-mascot.png";

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <FloatingElements />
      
      <div className="container relative z-10 mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Animated Panda Mascot */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [-3, 3, -3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mx-auto mb-8 w-64 h-64"
          >
            <img
              src={pandaMascot}
              alt="PandaLingo Mascot"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-4 text-6xl font-bold tracking-tight"
          >
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              PandaLingo
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-12 text-3xl font-medium text-muted-foreground"
          >
            Learn Languages the Fun Way! 🎉
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/language-select">
              <Button
                size="lg"
                className="text-xl px-8 py-6 bg-gradient-to-r from-primary to-accent hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl"
              >
                🚀 Start Learning
              </Button>
            </Link>

            <Link to="/signup">
              <Button
                size="lg"
                variant="outline"
                className="text-xl px-8 py-6 border-2 hover:scale-110 transition-transform duration-300"
              >
                📝 Sign Up Free
              </Button>
            </Link>

            <Link to="/login">
              <Button
                size="lg"
                variant="secondary"
                className="text-xl px-8 py-6 hover:scale-110 transition-transform duration-300"
              >
                🔐 Login
              </Button>
            </Link>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { emoji: "🎮", title: "Gamified Learning", desc: "Level up while learning!" },
              { emoji: "🐼", title: "Cute Mascot", desc: "Learn with our friendly panda" },
              { emoji: "⭐", title: "Fun Challenges", desc: "Master languages through play" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="bg-card rounded-3xl p-8 shadow-lg border-2 border-border"
              >
                <div className="text-5xl mb-4">{feature.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
