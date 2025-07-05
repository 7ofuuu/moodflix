import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import Image from "next/image";

// Mood to TMDB configuration mapping
const moodConfigs = {
  happy: {
    genres: [35, 10751],
    keywords: "feel-good",
    emoji: "😊",
  },
  sad: {
    genres: [18],
    keywords: "emotional,drama",
    emoji: "😢",
  },
  stressed: {
    genres: [53, 80],
    keywords: "thriller,suspense",
    emoji: "😫",
  },
  nostalgic: {
    genres: [10402, 10749],
    keywords: "retro,vintage",
    emoji: "🕰️",
  },
  adventurous: {
    genres: [12, 14],
    keywords: "adventure,fantasy",
    emoji: "🌍",
  },
};

export default function ResultsPage() {
  const router = useRouter();
  const { mood, goal, genre, decade, duration } = router.query;
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentMood = mood || "happy";

  const fetchAllMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build parameters based on mood and other filters
      const params = {
        include_adult: "false",
        include_video: "false",
        language: "en-US",
        page: "1",
        sort_by: "popularity.desc",
      };

      // Add genre filtering based on mood
      if (moodConfigs[currentMood]?.genres) {
        params.with_genres = moodConfigs[currentMood].genres.join(",");
      }

      // Add additional genre if specified
      if (genre && genre !== "any") {
        // You might need to map genre names to TMDB genre IDs
        // For now, this assumes genre is already a genre ID
        params.with_genres = genre;
      }

      // Add decade filtering
      if (decade && decade !== "any") {
        const startYear = parseInt(decade);
        const endYear = startYear + 9;
        params["primary_release_date.gte"] = `${startYear}-01-01`;
        params["primary_release_date.lte"] = `${endYear}-12-31`;
      }

      // Add runtime filtering based on duration
      if (duration && duration !== "any") {
        switch (duration) {
          case "short":
            params["with_runtime.lte"] = 90;
            break;
          case "medium":
            params["with_runtime.gte"] = 90;
            params["with_runtime.lte"] = 150;
            break;
          case "long":
            params["with_runtime.gte"] = 150;
            break;
        }
      }

      const options = {
        method: "GET",
        url: "https://api.themoviedb.org/3/discover/movie",
        params,
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYWY3MTkyMmJmOWY3OTc1NWRiZTNkN2ZlNWQxYTkzNSIsIm5iZiI6MTc1MTIxNjgxMi4zMTgsInN1YiI6IjY4NjE3MmFjN2JhYmUzNmI3ZDMwM2U3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tl2jvdWNdW5O_WJus4DHUFrG6oBuwG-7Awfn2TWuwSU",
        },
      };

      const response = await axios.request(options);
      setMovies(response.data.results || []);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Failed to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch when router is ready and we have the necessary data
    if (router.isReady) {
      fetchAllMovies();
    }
  }, [router.isReady, currentMood, genre, decade, duration]);

  const getRecommendationText = () => {
    if (goal === "feel-better") return "to lift your spirits";
    if (goal === "stay-mood") return "to keep you in this vibe";
    return "to help you escape reality";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>Your Recommendations | MoodFlix</title>
      </Head>

      {/* Header */}
      <header className="container py-8 md:px-7">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/")}>
            ← Back Home
          </Button>
          <Badge variant="outline" className="text-lg">
            {moodConfigs[currentMood]?.emoji || "🎬"}
            {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)} Mood
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container pb-12 px-7 md:px-7">
        <h1 className="text-3xl font-bold mb-2 text-center md:text-left">Your Perfect Matches</h1>
        <p className="text-muted-foreground mb-8 text-center md:text-left">We found movies {getRecommendationText()}</p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-64 w-full rounded-t-lg" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-4/5 mt-2" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardHeader>
              <CardTitle>Oops! Something went wrong</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button onClick={fetchAllMovies}>Try Again</Button>
              <Button variant="outline" onClick={() => router.push("/quiz")}>
                Retake Quiz
              </Button>
            </CardContent>
          </Card>
        ) : movies.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No movies found</CardTitle>
              <CardDescription>Try adjusting your preferences or retake the quiz.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button onClick={fetchAllMovies}>Try Again</Button>
              <Button variant="outline" onClick={() => router.push("/quiz")}>
                Retake Quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {movies.map((movie) => (
                <Card key={movie.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      width={500}
                      height={750}
                      className="w-full h-full object-cover rounded-t-lg"
                      onError={(e) => {
                        e.target.src = "/placeholder-movie.jpg";
                        e.target.className = "w-full h-64 object-contain rounded-t-lg bg-gray-200 p-4";
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="truncate">{movie.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="line-clamp-3 text-sm text-muted-foreground">{movie.overview || "No description available."}</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer">
                        View Details
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => router.push("/quiz")}>
                Retake Quiz
              </Button>
              <Button onClick={() => window.scrollTo(0, 0)}>Back to Top</Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
