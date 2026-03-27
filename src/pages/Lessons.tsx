import { useQuery } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";

const Lessons = () => {
  const selectedLanguage = localStorage.getItem("selectedLanguage") || "english";

  const { data, isLoading, error } = useQuery<any, Error>({
    queryKey: ["lessons", selectedLanguage],
    queryFn: () => apiFetch(`/api/lessons?language=${selectedLanguage}`),
  });

  if (isLoading) return <div className="p-8 text-center text-xl font-bold">Loading {selectedLanguage} lessons... 🐼</div>;
  if (error) return <div className="p-8 text-center text-red-500">Failed to load lessons. Please check your connection.</div>;

  const lessons = data?.lessons || [];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
           <Link to="/dashboard">
             <Button variant="ghost" size="icon"><ArrowLeft /></Button>
           </Link>
           <h1 className="text-3xl font-bold capitalize">{selectedLanguage} Path</h1>
        </div>

        <Card className="border-2 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="text-primary" /> Available Lessons
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lessons.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No lessons found for this language yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {lessons.map((l: any) => (
                  <div key={l._id} className="p-6 border-2 rounded-xl flex justify-between items-center hover:bg-accent/5 transition-colors">
                    <div>
                      <div className="font-bold text-lg">{l.title}</div>
                      <div className="text-sm text-muted-foreground">{l.description || 'Master new skills'}</div>
                    </div>
                    <Link to={`/lesson?lessonId=${l._id}`}>
                      <Button className="rounded-full px-8 bg-primary hover:scale-105 transition-transform">Start</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Lessons;