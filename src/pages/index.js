import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/ui/navbar";
import FooterComponent from "@/components/ui/footer";
import NowPlayingPage from "@/components/ui/now-playing";

// Constants moved outside component for better performance
const MOODS = [
  { id: "happy", name: "Happy", emoji: "😊", color: "bg-yellow-100 hover:bg-yellow-200" },
  { id: "sad", name: "Melancholic", emoji: "😔", color: "bg-blue-100 hover:bg-blue-200" },
  { id: "excited", name: "Thrilled", emoji: "🤩", color: "bg-red-100 hover:bg-red-200" },
  { id: "cozy", name: "Cozy", emoji: "☕", color: "bg-orange-100 hover:bg-orange-200" },
  { id: "nostalgic", name: "Nostalgic", emoji: "🕰️", color: "bg-purple-100 hover:bg-purple-200" },
];

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MoodFlix",
  description: "Discover perfect movies based on your current mood",
  url: "https://moodflix.com",
  applicationCategory: "Entertainment",
  operatingSystem: "Web Browser",
};

export default function Home() {
  return (
    <>
      <Head>
        <title>MoodFlix | Movies for Your Mood</title>
        <meta name="description" content="Discover perfect movies based on your current mood. Get personalized movie recommendations that match how you feel right now." />
        <meta name="keywords" content="movies, mood, recommendations, entertainment, film, personalized" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="MoodFlix | Movies for Your Mood" />
        <meta property="og:description" content="Discover perfect movies based on your current mood" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://moodflix.com" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }} />
      </Head>

      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-24" aria-labelledby="hero-heading">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 text-center">
            <h1 id="hero-heading" className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              What&apos;s your <span className="text-primary">mood</span> today?
            </h1>
            <p className="max-w-2xl text-lg leading-normal text-muted-foreground sm:text-xl sm:leading-8">Get personalized movie recommendations that perfectly match how you feel right now.</p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="transition-transform hover:scale-105">
                <Link href="/quiz">Take the Mood Quiz</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Mood Selection Grid */}
        <section className="container mx-auto px-4 py-12" aria-labelledby="mood-categories">
          <h2 id="mood-categories" className="mb-8 text-center text-3xl font-bold">
            Popular Mood Categories
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5" role="group" aria-label="Mood categories">
            {MOODS.map((mood) => (
              <Button key={mood.id} variant="outline" className={`h-32 flex-col gap-2 text-lg transition-all duration-200 hover:scale-105 ${mood.color} border-2 hover:border-primary/50`} asChild>
                <Link href={`/results?mood=${mood.id}`} aria-label={`Browse ${mood.name} movies`}>
                  <span className="text-3xl" role="img" aria-label={mood.name}>
                    {mood.emoji}
                  </span>
                  <span className="font-medium">{mood.name}</span>
                </Link>
              </Button>
            ))}
          </div>
        </section>

        {/* Now Playing Section */}
        <section aria-labelledby="now-playing">
          <NowPlayingPage />
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-12" aria-labelledby="cta-section">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-2 shadow-lg">
            <CardHeader className="text-center">
              <h2 id="cta-section" className="text-2xl font-bold sm:text-3xl">
                Ready to find your perfect movie match?
              </h2>
            </CardHeader>
            <CardContent className="flex justify-center pb-8">
              <Button size="lg" asChild className="transition-transform hover:scale-105 shadow-md">
                <Link href="/quiz" className="gap-2">
                  Start Mood Quiz
                  <span className="text-xl" role="img" aria-label="Movie camera">
                    🎬
                  </span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <FooterComponent />
    </>
  );
}
