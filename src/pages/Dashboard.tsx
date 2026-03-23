import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import pandaHappy from "@/assets/panda-happy.png";
import { logout } from "@/lib/auth";
import {
  Sparkles,
  Trophy,
  Star,
  Flame,
  BookOpen,
  Bot,
  Leaf,
  Heart,
  ArrowRight,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const fallbackStats = {
    xp: 1250,
    level: 5,
    streak: 7,
    lessons: 24,
  };

  const { data: statsData } = useQuery({
    queryKey: ["user-stats"],
    queryFn: () => apiFetch("/api/user/stats"),
  });

  const lessonsCompleted = statsData?.lessonsCompleted ?? fallbackStats.lessons;
  const xp = statsData?.xp ?? fallbackStats.xp;
  const level = statsData?.level ?? fallbackStats.level;
  const streak = statsData?.streak ?? fallbackStats.streak;

  const xpForNextLevel = level * 500;
  const progressToNextLevel = Math.min((xp / xpForNextLevel) * 100, 100);

  const badges = [
    { name: "Week Warrior", emoji: "🔥", earned: true, color: "from-yellow-400 to-pink-500" },
    { name: "Fast Learner", emoji: "⚡", earned: true, color: "from-blue-400 to-cyan-500" },
    { name: "Word Master", emoji: "📚", earned: false, color: "from-slate-300 to-slate-400" },
    { name: "Perfect Week", emoji: "💯", earned: false, color: "from-slate-300 to-slate-400" },
  ];

  const suggestions = [
    {
      title: "Revise Vocabulary Lesson 3",
      icon: "📘",
      description: "Strengthen your vocabulary with a quick panda review.",
      link: "/lessons",
      bg: "from-blue-400 to-cyan-500",
    },
    {
      title: "Take Pronunciation Quiz",
      icon: "🧪",
      description: "Sharpen your speaking with bright bamboo energy.",
      link: "/lessons",
      bg: "from-green-400 to-emerald-500",
    },
    {
      title: "Practice Speaking with AI Tutor",
      icon: "🎤",
      description: "Talk with your panda AI tutor and level up fast.",
      link: "/chat",
      bg: "from-pink-400 to-rose-500",
    },
  ];

  const stats = [
    {
      label: "XP Points",
      value: xp,
      emoji: "⭐",
      icon: <Star className="w-5 h-5 text-white" />,
      bg: "from-yellow-400 to-amber-500",
    },
    {
      label: "Level",
      value: level,
      emoji: "🎯",
      icon: <Sparkles className="w-5 h-5 text-white" />,
      bg: "from-blue-500 to-cyan-500",
    },
    {
      label: "Day Streak",
      value: streak,
      emoji: "🔥",
      icon: <Flame className="w-5 h-5 text-white" />,
      bg: "from-pink-500 to-rose-500",
    },
    {
      label: "Lessons",
      value: lessonsCompleted,
      emoji: "📚",
      icon: <BookOpen className="w-5 h-5 text-white" />,
      bg: "from-green-500 to-emerald-600",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-[#f0fff7] to-[#eef8ff] text-slate-900 px-4 py-8 md:px-8">
      {/* Panda color blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-pink-300/30 blur-3xl"
          animate={{ x: [0, 25, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-20 right-10 w-80 h-80 rounded-full bg-blue-300/25 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 left-1/4 w-80 h-80 rounded-full bg-green-300/25 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-yellow-300/25 blur-3xl"
          animate={{ x: [0, -15, 0], y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </div>

      {/* Floating panda decorations */}
      <motion.div
        className="absolute top-16 left-8 text-4xl opacity-20 hidden md:block"
        animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🐼
      </motion.div>

      <motion.div
        className="absolute top-32 right-12 text-4xl opacity-20 hidden md:block"
        animate={{ y: [0, 10, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        🎋
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-16 text-3xl opacity-20 hidden md:block"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        ✨
      </motion.div>

      <div className="relative z-10 container mx-auto max-w-7xl">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-6 rounded-[30px] border-2 border-slate-200 bg-white p-6 shadow-[0_15px_50px_rgba(0,0,0,0.08)] md:flex-row md:items-center md:justify-between"
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="relative"
              animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="absolute inset-0 rounded-full bg-green-200 blur-xl scale-110" />
              <img
                src={pandaHappy}
                alt="Happy panda"
                className="relative w-20 h-20 md:w-24 md:h-24 object-contain rounded-full bg-white p-1 border-4 border-slate-900 shadow-xl"
              />
            </motion.div>

            <div>
              <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-slate-900 via-green-600 to-pink-500 bg-clip-text text-transparent">
                Panda Learning Den 🐼
              </h1>
              <p className="text-sm md:text-lg text-slate-600 mt-1">
                Welcome back! Ready to learn with bamboo power today?
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 rounded-full bg-green-500 px-3 py-1 text-xs md:text-sm text-white font-semibold shadow-lg"
                >
                  <Leaf className="w-4 h-4" />
                  Panda Mode Active
                </motion.span>

                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-3 py-1 text-xs md:text-sm text-white font-semibold shadow-lg"
                >
                  <Heart className="w-4 h-4" />
                  Learning Streak Strong
                </motion.span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-3">
            <Button
              variant="ghost"
              onClick={async () => {
                await logout();
                navigate("/");
              }}
              className="text-slate-800 border-2 border-slate-300 bg-white hover:bg-slate-100 rounded-xl font-semibold"
            >
              Logout
            </Button>

            <motion.div
              whileHover={{ scale: 1.03 }}
              className="rounded-2xl bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 px-4 py-3 text-sm text-white font-bold shadow-xl"
            >
              Daily Panda Tip: Small lessons every day = BIG progress ✨
            </motion.div>
          </div>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -10, scale: 1.04, rotate: 1 }}
            >
              <Card className={`overflow-hidden border-0 rounded-[26px] bg-gradient-to-br ${stat.bg} shadow-2xl`}>
                <CardContent className="pt-6 pb-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      className="text-4xl"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {stat.emoji}
                    </motion.div>
                    <div className="rounded-full bg-white/20 p-2 backdrop-blur-md">
                      {stat.icon}
                    </div>
                  </div>

                  <div className="text-3xl md:text-4xl font-black mb-1">{stat.value}</div>
                  <div className="text-white/90 font-medium">{stat.label}</div>

                  <div className="mt-4 h-2 rounded-full bg-white/25 overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 1.2, delay: index * 0.15 }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="xl:col-span-2 space-y-8">
            {/* LEVEL PROGRESS */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="rounded-[30px] border-2 border-slate-200 bg-white shadow-2xl overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-green-500 via-blue-500 via-pink-500 to-yellow-400" />

                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl text-slate-900 flex items-center gap-2 font-black">
                    <Sparkles className="w-6 h-6 text-pink-500" />
                    Panda Level Progress
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="rounded-2xl bg-slate-50 p-5 border-2 border-slate-100">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                      <span className="font-semibold text-slate-800">
                        Level {level} → Level {level + 1}
                      </span>
                      <span className="text-sm text-slate-500">
                        {xp} / {xpForNextLevel} XP
                      </span>
                    </div>

                    <div className="relative">
                      <Progress value={progressToNextLevel} className="h-5 rounded-full" />
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 text-xl"
                        style={{ left: `calc(${Math.min(progressToNextLevel, 95)}% - 10px)` }}
                        animate={{ y: [0, -5, 0], rotate: [-4, 4, -4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        🐼
                      </motion.div>
                    </div>

                    <p className="mt-3 text-sm text-green-700 font-medium">
                      Your panda is climbing to the next bamboo level 🌿
                    </p>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    animate={{
                      boxShadow: [
                        "0 0 0 rgba(0,0,0,0)",
                        "0 0 25px rgba(236,72,153,0.25)",
                        "0 0 0 rgba(0,0,0,0)",
                      ],
                    }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                    className="rounded-2xl bg-gradient-to-r from-pink-500 via-blue-500 to-green-500 p-5 text-center shadow-xl text-white"
                  >
                    <div className="text-xl md:text-2xl font-black">🔥 {streak} Day Streak!</div>
                    <p className="text-white/90 mt-1">Don’t let your panda lose momentum today!</p>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/lessons">
                      <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                        <Button className="w-full h-16 text-lg rounded-2xl font-black bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-xl text-white border-0">
                          Continue Learning 🚀
                        </Button>
                      </motion.div>
                    </Link>

                    <Link to="/chat">
                      <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                        <Button className="w-full h-16 text-lg rounded-2xl font-black bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 shadow-xl text-white border-0">
                          Talk to Panda AI Tutor 🤖
                        </Button>
                      </motion.div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI SUGGESTIONS */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Card className="rounded-[30px] border-2 border-slate-200 bg-white shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl text-slate-900 flex items-center gap-2 font-black">
                    <Bot className="w-6 h-6 text-blue-500" />
                    Panda AI Suggestions
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {suggestions.map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      whileHover={{ scale: 1.03, x: 6 }}
                    >
                      <Link to={item.link}>
                        <div className={`group rounded-2xl bg-gradient-to-r ${item.bg} p-4 transition-all duration-300 cursor-pointer shadow-xl`}>
                          <div className="flex items-start gap-4">
                            <motion.div
                              className="text-3xl"
                              animate={{ rotate: [0, 5, 0] }}
                              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            >
                              {item.icon}
                            </motion.div>

                            <div className="flex-1">
                              <h3 className="font-black text-white text-lg">{item.title}</h3>
                              <p className="text-sm text-white/90 mt-1">{item.description}</p>
                            </div>

                            <ArrowRight className="w-5 h-5 text-white/80 mt-1" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">
            {/* PANDA BUDDY */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <Card className="rounded-[30px] border-0 bg-gradient-to-br from-slate-900 via-green-600 to-blue-500 shadow-2xl overflow-hidden">
                <CardContent className="p-6 text-center text-white">
                  <motion.div
                    className="relative inline-block"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <motion.img
                      src={pandaHappy}
                      alt="Panda companion"
                      className="w-28 h-28 mx-auto object-contain rounded-full bg-white p-2 shadow-2xl border-4 border-yellow-300"
                      animate={{ rotate: [-4, 4, -4] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                  </motion.div>

                  <h3 className="text-2xl font-black mt-4">Your Panda Buddy</h3>
                  <p className="text-white/90 mt-2 text-sm">
                    “Keep going! Bright learners win every day!” 🐼
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="rounded-2xl bg-white/15 p-3 backdrop-blur-md border border-white/10"
                    >
                      <p className="text-xs text-white/80">Mood</p>
                      <p className="font-black text-white">Happy</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="rounded-2xl bg-pink-500/30 p-3 backdrop-blur-md border border-pink-300/20"
                    >
                      <p className="text-xs text-white/80">Energy</p>
                      <p className="font-black text-white">Bamboo Boost</p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* BADGES */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <Card className="rounded-[30px] border-2 border-slate-200 bg-white shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-900 flex items-center gap-2 font-black">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    Panda Badges
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {badges.map((badge, i) => (
                      <motion.div
                        key={badge.name}
                        whileHover={{ scale: 1.08, rotate: 2 }}
                        whileTap={{ scale: 0.97 }}
                        animate={badge.earned ? { y: [0, -4, 0] } : {}}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        className={`rounded-2xl p-4 text-center border-2 ${
                          badge.earned
                            ? "bg-slate-50 border-slate-100"
                            : "bg-slate-100 border-slate-200 opacity-70"
                        }`}
                      >
                        <div
                          className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${badge.color} text-2xl shadow-xl`}
                        >
                          {badge.emoji}
                        </div>
                        <div className="font-bold text-sm text-slate-900">{badge.name}</div>
                        <div className="text-xs mt-1 text-slate-500">
                          {badge.earned ? "Unlocked" : "Locked"}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* QUICK ACTIONS */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <Card className="rounded-[30px] border-2 border-slate-200 bg-white shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900 font-black">Quick Bamboo Actions 🎋</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <Link to="/lessons">
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg">
                        Open Lessons
                      </Button>
                    </motion.div>
                  </Link>

                  <Link to="/chat">
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white border-0 shadow-lg">
                        Open AI Tutor
                      </Button>
                    </motion.div>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;