import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Send, Plus, Trash2, Settings2, Brain, BookOpen, ArrowRight } from "lucide-react";

type TutorMode = "tutor" | "practice" | "grammar-check" | "vocabulary";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  _id: string;
  title: string;
  mode: TutorMode;
  topic: string;
  messages: ChatMessage[];
  createdAt: string;
}

const ChatTutor = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tutorMode, setTutorMode] = useState<TutorMode>("tutor");
  const [topic, setTopic] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentConversation?.messages]);

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(res.data.conversations || []);

      // Load the first conversation if available
      if (res.data.conversations?.length > 0 && !currentConversation) {
        loadConversation(res.data.conversations[0]._id);
      }
    } catch (err) {
      console.error("Error loading conversations:", err);
    }
  };

  const loadConversation = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/conversations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentConversation(res.data.conversation);
      setTutorMode(res.data.conversation.mode);
      setTopic(res.data.conversation.topic || "");
    } catch (err) {
      console.error("Error loading conversation:", err);
    }
  };

  const createNewConversation = async () => {
    try {
      const token = localStorage.getItem("token");
      const title =
        `${tutorMode.charAt(0).toUpperCase() + tutorMode.slice(1)}${topic ? ` - ${topic}` : ""}` ||
        `Chat ${new Date().toLocaleDateString()}`;

      const res = await axios.post(
        "/api/conversations",
        { title, mode: tutorMode, topic },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newConversation = res.data.conversation;
      setConversations((prev) => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      setShowNewChat(false);
      setMessage("");
    } catch (err) {
      console.error("Error creating conversation:", err);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || loading || !currentConversation) return;

    const userMessage = message;
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `/api/conversations/${currentConversation._id}/messages`,
        { content: userMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentConversation(res.data.conversation);

      // Update conversations list with latest
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === currentConversation._id ? res.data.conversation : conv
        )
      );
    } catch (err: any) {
      console.error("Error sending message:", err);

      // Add error message to chat
      if (currentConversation) {
        setCurrentConversation((prev) =>
          prev
            ? {
                ...prev,
                messages: [
                  ...prev.messages,
                  {
                    role: "assistant",
                    content:
                      "Sorry, I encountered an error. Please try again or check if the AI server is running.",
                    timestamp: new Date(),
                  },
                ],
              }
            : null
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/conversations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConversations((prev) => prev.filter((conv) => conv._id !== id));
      if (currentConversation?._id === id) {
        setCurrentConversation(null);
      }
    } catch (err) {
      console.error("Error deleting conversation:", err);
    }
  };

  const getModeIcon = (mode: TutorMode) => {
    switch (mode) {
      case "practice":
        return <BookOpen className="w-4 h-4" />;
      case "grammar-check":
        return <Settings2 className="w-4 h-4" />;
      case "vocabulary":
        return <Brain className="w-4 h-4" />;
      default:
        return <ArrowRight className="w-4 h-4" />;
    }
  };

  const modeLabels = {
    tutor: "Tutor",
    practice: "Practice",
    "grammar-check": "Grammar",
    vocabulary: "Vocabulary",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500/5 via-background to-purple-500/5 p-4 md:p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Conversation List */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col border-2 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Conversations
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden flex flex-col gap-3">
              <Button
                onClick={() => setShowNewChat(!showNewChat)}
                className="w-full gap-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </Button>

              <ScrollArea className="flex-1 rounded-lg border border-dashed">
                <div className="p-2 space-y-2">
                  <AnimatePresence>
                    {conversations.length === 0 ? (
                      <div className="text-center text-muted-foreground text-sm py-8">
                        No conversations yet
                      </div>
                    ) : (
                      conversations.map((conv, idx) => (
                        <motion.button
                          key={conv._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => loadConversation(conv._id)}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                            currentConversation?._id === conv._id
                              ? "bg-orange-500/20 border border-orange-500/50"
                              : "hover:bg-muted/50 border border-transparent"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {conv.title}
                              </p>
                              <div className="flex gap-1 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {getModeIcon(conv.mode)}
                                  {modeLabels[conv.mode]}
                                </Badge>
                              </div>
                            </div>
                            <button
                              onClick={(e) => deleteConversation(conv._id, e)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </motion.button>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          {showNewChat ? (
            // New Chat Setup
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="border-2 shadow-xl">
                <CardHeader>
                  <CardTitle>Start a New Learning Session</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold mb-3 block">
                      Choose Your Tutor Mode
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(["tutor", "practice", "grammar-check", "vocabulary"] as TutorMode[]).map(
                        (mode) => (
                          <motion.button
                            key={mode}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setTutorMode(mode)}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                              tutorMode === mode
                                ? "border-orange-500 bg-orange-500/10"
                                : "border-muted-foreground/20 hover:border-orange-300"
                            }`}
                          >
                            {getModeIcon(mode)}
                            <span className="text-sm font-medium capitalize">
                              {modeLabels[mode]}
                            </span>
                          </motion.button>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold mb-2 block">
                      Topic (Optional)
                    </label>
                    <Input
                      placeholder="e.g., Business English, Travel phrases..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="border-2"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={createNewConversation}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                    >
                      Start Learning
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowNewChat(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">🎯</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Personalized
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-500">⚡</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Interactive
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-500">📈</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Progress
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : currentConversation ? (
            // Chat View
            <Card className="border-2 shadow-xl h-full flex flex-col">
              <CardHeader className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getModeIcon(tutorMode)}
                      {currentConversation.title}
                    </CardTitle>
                    {currentConversation.topic && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Topic: {currentConversation.topic}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary" className="h-fit gap-2">
                    {getModeIcon(tutorMode)}
                    {modeLabels[tutorMode]}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-hidden flex flex-col">
                {/* Messages Area */}
                <ScrollArea
                  ref={scrollRef}
                  className="flex-1 pr-4 mb-4 rounded-lg border border-dashed"
                >
                  <div className="space-y-4 p-4">
                    {currentConversation.messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                          <div className="text-4xl mb-2">💬</div>
                          <p>Start your conversation!</p>
                          <p className="text-sm mt-1">
                            Ask a question or send a message to begin
                          </p>
                        </div>
                      </div>
                    ) : (
                      <AnimatePresence initial={false}>
                        {currentConversation.messages.map((msg, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${
                              msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                msg.role === "user"
                                  ? "bg-gradient-to-br from-orange-500 to-pink-500 text-white rounded-br-none"
                                  : "bg-muted/80 rounded-bl-none border border-muted-foreground/20"
                              }`}
                            >
                              <p className="text-sm leading-relaxed break-words">
                                {msg.content}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}

                    {loading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2 items-center"
                      >
                        <div className="bg-muted/80 rounded-2xl px-4 py-3">
                          <div className="flex gap-2">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{
                                  duration: 0.6,
                                  delay: i * 0.1,
                                  repeat: Infinity,
                                }}
                                className="w-2 h-2 rounded-full bg-muted-foreground"
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="flex gap-2 pt-4 border-t">
                  <Input
                    placeholder="Ask something or continue the conversation..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    disabled={loading}
                    className="border-2"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={loading || !message.trim()}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // No Conversation Selected
            <Card className="border-2 shadow-xl h-full flex items-center justify-center">
              <CardContent className="text-center space-y-4">
                <div className="text-6xl">🤖</div>
                <h3 className="text-xl font-semibold">Ready to Learn?</h3>
                <p className="text-muted-foreground max-w-sm">
                  Create a new chat session or select one from your conversation history
                </p>
                <Button
                  onClick={() => setShowNewChat(true)}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Start Your First Chat
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatTutor;
