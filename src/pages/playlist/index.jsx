import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import Link from "next/link";

// Mock playlist data (replace with your database)
const mockPlaylists = {
  "feel-good-classics": {
    id: "feel-good-classics",
    title: "Feel-Good Classics",
    description: "Timeless movies to brighten your day",
    mood: "happy",
    movies: [278, 13, 680, 744, 238], // TMDB movie IDs
  },
  "cry-it-out": {
    id: "cry-it-out",
    title: "Cry It Out Therapy",
    description: "For when you need a good emotional release",
    mood: "sad",
    movies: [18, 78, 153, 550, 598], // TMDB movie IDs
  },
};

export default function PlaylistPage() {
  const router = useRouter();
  const { id } = router.query;
  const [playlist, setPlaylist] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchPlaylist = async () => {
      try {
        setLoading(true);

        // 1. Get playlist metadata (in real app, fetch from your database)
        const playlistData = mockPlaylists[id] || null;

        if (!playlistData) {
          throw new Error("Playlist not found");
        }

        setPlaylist(playlistData);

        // 2. Fetch movie details from TMDB
        const moviePromises = playlistData.movies.map((movieId) =>
          axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: {
              api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
            },
          })
        );

        const movieResponses = await Promise.all(moviePromises);
        const movieData = movieResponses.map((res) => res.data);

        setMovies(movieData);
      } catch (err) {
        console.error("Error loading playlist:", err);
        setError(err.message);
        // toast({
        //   variant: "destructive",
        //   title: "Error",
        //   description: err.message,
        // });
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [router.isReady, id]);

  const moodConfig = {
    happy: { emoji: "😊", color: "bg-yellow-100" },
    sad: { emoji: "😢", color: "bg-blue-100" },
    stressed: { emoji: "😫", color: "bg-red-100" },
    nostalgic: { emoji: "🕰️", color: "bg-purple-100" },
    adventurous: { emoji: "🌍", color: "bg-green-100" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>{playlist?.title || "Playlist"} | MoodFlix</title>
      </Head>

      {/* Header */}
      <header className="container py-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            ← Back
          </Button>
          {playlist && (
            <Badge className={`text-lg ${moodConfig[playlist.mood]?.color}`}>
              {moodConfig[playlist.mood]?.emoji} {playlist.mood.charAt(0).toUpperCase() + playlist.mood.slice(1)}
            </Badge>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container pb-12">
        {loading ? (
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-64 w-full rounded-t-lg" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ) : error ? (
          <Card>
            <CardHeader>
              <CardTitle>Oops!</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/")}>Back to Home</Button>
            </CardContent>
          </Card>
        ) : playlist ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{playlist.title}</h1>
              <p className="text-lg text-muted-foreground">{playlist.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((movie) => (
                <Card key={movie.id} className="hover:shadow-lg transition-shadow">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.src = "/placeholder-movie.jpg";
                      e.target.className = "w-full h-64 object-contain rounded-t-lg bg-gray-200 p-4";
                    }}
                  />
                  <CardHeader>
                    <CardTitle className="truncate">{movie.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{movie.overview || "No description available."}</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/movie/${movie.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
