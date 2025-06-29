import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const moods = [
    { id: "happy", name: "Happy", emoji: "😊", color: "bg-yellow-100 hover:bg-yellow-200" },
    { id: "sad", name: "Melancholic", emoji: "😔", color: "bg-blue-100 hover:bg-blue-200" },
    { id: "excited", name: "Thrilled", emoji: "🤩", color: "bg-red-100 hover:bg-red-200" },
    { id: "cozy", name: "Cozy", emoji: "☕", color: "bg-orange-100 hover:bg-orange-200" },
    { id: "nostalgic", name: "Nostalgic", emoji: "🕰️", color: "bg-purple-100 hover:bg-purple-200" },
  ];

  const trendingPlaylists = [
    { title: "Feel-Good Classics", count: 12, updated: "Weekly" },
    { title: "Cry It Out Therapy", count: 8, updated: "Monthly" },
    { title: "Mind-Bending Thrillers", count: 10, updated: "Weekly" },
  ];

  return (
    <>
      <Head>
        <title>MoodFlix | Movies for Your Mood</title>
        <meta name="description" content="Discover perfect movies based on your current mood" />
      </Head>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-7">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">MoodFlix</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/quiz">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-12 md:py-24">
        <div className="mx-auto flex max-w-[64rem] flex-col items-center justify-center gap-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            What&apos;s your <span className="text-primary">mood</span> today?
          </h1>
          <p className="max-w-[42rem] text-lg leading-normal text-muted-foreground sm:text-xl sm:leading-8">Get personalized movie recommendations that perfectly match how you feel right now.</p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/quiz">Take the Mood Quiz</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="#trending">Browse Playlists</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mood Selection Grid */}
      <section className="container py-12 px-7">
        <h2 className="mb-8 text-center text-3xl font-bold">Popular Mood Categories</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {moods.map((mood) => (
            <Button key={mood.id} variant="outline" className={`h-32 flex-col gap-2 text-lg ${mood.color}`} asChild>
              <Link href={`/results?mood=${mood.id}`}>
                <span className="text-3xl">{mood.emoji}</span>
                {mood.name}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      {/* Trending Playlists */}
      <section id="trending" className="container py-12 px-7">
        <h2 className="mb-8 text-center text-3xl font-bold">Trending Mood Playlists</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {trendingPlaylists.map((playlist) => (
            <Card key={playlist.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <h3 className="text-xl font-semibold">{playlist.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {playlist.count} movies • Updated {playlist.updated}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/playlist/${playlist.title.toLowerCase().replace(/\s+/g, "-")}`}>View Playlist</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-12 px-7">
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardHeader className="text-center">
            <h2 className="text-3xl font-bold">Ready to find your perfect movie match?</h2>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button size="lg" asChild>
              <Link href="/quiz" className="gap-2">
                Start Mood Quiz
                <span className="text-xl">🎬</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:px-7">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2025 MoodFlix. All rights reserved.</p>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/privacy">Privacy</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/terms">Terms</Link>
            </Button>
          </div>
        </div>
      </footer>
    </>
  );
}
