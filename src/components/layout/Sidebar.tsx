import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  BookOpen,
  MessageCircle,
  Zap,
  Settings,
  LogOut,
  Menu,
  X,
  Flame,
  Trophy,
  BarChart3,
  User,
  ChevronDown,
} from "lucide-react";
import axios from "axios";

interface SidebarProps {
  userStats?: {
    xp: number;
    level: number;
    streak: number;
    lessonsCompleted: number;
  };
  userName?: string;
  onLogout?: () => void;
}

const Sidebar = ({
  userStats = {
    xp: 1250,
    level: 2,
    streak: 12,
    lessonsCompleted: 5,
  },
  userName = "Learner",
  onLogout,
}: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const location = useLocation();

  const navItems = [
    {
      label: "Home",
      icon: Home,
      path: "/",
      badge: null,
    },
    {
      label: "Lessons",
      icon: BookOpen,
      path: "/lessons",
      badge: userStats.lessonsCompleted,
    },
    {
      label: "AI Tutor",
      icon: MessageCircle,
      path: "/chat-tutor",
      badge: null,
    },
    {
      label: "Dashboard",
      icon: BarChart3,
      path: "/dashboard",
      badge: null,
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/settings",
      badge: null,
    },
  ];

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      onLogout?.();
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
    },
    closed: {
      x: -320,
      opacity: 0,
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{
          scale: 1.15,
          rotate: 5,
          boxShadow: "0 0 20px rgba(34, 197, 94, 0.4)"
        }}
        whileTap={{ scale: 0.9, rotate: -5 }}
        animate={{
          boxShadow: isOpen ? "0 0 25px rgba(34, 197, 94, 0.6)" : "0 0 10px rgba(255, 255, 255, 0.2)"
        }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 rounded-xl bg-gradient-to-br from-black to-gray-800 text-white shadow-lg border-2 border-white/30 backdrop-blur-sm"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.div>
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-black via-gray-900 to-black border-r-2 border-white/20 shadow-2xl z-40 flex flex-col overflow-hidden lg:static lg:translate-x-0 backdrop-blur-md"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(31,41,55,0.95) 50%, rgba(0,0,0,0.95) 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Header */}
        <motion.div
          className="p-6 border-b-2 border-white/20 bg-gradient-to-r from-gray-800 to-black relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Animated background pattern */}
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(239, 68, 68, 0.3) 0%, transparent 50%)',
              backgroundSize: '50px 50px'
            }}
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="flex items-center gap-3 mb-6 relative z-10"
          >
            <motion.div
              className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-gray-200 flex items-center justify-center text-black font-bold border-2 border-white shadow-lg"
              whileHover={{
                scale: 1.1,
                rotate: 5,
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)"
              }}
              animate={{
                boxShadow: ["0 0 10px rgba(255, 255, 255, 0.2)", "0 0 20px rgba(255, 255, 255, 0.4)", "0 0 10px rgba(255, 255, 255, 0.2)"]
              }}
              transition={{
                boxShadow: { duration: 3, repeat: Infinity }
              }}
            >
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {userName.charAt(0).toUpperCase()}
              </motion.span>
            </motion.div>
            <div className="flex-1 min-w-0">
              <motion.p
                className="font-semibold truncate text-white text-lg"
                animate={{ textShadow: ["0 0 5px rgba(255,255,255,0.3)", "0 0 10px rgba(255,255,255,0.6)", "0 0 5px rgba(255,255,255,0.3)"] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {userName}
              </motion.p>
              <motion.p
                className="text-xs text-gray-300"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Level {userStats.level}
              </motion.p>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            className="grid grid-cols-2 gap-3 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="bg-green-600/20 rounded-xl p-3 border border-green-500/40 backdrop-blur-sm relative overflow-hidden"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(34, 197, 94, 0.4)"
              }}
              animate={{
                boxShadow: ["0 0 10px rgba(34, 197, 94, 0.2)", "0 0 20px rgba(34, 197, 94, 0.4)", "0 0 10px rgba(34, 197, 94, 0.2)"]
              }}
              transition={{
                boxShadow: { duration: 3, repeat: Infinity }
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-xs text-green-300 font-medium">XP</p>
              <motion.p
                className="font-bold text-lg text-green-400"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {userStats.xp.toLocaleString()}
              </motion.p>
            </motion.div>

            <motion.div
              className="bg-red-600/20 rounded-xl p-3 border border-red-500/40 flex items-center gap-2 backdrop-blur-sm relative overflow-hidden"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 25px rgba(239, 68, 68, 0.4)"
              }}
              animate={{
                boxShadow: ["0 0 10px rgba(239, 68, 68, 0.2)", "0 0 20px rgba(239, 68, 68, 0.4)", "0 0 10px rgba(239, 68, 68, 0.2)"]
              }}
              transition={{
                boxShadow: { duration: 2.5, repeat: Infinity }
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="w-5 h-5 text-red-400" />
              </motion.div>
              <div>
                <p className="text-xs text-red-300 font-medium">Streak</p>
                <motion.p
                  className="font-bold text-lg text-red-400"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {userStats.streak}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto space-y-2">
          <AnimatePresence>
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <motion.div
                  key={item.path}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link to={item.path} onClick={() => setIsOpen(false)}>
                    <motion.div
                      whileHover={{
                        x: 8,
                        scale: 1.02,
                        boxShadow: active
                          ? "0 0 30px rgba(34, 197, 94, 0.5)"
                          : "0 0 20px rgba(255, 255, 255, 0.2)"
                      }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                        active
                          ? "bg-gradient-to-r from-green-600/30 to-green-500/30 border-2 border-green-400/50 shadow-lg shadow-green-500/20"
                          : "hover:bg-white/10 border-2 border-transparent hover:border-white/20"
                      }`}
                    >
                      {/* Animated background for active state */}
                      {active && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-400/20"
                          animate={{
                            backgroundPosition: ['0% 50%', '100% 50%'],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: 'reverse',
                          }}
                          style={{
                            backgroundSize: '200% 200%'
                          }}
                        />
                      )}

                      <motion.div
                        animate={active ? {
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        } : {}}
                        transition={{ duration: 2, repeat: active ? Infinity : 0 }}
                      >
                        <Icon className={`w-6 h-6 ${active ? "text-green-400" : "text-gray-300"}`} />
                      </motion.div>

                      <span className="flex-1 font-medium text-white text-base">{item.label}</span>

                      {item.badge && (
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            boxShadow: ["0 0 5px rgba(34, 197, 94, 0.3)", "0 0 15px rgba(34, 197, 94, 0.6)", "0 0 5px rgba(34, 197, 94, 0.3)"]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Badge variant="secondary" className="bg-green-600/40 text-green-200 border border-green-500/50 px-2 py-1 text-sm font-bold">
                            {item.badge}
                          </Badge>
                        </motion.div>
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Quick Links Section */}
          <motion.div
            className="pt-4 mt-4 border-t-2 border-white/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: navItems.length * 0.05 + 0.3 }}
          >
            <motion.p
              className="text-xs font-semibold text-gray-300 px-4 mb-3 uppercase tracking-wider"
              animate={{ textShadow: ["0 0 3px rgba(255,255,255,0.3)", "0 0 6px rgba(255,255,255,0.6)", "0 0 3px rgba(255,255,255,0.3)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Quick Access
            </motion.p>
            <div className="space-y-2">
              {[
                { label: "Profile", icon: User },
                { label: "Achievements", icon: Trophy },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.label}
                    whileHover={{
                      x: 8,
                      scale: 1.03,
                      boxShadow: "0 0 15px rgba(34, 197, 94, 0.3)"
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-white/10 transition-all duration-300 text-sm group border border-transparent hover:border-white/20 relative overflow-hidden"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.05 + 0.4 + idx * 0.1 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 group-hover:opacity-100"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Icon className="w-5 h-5 group-hover:text-green-400 transition-colors text-gray-400 relative z-10" />
                    </motion.div>
                    <span className="text-white relative z-10 font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </nav>

        {/* Footer */}
        <motion.div
          className="p-4 border-t-2 border-white/20 space-y-3 bg-gradient-to-r from-gray-800 to-black relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Animated footer background */}
          <motion.div
            className="absolute inset-0 opacity-5"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.4) 0%, transparent 70%)',
              backgroundSize: '100px 100px'
            }}
          />

          <motion.div
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 20px rgba(239, 68, 68, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
            className="relative z-10"
          >
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full border-2 border-red-500/50 hover:bg-red-600/20 hover:border-red-400 text-red-300 hover:text-red-200 gap-2 bg-black/50 backdrop-blur-sm transition-all duration-300"
            >
              <motion.div
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <LogOut className="w-5 h-5" />
              </motion.div>
              <span className="font-medium">Logout</span>
            </Button>
          </motion.div>

          <motion.p
            className="text-xs text-center text-gray-400 relative z-10"
            animate={{
              textShadow: ["0 0 3px rgba(255,255,255,0.2)", "0 0 6px rgba(255,255,255,0.4)", "0 0 3px rgba(255,255,255,0.2)"]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🐼 <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              PandaLingo
            </motion.span> • Keep Learning! 🐼
          </motion.p>
        </motion.div>
      </motion.aside>

      {/* Content Spacer for Desktop */}
      <div className="hidden lg:block w-72" />
    </>
  );
};

export default Sidebar;
