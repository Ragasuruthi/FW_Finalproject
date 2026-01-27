import { useQuery } from "@tanstack/react-query";
import apiFetch from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Lessons = () => {
  const { data, isLoading, error } = useQuery<any, Error>({
    queryKey: ["lessons"],
    queryFn: () => apiFetch("/api/lessons"),
  });

  if (isLoading) return <div className="p-8">Loading lessons...</div>;
  if (error) return <div className="p-8">Failed to load lessons</div>;

  const lessons = data?.lessons || [];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="container mx-auto max-w-4xl">
        <Card className="border-2 shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {lessons.map((l: any) => (
                <div key={l._id} className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-medium">{l.title}</div>
                    <div className="text-sm text-muted-foreground">{l.language}</div>
                  </div>
                  <div>
                    <Link to={`/lesson?lessonId=${l._id}`}>
                      <Button>Start</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Lessons;
