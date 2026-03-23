import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

export interface MessageBubbleProps {
  content: string;
  role: "user" | "assistant";
  timestamp?: Date;
  isLoading?: boolean;
  variant?: "default" | "success" | "error";
  index?: number;
}

const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({
    content,
    role,
    timestamp,
    isLoading = false,
    variant = "default",
    index = 0,
  }, ref) => {
    const isUser = role === "user";

    // Container animations
    const containerVariants: Variants = {
      initial: { opacity: 0, y: 10, scale: 0.95 },
      animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.3,
          delay: index * 0.05,
          type: "spring",
          damping: 20,
          stiffness: 100,
        },
      },
      exit: {
        opacity: 0,
        y: -10,
        scale: 0.95,
        transition: { duration: 0.2 },
      },
    };

    // Text animation for assistant messages
    const textVariants: Variants = {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: 0.02,
          delayChildren: 0.1,
        },
      },
    };

    // Individual character animation
    const charVariants: Variants = {
      initial: { opacity: 0, y: 10 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.2 },
      },
    };

    // Get background colors based on role and variant
    const getBgColor = () => {
      if (isUser) {
        return "bg-gradient-to-br from-orange-500 to-pink-500";
      }

      switch (variant) {
        case "success":
          return "bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30";
        case "error":
          return "bg-red-500/10 border border-red-500/30";
        default:
          return "bg-muted/80 border border-muted-foreground/20";
      }
    };

    const getTextColor = () => {
      if (isUser) return "text-white";
      return "text-foreground";
    };

    const formatTime = (date?: Date) => {
      if (!date) return "";
      const time = new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      return time;
    };

    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
      >
        <div className={cn("flex flex-col gap-1 max-w-[85%] md:max-w-[70%]")}>
          {/* Message Bubble */}
          <motion.div
            className={cn(
              "rounded-2xl px-4 py-3 backdrop-blur-sm shadow-lg transition-all duration-200",
              isUser ? "rounded-br-none" : "rounded-bl-none",
              getBgColor(),
              isLoading && "opacity-75"
            )}
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {isLoading ? (
              // Loading indicator
              <div className="flex gap-2 items-center">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.1,
                      repeat: Infinity,
                    }}
                    className="w-2 h-2 rounded-full bg-muted-foreground"
                  />
                ))}
              </div>
            ) : (
              <motion.div
                variants={textVariants}
                initial="initial"
                animate="animate"
                className={cn("text-sm leading-relaxed break-words", getTextColor())}
              >
                {/* For improved readability, animated character-by-character for shorter messages */}
                {content.length < 100 ? (
                  content.split("").map((char, i) => (
                    <motion.span
                      key={`${i}`}
                      variants={charVariants}
                      className="inline"
                    >
                      {char}
                    </motion.span>
                  ))
                ) : (
                  <span>{content}</span>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Timestamp */}
          {timestamp && !isLoading && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={cn(
                "text-xs text-muted-foreground px-2",
                isUser ? "text-right" : "text-left"
              )}
            >
              {formatTime(timestamp)}
            </motion.span>
          )}
        </div>
      </motion.div>
    );
  }
);

MessageBubble.displayName = "MessageBubble";

export default MessageBubble;
