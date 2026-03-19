import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import axios from "axios";

type ChatMessage = {
  sender: "You" | "AI";
  text: string;
};

const ChatTutor = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userText = message;
    setMessage("");

    // Add user message
    setChat((prev) => [...prev, { sender: "You", text: userText }]);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/ai-tutor", {
        message: userText,
      });

      setChat((prev) => [
        ...prev,
        { sender: "AI", text: res.data.reply },
      ]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { sender: "AI", text: "❌ Server not responding" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 to-background p-6">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-xl border-2">
          <CardHeader>
            <CardTitle className="text-2xl">🤖 AI Language Tutor</CardTitle>
            <p className="text-muted-foreground">
              Chat naturally and improve your English
            </p>
          </CardHeader>

          <CardContent>
            <div className="h-80 overflow-y-auto border rounded-lg p-4 mb-4 space-y-3">
              {chat.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-xl max-w-[80%] ${
                    msg.sender === "You"
                      ? "ml-auto bg-primary text-white"
                      : "bg-muted"
                  }`}
                >
                  <strong>{msg.sender}:</strong> {msg.text}
                </motion.div>
              ))}

              {loading && (
                <div className="bg-muted p-3 rounded-xl w-fit">
                  🤖 Typing...
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button onClick={sendMessage} disabled={loading}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatTutor;
