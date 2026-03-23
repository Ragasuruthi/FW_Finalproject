import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion, Variants } from "framer-motion";
import { Flame, TrendingUp, Award, Clock } from "lucide-react";

interface ActivityChartProps {
  weeklyData?: Array<{
    day: string;
    value: number;
  }>;
  monthlyData?: Array<{
    date: string;
    xp: number;
    lessons: number;
  }>;
  streak?: number;
  totalXp?: number;
  lessonsCompleted?: number;
  currentStreak?: number;
}

const defaultWeeklyData = [
  { day: "Mon", value: 120 },
  { day: "Tue", value: 150 },
  { day: "Wed", value: 100 },
  { day: "Thu", value: 200 },
  { day: "Fri", value: 180 },
  { day: "Sat", value: 220 },
  { day: "Sun", value: 150 },
];

const defaultMonthlyData = [
  { date: "Week 1", xp: 500, lessons: 5 },
  { date: "Week 2", xp: 650, lessons: 6 },
  { date: "Week 3", xp: 580, lessons: 5 },
  { date: "Week 4", xp: 720, lessons: 7 },
  { date: "Week 5", xp: 690, lessons: 6 },
];

const ActivityChart = ({
  weeklyData = defaultWeeklyData,
  monthlyData = defaultMonthlyData,
  streak = 12,
  totalXp = 3140,
  lessonsCompleted = 29,
  currentStreak = 12,
}: ActivityChartProps) => {
  const chartConfig = {
    value: {
      label: "Activity",
      color: "hsl(var(--chart-1))",
      theme: {
        light: "#f97316",
        dark: "#fb923c",
      },
    },
    xp: {
      label: "XP Earned",
      color: "#8b5cf6",
      theme: {
        light: "#8b5cf6",
        dark: "#a78bfa",
      },
    },
    lessons: {
      label: "Lessons",
      color: "#06b6d4",
      theme: {
        light: "#06b6d4",
        dark: "#22d3ee",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    unit = "",
    trend,
    color,
  }: {
    icon: React.ElementType;
    label: string;
    value: number | string;
    unit?: string;
    trend?: number;
    color: string;
  }) => (
    <motion.div variants={itemVariants}>
      <Card className="border-2 shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-br from-background to-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <p className="text-3xl font-bold mt-2 flex items-baseline gap-1">
                {value}
                {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
              </p>
              {trend && (
                <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {trend}% increase
                </p>
              )}
            </div>
            <div className={`p-3 rounded-full ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      className="space-y-6 w-full"
      variants={containerVariants as Variants}
      initial="hidden"
      animate="visible"
    >
      {/* Stats Grid */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Flame}
          label="Current Streak"
          value={currentStreak}
          unit="days"
          color="bg-red-500/20"
        />
        <StatCard
          icon={TrendingUp}
          label="Total XP"
          value={totalXp.toLocaleString()}
          color="bg-orange-500/20"
          trend={15}
        />
        <StatCard
          icon={Award}
          label="Lessons Completed"
          value={lessonsCompleted}
          color="bg-purple-500/20"
        />
        <StatCard
          icon={Clock}
          label="This Week"
          value={weeklyData.reduce((a, b) => a + b.value, 0)}
          unit="min"
          color="bg-blue-500/20"
        />
      </motion.div>

      {/* Weekly Activity Chart */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Weekly Activity
            </CardTitle>
            <CardDescription>
              Your learning activity for the past 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-80">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "currentColor" }}
                  tickLine={{ stroke: "currentColor" }}
                />
                <YAxis
                  tick={{ fill: "currentColor" }}
                  tickLine={{ stroke: "currentColor" }}
                />
                <Tooltip
                  content={<ChartTooltipContent hideLabel />}
                  cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                />
                <Bar
                  dataKey="value"
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                  className="transition-all duration-200 hover:opacity-80"
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(from var(--color-value) h s l / 0.9)" />
                    <stop offset="100%" stopColor="hsl(from var(--color-value) h s l / 0.5)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Monthly Progress Chart */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Monthly Progress
            </CardTitle>
            <CardDescription>
              XP earned and lessons completed each week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-80">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "currentColor" }}
                  tickLine={{ stroke: "currentColor" }}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: "currentColor" }}
                  tickLine={{ stroke: "currentColor" }}
                  label={{ value: "XP", angle: -90, position: "insideLeft" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: "currentColor" }}
                  tickLine={{ stroke: "currentColor" }}
                  label={{ value: "Lessons", angle: 90, position: "insideRight" }}
                />
                <Tooltip
                  content={<ChartTooltipContent hideLabel />}
                  cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="xp"
                  stroke="var(--color-xp)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-xp)", r: 5 }}
                  activeDot={{ r: 7 }}
                  className="transition-all duration-200"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="lessons"
                  stroke="var(--color-lessons)"
                  strokeWidth={3}
                  dot={{ fill: "var(--color-lessons)", r: 5 }}
                  activeDot={{ r: 7 }}
                  className="transition-all duration-200"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements Section */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 shadow-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "🔥", title: "On Fire", desc: "7-day streak" },
                { icon: "⭐", title: "Rising Star", desc: "500 XP earned" },
                { icon: "🎯", title: "Goal Crusher", desc: "20 lessons" },
                { icon: "🏆", title: "Champion", desc: "50 XP in one day" },
              ].map((achievement, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-lg bg-background border border-muted-foreground/20 text-center hover:border-purple-500/50 transition-all"
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <p className="text-sm font-medium">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{achievement.desc}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ActivityChart;
