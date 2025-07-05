import Navbar from "@/components/ui/navbar";
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Loader2, AlertCircle, Star, Trophy } from "lucide-react";

// Constants
const API_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p/w500",
  BEARER_TOKEN:
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYWY3MTkyMmJmOWY3OTc1NWRiZTNkN2ZlNWQxYTkzNSIsIm5iZiI6MTc1MTIxNjgxMi4zMTgsInN1YiI6IjY4NjE3MmFjN2JhYmUzNmI3ZDMwM2U3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tl2jvdWNdW5O_WJus4DHUFrG6oBuwG-7Awfn2TWuwSU",
};

const MAX_PAGES = 10; // Limited to 10 pages as requested

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-16">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
      <p className="text-lg font-medium">Loading top rated movies...</p>
      <p className="text-sm text-muted-foreground">Please wait while we fetch the best movies</p>
    </div>
  </div>
);

// Error component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <AlertCircle className="h-16 w-16 text-red-500 mb-6" />
    <h3 className="text-xl font-semibold text-red-600 mb-2">Oops! Something went wrong</h3>
    <p className="text-muted-foreground mb-6 max-w-md">{message}</p>
    <Button onClick={onRetry} variant="outline" className="gap-2">
      <Trophy className="h-4 w-4" />
      Try Again
    </Button>
  </div>
);

// Movie Card Component
const MovieCard = ({ movie, rank }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const releaseYear = useMemo(() => {
    return movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A";
  }, [movie.release_date]);

  const rating = useMemo(() => {
    return movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
  }, [movie.vote_average]);

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 h-full flex flex-col group relative overflow-hidden">
      {/* Rank badge */}
      <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold z-10 shadow-lg">{rank}</div>

      <div className="relative overflow-hidden rounded-t-lg">
        {!imageError && movie.poster_path ? (
          <img src={`${API_CONFIG.IMAGE_BASE_URL}${movie.poster_path}`} alt={`${movie.title} poster`} className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110" onError={handleImageError} loading="lazy" />
        ) : (
          <div className="w-full h-80 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="text-center">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <span className="text-gray-500 text-sm">No Image Available</span>
            </div>
          </div>
        )}

        {/* Rating overlay */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded-lg flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium">{rating}</span>
        </div>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">{movie.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-sm">
          <span className="font-medium">{releaseYear}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">Top Rated</span>
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow pb-2">
        <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">{movie.overview || "No description available for this highly rated movie."}</p>
      </CardContent>

      <CardFooter className="pt-2">
        <Button className="w-full group-hover:bg-primary/90 transition-colors" asChild>
          <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer" aria-label={`View details for ${movie.title}`}>
            View Details
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function TopRatedPage() {
  const router = useRouter();
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized API call
  const fetchTopRatedMovies = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/movie/top_rated`, {
        params: {
          language: "en-US",
          page: page.toString(),
        },
        headers: {
          accept: "application/json",
          Authorization: API_CONFIG.BEARER_TOKEN,
        },
        timeout: 10000, // 10 second timeout
      });

      setTopRatedMovies(response.data.results);
    } catch (err) {
      console.error("Error fetching top rated movies:", err);
      setError(
        err.response?.status === 401
          ? "API authentication failed. Please check your API key."
          : err.code === "ECONNABORTED"
          ? "Request timed out. Please check your internet connection."
          : "Failed to load top rated movies. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (router.isReady) {
      fetchTopRatedMovies(currentPage);
    }
  }, [router.isReady, currentPage, fetchTopRatedMovies]);

  // Handle page change
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= MAX_PAGES && newPage !== currentPage) {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [currentPage]
  );

  // Retry function for error handling
  const handleRetry = useCallback(() => {
    fetchTopRatedMovies(currentPage);
  }, [currentPage, fetchTopRatedMovies]);

  // Memoized pagination items
  const paginationItems = useMemo(() => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (MAX_PAGES <= maxVisiblePages) {
      startPage = 1;
      endPage = MAX_PAGES;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxPagesAfterCurrent >= MAX_PAGES) {
        startPage = MAX_PAGES - maxVisiblePages + 1;
        endPage = MAX_PAGES;
      } else {
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }

    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(currentPage - 1);
          }}
          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          aria-disabled={currentPage === 1}
        />
      </PaginationItem>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
            isActive={i === currentPage}
            aria-label={`Go to page ${i}`}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(currentPage + 1);
          }}
          className={currentPage === MAX_PAGES ? "pointer-events-none opacity-50" : ""}
          aria-disabled={currentPage === MAX_PAGES}
        />
      </PaginationItem>
    );

    return items;
  }, [currentPage, handlePageChange]);

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="h-10 w-10 text-yellow-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Top Rated Movies</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Discover the highest-rated movies of all time, curated by critics and audiences worldwide</p>
        </div>

        {/* Content */}
        {loading && <LoadingSpinner />}

        {error && <ErrorMessage message={error} onRetry={handleRetry} />}

        {!loading && !error && (
          <>
            {/* Movies Count */}
            <div className="mb-6 text-center">
              <p className="text-sm text-muted-foreground">
                Showing {topRatedMovies.length} top rated movies • Page {currentPage} of {MAX_PAGES}
              </p>
            </div>

            {/* Movies grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
              {topRatedMovies.length > 0 ? (
                topRatedMovies.map((movie, index) => <MovieCard key={movie.id} movie={movie} rank={(currentPage - 1) * 20 + index + 1} />)
              ) : (
                <div className="col-span-full text-center py-16">
                  <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">No movies found</p>
                  <p className="text-muted-foreground">Unable to load top rated movies at this time.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {topRatedMovies.length > 0 && (
              <div className=" flex md:flex-col sm:flex-row items-center justify-center gap-4 mt-12">
                <Pagination>
                  <PaginationContent>{paginationItems}</PaginationContent>
                </Pagination>
                <div className="md:w-32 flex items-center gap-2 text-sm text-muted-foreground">
                  <Trophy className="h-4 w-4" />
                  <span>
                    Page {currentPage} of {MAX_PAGES}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
