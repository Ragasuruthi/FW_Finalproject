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
  embedded?: boolean;
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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
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
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    
    setInputValue("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, timestamp: new Date() },
    ]);
    setLoading(true);

    try {
      let activeId = conversationId;

      // 1. Create a new conversation in DB if it doesn't exist yet
      if (!activeId) {
        const createRes = await axios.post(
          "/api/conversations",
          {
            title: userMessage.substring(0, 30) + "...",
            mode,
            topic: topic || "General",
          },
          { headers }
        );
        activeId = createRes.data.conversation._id;
        setConversationId(activeId);
      }

      // 2. Send message to the specific conversation ID route
      const res = await axios.post(
        `/api/conversations/${activeId}/messages`,
        { content: userMessage },
        { headers }
      );

      // 3. Update UI with the AI reply from the backend
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.data.message.content,
          timestamp: new Date(),
        },
      ]);
    } catch (err: any) {
      console.error("Chat Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting to the server. Please check your login status.",
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

  const renderContent = () => (
    <>
      <ScrollArea ref={scrollRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Start your first lesson!</p>
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
            placeholder="Ask a question..."
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
            className="bg-gradient-to-r from-orange-500 to-pink-500"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );

  if (embedded) {
    return (
      <div className="w-full h-full flex flex-col bg-background rounded-lg border-2 shadow-xl">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">AI Learning Assistant</h3>
        </div>
        {renderContent()}
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            className={`fixed ${positionClasses[position]} z-40 w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg flex items-center justify-center text-white`}
            onClick={() => setOpen(true)}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={`fixed ${positionClasses[position]} w-96 max-h-[600px] z-50 rounded-2xl shadow-2xl border-2 bg-background flex flex-col overflow-hidden`}
          >
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-4 flex justify-between items-center">
              <span className="font-semibold">AI Tutor ({mode})</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setMinimized(!minimized)}>
                   {minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setOpen(false); onClose?.(); }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {!minimized && renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbox;