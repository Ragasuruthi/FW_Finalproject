import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import apiFetch from "@/lib/api"; // Unified API helper
import { Send, Plus, Trash2, Brain, Sparkles } from "lucide-react";

const ChatTutor = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    try {
      const res = await apiFetch("/api/conversations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Handle both { conversations: [] } and direct array responses
      setConversations(res.conversations || (Array.isArray(res) ? res : []));
    } catch (err) {
      console.error("Error loading conversations:", err);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages, loading]);

  const startNewChat = async () => {
    try {
      const lang = localStorage.getItem("selectedLanguage") || "english";
      const res = await apiFetch("/api/conversations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        json: { title: `Practice: ${lang}`, language: lang, mode: "tutor" },
      });
      const newConv = res.conversation || res;
      setConversations((prev) => [newConv, ...prev]);
      setCurrentConversation(newConv);
    } catch (err) {
      alert("Failed to start AI session");
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || loading || !currentConversation) return;
    const userMsg = message;
    setMessage("");
    setLoading(true);

    // Optimistic UI update
    const tempConversation = {
      ...currentConversation,
      messages: [
        ...currentConversation.messages,
        { role: "user", content: userMsg },
      ],
    };
    setCurrentConversation(tempConversation);

    try {
      const res = await apiFetch(
        `/api/conversations/${currentConversation._id}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          json: { content: userMsg },
        }
      );

      const updatedConversation = res.conversation || res;
      if (updatedConversation && updatedConversation.messages) {
        setCurrentConversation(updatedConversation);
        setConversations((prev) =>
          prev.map((c) =>
            c._id === updatedConversation._id ? updatedConversation : c
          )
        );
      } else {
        throw new Error("Invalid AI response");
      }
    } catch (err) {
      console.error("AI Error:", err);
      alert("Panda is having trouble connecting. Please try again!");
      setCurrentConversation(currentConversation);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[85vh] gap-4 p-4">
      {/* Sidebar */}
      <Card className="w-80 flex flex-col border-2 shadow-lg">
        <CardHeader className="border-b">
          <Button
            onClick={startNewChat}
            className="w-full gap-2 bg-gradient-to-r from-orange-500 to-pink-500"
          >
            <Plus className="w-4 h-4" /> New AI Chat
          </Button>
        </CardHeader>
        <ScrollArea className="flex-1 p-2">
          {conversations.map((c) => (
            <div
              key={c._id}
              onClick={() => setCurrentConversation(c)}
              className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors ${
                currentConversation?._id === c._id
                  ? "bg-primary text-white"
                  : "hover:bg-accent"
              }`}
            >
              <div className="font-medium truncate">{c.title}</div>
              <div className="text-xs opacity-70">
                {new Date(c.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </ScrollArea>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col border-2 shadow-lg relative">
        {currentConversation ? (
          <>
            <CardHeader className="border-b flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="text-primary" /> AI Learning Partner
              </CardTitle>
            </CardHeader>
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              {currentConversation.messages.map((m: any, i: number) => (
                <div
                  key={i}
                  className={`mb-4 flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      m.role === "user"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-muted rounded-tl-none border"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-muted-foreground italic text-sm">
                  Panda is thinking... 🐾
                </div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>
            <div className="p-4 border-t flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask me anything..."
              />
              <Button onClick={sendMessage} disabled={loading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <Sparkles className="w-16 h-16 text-primary/20 mb-4" />
            <h3 className="text-2xl font-bold">Pick a chat to start learning!</h3>
            <p className="text-muted-foreground">
              Your AI tutor is ready to help you master languages.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChatTutor;