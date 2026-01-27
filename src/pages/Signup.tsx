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

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    const name = fd.get("name") as string;
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;

    // Basic client-side validation
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    // Call backend signup
        (async () => {
          try {
            await apiFetch("/api/auth/signup", { method: "POST", json: { email, password, name } });
            const data = await apiFetch("/api/auth/login", { method: "POST", json: { email, password } });
            if (data?.token) localStorage.setItem("token", data.token);
            navigate("/language-select");
          } catch (err: any) {
            console.error(err);
            const msg = err?.data?.error || err?.data?.details || err?.message || "Unknown";
            alert("Signup error: " + msg);
          }
        })();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/20 via-background to-accent/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 shadow-2xl">
          <CardHeader className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mx-auto mb-4 w-24 h-24"
            >
              <img
                src={pandaHappy}
                alt="Happy panda"
                className="w-full h-full object-contain"
              />
            </motion.div>
            <CardTitle className="text-3xl font-bold">Join PandaLingo!</CardTitle>
            <CardDescription className="text-lg">
              Start your language journey today 🌟
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg">Full Name</Label>
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    className="h-12 text-lg"
                    required
                  />
                </motion.div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg">Email</Label>
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="h-12 text-lg"
                    required
                  />
                </motion.div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg">Password</Label>
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-12 text-lg"
                    required
                  />
                </motion.div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg bg-gradient-to-r from-secondary to-primary hover:scale-105 transition-transform"
              >
                Sign Up 🎉
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
