import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import pandaHappy from "@/assets/panda-happy.png";

const Dashboard = () => {
  const stats = {
    xp: 1250,
    level: 5,
    streak: 7,
    lessons: 24,
  };

  const badges = [
    { name: "Week Warrior", emoji: "🔥", earned: true },
    { name: "Fast Learner", emoji: "⚡", earned: true },
    { name: "Word Master", emoji: "📚", earned: false },
    { name: "Perfect Week", emoji: "💯", earned: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back! 🎉</h1>
            <p className="text-xl text-muted-foreground">Ready to continue learning?</p>
          </div>
          <motion.img
            src={pandaHappy}
            alt="Happy panda"
            className="w-20 h-20 object-contain"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "XP Points", value: stats.xp, emoji: "⭐" },
            { label: "Level", value: stats.level, emoji: "🎯" },
            { label: "Day Streak", value: stats.streak, emoji: "🔥" },
            { label: "Lessons", value: stats.lessons, emoji: "📚" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center border-2 shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-4xl mb-2">{stat.emoji}</div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Today's Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Daily Goal</span>
                    <span className="text-muted-foreground">75%</span>
                  </div>
                  <Progress value={75} className="h-3" />
                </div>
                <Link to="/lesson">
                  <Button className="w-full h-14 text-lg bg-gradient-to-r from-primary to-accent hover:scale-105 transition-transform">
                    Continue Learning 🚀
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
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Your Badges 🏆</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.name}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`p-4 rounded-2xl text-center border-2 ${
                      badge.earned
                        ? "bg-primary/10 border-primary"
                        : "bg-muted/50 border-border opacity-50"
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
      </div>
    </div>
  );
};

export default Dashboard;
