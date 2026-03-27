import apiFetch from "@/lib/api";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import pandaHappy from "@/assets/panda-happy.png";

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const name = fd.get("name") as string;
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;

    try {
      // 1. Create Account
      await apiFetch("/api/auth/signup", { 
        method: "POST", 
        json: { email, password, name } 
      });

      // 2. Auto-Login
      const loginData = await apiFetch("/api/auth/login", { 
        method: "POST", 
        json: { email, password } 
      });

      if (loginData?.token) {
        localStorage.setItem("token", loginData.token);
        // Redirect to Language Select first for new users
        navigate("/language-select");
      }
    } catch (err: any) {
      alert("Signup failed: " + (err.data?.error || "User already exists or server error"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/10 via-background to-primary/10 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="border-2 shadow-2xl">
          <CardHeader className="text-center">
            <img src={pandaHappy} className="w-24 h-24 mx-auto mb-4" alt="Happy Panda" />
            <CardTitle className="text-3xl font-bold">Join the Party! 🎉</CardTitle>
            <CardDescription>Start learning languages with your panda friend</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input name="name" placeholder="Panda Learner" required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input name="password" type="password" placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full h-12 text-lg bg-secondary hover:scale-105 transition-transform">
                Sign Up 🎋
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account? <Link to="/login" className="text-primary font-bold">Login</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;