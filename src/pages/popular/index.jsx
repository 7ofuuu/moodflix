import Navbar from "@/components/ui/navbar";
import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Loader2, AlertCircle, Star } from "lucide-react";

// Constants
const API_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p/w500",
  BEARER_TOKEN:
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYWY3MTkyMmJmOWY3OTc1NWRiZTNkN2ZlNWQxYTkzNSIsIm5iZiI6MTc1MTIxNjgxMi4zMTgsInN1YiI6IjY4NjE3MmFjN2JhYmUzNmI3ZDMwM2U3ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tl2jvdWNdW5O_WJus4DHUFrG6oBuwG-7Awfn2TWuwSU",
};

const MAX_PAGES = 10; // Limited to 10 pages as requested
const MOVIES_PER_PAGE = 20;

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2 text-lg">Loading movies...</span>
  </div>
);

// Error component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
    <p className="text-lg font-medium text-red-600 mb-4">{message}</p>
    <Button onClick={onRetry} variant="outline">
      Try Again
    </Button>
  </div>
);

// Movie Card Component
const MovieCard = ({ movie }) => {
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
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 h-full flex flex-col group">
      <div className="relative overflow-hidden rounded-t-lg">
        {!imageError && movie.poster_path ? (
          <img src={`${API_CONFIG.IMAGE_BASE_URL}${movie.poster_path}`} alt={`${movie.title} poster`} className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105" onError={handleImageError} loading="lazy" />
        ) : (
          <div className="w-full h-80 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No Image Available</span>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">{movie.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-sm">
          <span>{releaseYear}</span>
          <span>•</span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span>{rating}</span>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow pb-2">
        <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">{movie.overview || "No description available."}</p>
      </CardContent>

      <CardFooter className="pt-2">
        <Button className="w-full" asChild>
          <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer" aria-label={`View details for ${movie.title}`}>
            View Details
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function PopularPage() {
  const router = useRouter();
  const [popularMovies, setPopularMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [yearFilter, setYearFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized API call
  const fetchPopularMovies = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/movie/popular`, {
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

      setPopularMovies(response.data.results);
      setFilteredMovies(response.data.results);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError(err.response?.status === 401 ? "API authentication failed. Please check your API key." : "Failed to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (router.isReady) {
      fetchPopularMovies(currentPage);
    }
  }, [router.isReady, currentPage, fetchPopularMovies]);

  // Memoized filter application
  const applyFilters = useCallback(() => {
    let filtered = [...popularMovies];

    // Filter by year
    if (yearFilter !== "all") {
      filtered = filtered.filter((movie) => {
        const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear().toString() : null;
        return releaseYear === yearFilter;
      });
    }

    // Sort by rating
    if (sortOrder !== "none") {
      filtered.sort((a, b) => {
        const ratingA = a.vote_average || 0;
        const ratingB = b.vote_average || 0;
        return sortOrder === "asc" ? ratingA - ratingB : ratingB - ratingA;
      });
    }

    setFilteredMovies(filtered);
  }, [popularMovies, yearFilter, sortOrder]);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Memoized unique years
  const uniqueYears = useMemo(() => {
    const years = new Set();
    popularMovies.forEach((movie) => {
      if (movie.release_date) {
        years.add(new Date(movie.release_date).getFullYear().toString());
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [popularMovies]);

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

  // Reset filters
  const resetFilters = useCallback(() => {
    setYearFilter("all");
    setSortOrder("none");
  }, []);

  // Retry function for error handling
  const handleRetry = useCallback(() => {
    fetchPopularMovies(currentPage);
  }, [currentPage, fetchPopularMovies]);

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Popular Movies</h1>
          <p className="text-muted-foreground text-lg">Discover the most popular movies right now</p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 p-6 bg-card rounded-lg shadow-sm border">
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium">Release Year</label>
            <Select onValueChange={setYearFilter} value={yearFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {uniqueYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium">Sort by Rating</label>
            <Select onValueChange={setSortOrder} value={sortOrder}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Default order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Default</SelectItem>
                <SelectItem value="asc">Low to High</SelectItem>
                <SelectItem value="desc">High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={resetFilters} className="w-full lg:w-auto">
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Content */}
        {loading && <LoadingSpinner />}

        {error && <ErrorMessage message={error} onRetry={handleRetry} />}

        {!loading && !error && (
          <>
            {/* Movies grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
              {filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="bg-muted/50 rounded-lg p-8">
                    <p className="text-lg font-medium mb-2">No movies found</p>
                    <p className="text-muted-foreground mb-4">Try adjusting your filters or browse all movies</p>
                    <Button onClick={resetFilters} variant="outline">
                      Reset Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredMovies.length > 0 && (
              <div className="flex justify-center mt-12">
                <Pagination>
                  <PaginationContent>{paginationItems}</PaginationContent>
                </Pagination>
                <div className="md:w-24 flex items-center text-sm text-muted-foreground">
                  Page {currentPage} of {MAX_PAGES}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
