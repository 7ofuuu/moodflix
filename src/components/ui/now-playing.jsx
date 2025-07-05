import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function NowPlayingPage() {
  const router = useRouter();

  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);

  const fetchNowPlayingMovies = async () => {
    const options = {
      method: "GET",
      url: "https://api.themoviedb.org/3/movie/now_playing",
      params: { language: "en-US", page: "1" },
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYWY3MTkyMmJmOWY3OTc1NWRiZTNkN2ZlNWQxYTkzNSIsIm5iZiI6MTc1MTIxNjgxMi4zMTgsInN1YiI6IjY4NjE3MmFjN2JhYmUzNmI3ZDMwM2U3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tl2jvdWNdW5O_WJus4DHUFrG6oBuwG-7Awfn2TWuwSU",
      },
    };

    const response = await axios.request(options);
    setNowPlayingMovies(response.data.results || []);
    // console.log(nowPlayingMovies);
    console.log(nowPlayingMovies);

    // axios
    //   .request(options)
    //   .then((res) => console.log(res.data))
    //   .catch((err) => console.error(err));
  };

  console.log(nowPlayingMovies);

  useEffect(() => {
    // Only fetch when router is ready and we have the necessary data
    if (router.isReady) {
      fetchNowPlayingMovies();
    }
  }, [router.isReady]);

  return (
    <>
      <section id="trending" className="container py-12 px-7">
        <h2 className="mb-12 text-center text-3xl font-bold">Now Playing Movies</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">
          {nowPlayingMovies.slice(0, 10).map((nowPlayingMovies) => (
            <Card key={nowPlayingMovies.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
              {nowPlayingMovies.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${nowPlayingMovies.poster_path}`}
                  alt={nowPlayingMovies.title}
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
                <CardTitle className="truncate">{nowPlayingMovies.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span>{nowPlayingMovies.release_date ? new Date(nowPlayingMovies.release_date).getFullYear() : "N/A"}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    {nowPlayingMovies.vote_average ? nowPlayingMovies.vote_average.toFixed(1) : "N/A"}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="line-clamp-3 text-sm text-muted-foreground">{nowPlayingMovies.overview || "No description available."}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <a href={`https://www.themoviedb.org/movie/${nowPlayingMovies.id}`} target="_blank" rel="noopener noreferrer">
                    View Details
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
