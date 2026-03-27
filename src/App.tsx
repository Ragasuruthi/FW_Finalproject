import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LanguageSelect from "./pages/LanguageSelect";
import Dashboard from "./pages/Dashboard";
import Lesson from "./pages/Lesson";
import Lessons from "./pages/Lessons";
import NotFound from "./pages/NotFound";
import ChatTutor from "@/pages/ChatTutor";

// The Antigravity Component
const Antigravity = () => {
  useEffect(() => {
    // This redirects the user to the famous xkcd python comic
    window.location.href = "https://xkcd.com/353/";
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg font-medium italic animate-pulse">
        Importing antigravity... preparing for takeoff 🚀
      </p>
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/language-select" element={<LanguageSelect />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/chat" element={<ChatTutor />} />

          {/* Antigravity Easter Egg Route */}
          <Route path="/antigravity" element={<Antigravity />} />

          {/* 404 Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;