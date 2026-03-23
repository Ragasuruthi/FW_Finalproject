import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Minimize2, Maximize2 } from "lucide-react";
import MessageBubble from "./Messagebubble";
import axios from "axios";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatboxProps {
  isOpen?: boolean;
  onClose?: () => void;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  mode?: "tutor" | "practice" | "grammar-check" | "vocabulary";
  topic?: string;
  embedded?: boolean; // If true, renders as full-width embedded component
}

const Chatbox = ({
  isOpen = false,
  onClose,
  position = "bottom-right",
  mode = "tutor",
  topic = "",
  embedded = false,
}: ChatboxProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(isOpen);
  const [minimized, setMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current && open && !minimized) {
      const scrollTimer = setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
      return () => clearTimeout(scrollTimer);
    }
  }, [messages, open, minimized]);

  const sendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue;
    setInputValue("");

    // Add user message
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, timestamp: new Date() },
    ]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/ai-tutor",
        {
          message: userMessage,
          mode,
          topic,
          conversationHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.reply,
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error. Please try again or refresh the page.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };

  if (embedded) {
    return (
      <div className="w-full h-full flex flex-col bg-background rounded-lg border-2 shadow-xl">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="font-semibold">AI Learning Assistant</h3>
            <p className="text-xs text-muted-foreground">{mode}</p>
          </div>
        </div>

        <ScrollArea
          ref={scrollRef}
          className="flex-1 p-4 space-y-4"
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Start a conversation</p>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <MessageBubble
                key={idx}
                role={msg.role}
                content={msg.content}
                timestamp={msg.timestamp}
                index={idx}
              />
            ))
          )}
          {loading && <MessageBubble role="assistant" content="" isLoading index={messages.length} />}
        </ScrollArea>

        <div className="p-4 border-t space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={loading}
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !inputValue.trim()}
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`fixed ${positionClasses[position]} z-40`}
            onClick={() => setOpen(true)}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed ${positionClasses[position]} w-96 max-h-[600px] z-50 rounded-2xl shadow-2xl border-2 border-border bg-background overflow-hidden flex flex-col`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">AI Tutor</h3>
                <p className="text-xs opacity-90 capitalize">{mode}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMinimized(!minimized)}
                  className="hover:bg-white/20 text-white"
                >
                  {minimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setOpen(false);
                    onClose?.();
                  }}
                  className="hover:bg-white/20 text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            {!minimized && (
              <>
                <ScrollArea
                  ref={scrollRef}
                  className="flex-1 p-4 space-y-4 overflow-y-auto"
                >
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-muted-foreground">
                        <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Start learning today!</p>
                        <p className="text-xs mt-1">Ask me anything</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <MessageBubble
                        key={idx}
                        role={msg.role}
                        content={msg.content}
                        timestamp={msg.timestamp}
                        index={idx}
                      />
                    ))
                  )}
                  {loading && (
                    <MessageBubble role="assistant" content="" isLoading index={messages.length} />
                  )}
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask something..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      disabled={loading}
                      className="text-sm h-9"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={loading || !inputValue.trim()}
                      size="sm"
                      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbox;
