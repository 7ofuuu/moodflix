import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function MoodQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [filters, setFilters] = useState({
    genre: "",
    decade: "",
    duration: "",
  });

  // Mood options
  const moods = [
    { id: "happy", name: "Happy", emoji: "😊" },
    { id: "sad", name: "Sad", emoji: "😢" },
    { id: "stressed", name: "Stressed", emoji: "😫" },
    { id: "nostalgic", name: "Nostalgic", emoji: "🕰️" },
    { id: "adventurous", name: "Adventurous", emoji: "🌍" },
  ];

  // Goal options
  const goals = [
    { id: "feel-better", name: "Feel Better", emoji: "✨" },
    { id: "stay-mood", name: "Stay in This Mood", emoji: "🧘" },
    { id: "distract", name: "Distract Myself", emoji: "🎭" },
  ];

  const handleSubmit = () => {
    router.push({
      pathname: "/results",
      query: {
        mood: selectedMood?.id,
        goal: selectedGoal?.id,
        ...filters,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>Mood Quiz | MoodFlix</title>
      </Head>

      {/* Progress Bar */}
      <div className="px-4 pt-6 max-w-3xl mx-auto">
        <Progress value={(step / 3) * 100} className="h-2" />
      </div>

      <main className="container max-w-3xl mx-auto px-4 py-8">
        {/* Step 1: Current Mood */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-bold text-center">How are you feeling right now?</h1>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {moods.map((mood) => (
                  <Button key={mood.id} variant={selectedMood?.id === mood.id ? "default" : "outline"} className={`h-32 flex-col gap-2 text-lg ${selectedMood?.id === mood.id ? "bg-primary" : ""}`} onClick={() => setSelectedMood(mood)}>
                    <span className="text-3xl">{mood.emoji}</span>
                    {mood.name}
                  </Button>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!selectedMood}>
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Desired Goal */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-bold text-center">What do you want to feel?</h1>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {goals.map((goal) => (
                  <Button key={goal.id} variant={selectedGoal?.id === goal.id ? "default" : "outline"} className={`h-32 flex-col gap-2 text-lg ${selectedGoal?.id === goal.id ? "bg-primary" : ""}`} onClick={() => setSelectedGoal(goal)}>
                    <span className="text-3xl">{goal.emoji}</span>
                    {goal.name}
                  </Button>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!selectedGoal}>
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Filters */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-bold text-center">Fine-tune your results</h1>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 mb-8">
                <div className="space-y-2">
                  <Label>Genre</Label>
                  <Select value={filters.genre} onValueChange={(value) => setFilters({ ...filters, genre: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comedy">Comedy</SelectItem>
                      <SelectItem value="drama">Drama</SelectItem>
                      <SelectItem value="thriller">Thriller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Decade</Label>
                  <Select value={filters.decade} onValueChange={(value) => setFilters({ ...filters, decade: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Decade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1980s">1980s</SelectItem>
                      <SelectItem value="1990s">1990s</SelectItem>
                      <SelectItem value="2000s">2000s</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Select value={filters.duration} onValueChange={(value) => setFilters({ ...filters, duration: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Under 90 mins</SelectItem>
                      <SelectItem value="medium">90-120 mins</SelectItem>
                      <SelectItem value="long">Over 120 mins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={handleSubmit}>Find My Movies</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
