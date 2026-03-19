import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import pandaHappy from "@/assets/panda-happy.png";
import { logout } from "@/lib/auth";

const Dashboard = () => {
  const navigate = useNavigate();

  const fallbackStats = {
    xp: 1250,
    level: 5,
    streak: 7,
    lessons: 24,
  };

  // Fetch dynamic user stats
  const { data: statsData } = useQuery({
    queryKey: ["user-stats"],
    queryFn: () => apiFetch("/api/user/stats"),
  });

  const lessonsCompleted = statsData?.lessonsCompleted ?? fallbackStats.lessons;
  const xp = statsData?.xp ?? fallbackStats.xp;
  const level = statsData?.level ?? fallbackStats.level;
  const streak = statsData?.streak ?? fallbackStats.streak;

  // Level Progress Logic
  const xpForNextLevel = level * 500;
  const progressToNextLevel = Math.min((xp / xpForNextLevel) * 100, 100);

  const badges = [
    { name: "Week Warrior", emoji: "🔥", earned: true },
    { name: "Fast Learner", emoji: "⚡", earned: true },
    { name: "Word Master", emoji: "📚", earned: false },
    { name: "Perfect Week", emoji: "💯", earned: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-8 text-white">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome 🎉</h1>
            <p className="text-xl text-gray-300">Ready to level up today?</p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={async () => {
                await logout();
                navigate("/");
              }}
              className="text-sm text-white hover:bg-white/10"
            >
              Logout
            </Button>

            <motion.img
              src={pandaHappy}
              alt="Happy panda"
              className="w-20 h-20 object-contain"
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "XP Points", value: xp, emoji: "⭐" },
            { label: "Level", value: level, emoji: "🎯" },
            { label: "Day Streak", value: streak, emoji: "🔥" },
            { label: "Lessons", value: lessonsCompleted, emoji: "📚" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center border-0 bg-white/10 backdrop-blur-lg shadow-xl hover:scale-105 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-2">{stat.emoji}</div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Level Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="border-0 bg-white/10 backdrop-blur-lg shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                Level Progress 🚀
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* XP Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span>
                    Level {level} → Level {level + 1}
                  </span>
                  <span className="text-gray-300">
                    {xp} / {xpForNextLevel} XP
                  </span>
                </div>
                <Progress value={progressToNextLevel} className="h-4" />
              </div>

              {/* Streak Banner */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-xl text-center shadow-lg font-semibold">
                🔥 {streak} Day Streak! Don’t break it today!
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-4">
                <Link to="/lessons">
                  <Button className="w-full h-14 text-lg bg-gradient-to-r from-primary to-accent hover:scale-105 transition-all duration-300">
                    Continue Learning 🚀
                  </Button>
                </Link>

                <Link to="/chat">
                  <Button
                    variant="outline"
                    className="w-full h-14 text-lg hover:scale-105 transition-all duration-300 text-white border-white"
                  >
                    Talk to AI Tutor 🤖
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 bg-white/10 backdrop-blur-lg shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                Your Badges 🏆
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <motion.div
                    key={badge.name}
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-2xl text-center border-2 ${
                      badge.earned
                        ? "bg-white/20 border-white"
                        : "bg-gray-700 border-gray-600 opacity-50"
                    }`}
                  >
                    <div className="text-4xl mb-2">{badge.emoji}</div>
                    <div className="font-medium text-sm">{badge.name}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="border-0 bg-white/10 backdrop-blur-lg shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white">
                AI Suggestions 🤖
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-white/20 rounded-xl">
                📘 Revise Vocabulary Lesson 3
              </div>
              <div className="p-4 bg-white/20 rounded-xl">
                🧪 Take Pronunciation Quiz
              </div>
              <div className="p-4 bg-white/20 rounded-xl">
                🎤 Practice Speaking with AI Tutor
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;