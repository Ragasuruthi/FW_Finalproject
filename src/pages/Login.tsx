import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import apiFetch from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import pandaMascot from "@/assets/panda-mascot.png";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;

    try {
      const data = await apiFetch("/api/auth/login", { 
        method: "POST", 
        json: { email, password } 
      });
      
      if (data?.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      }
    } catch (err: any) {
      alert("Login failed: " + (err.data?.error || "Invalid credentials"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="border-2 shadow-2xl">
          <CardHeader className="text-center">
            <img src={pandaMascot} className="w-24 h-24 mx-auto mb-4" alt="Panda" />
            <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
            <CardDescription>Login to continue your panda journey</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input name="password" type="password" placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full h-12 text-lg bg-primary hover:scale-105 transition-transform">
                Login 🚀
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account? <Link to="/signup" className="text-primary font-bold">Sign up</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;