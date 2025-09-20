"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { LoaderFour } from "@/components/ui/loader";
import { useSession } from "next-auth/react";
import { TMDBMovie } from "@/types/tmdb";
import ProtectedRoute from "@/components/ProctedRoute";

export default function MovieDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [movie, setMovie] = useState<TMDBMovie | null>(null);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [favorites, setFavorites] = useState(false);
  const [watchlist, setWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch movie from TMDB
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=videos,credits`
        );

        setMovie(res.data);

        const videos = res.data.videos?.results || [];
        const trailerVideo = videos.find(
          (v: {
            id: string;
            key: string;
            name: string;
            site: string;
            size: number;
            type: string;
          }) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailerVideo) setTrailer(trailerVideo.key);
      } catch (err) {
        console.error("Error fetching movie:", err);
      }
    };

    fetchMovie();
  }, [id]);

  // ✅ Add to Favorites
  const handleFavorite = async () => {
    if (!session) {
      router.push("/signup");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/favorites", {
        movieId: id,
        type: "movie",
      });
      setFavorites(true);
    } catch (error) {
      console.error("Error adding to favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add to Watchlist
  const handleWatchlist = async () => {
    if (!session) {
      router.push("/signup");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/watchlist", {
        movieId: id,
        type: "movie",
      });
      setWatchlist(true);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!movie)
    return (
      <p className="text-white p-4 w-full h-full flex items-center justify-center">
        <LoaderFour />
      </p>
    );

  return (
    <ProtectedRoute>
      <div className="p-6 md:p-12 text-white bg-black min-h-screen">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Poster */}
          <div className="relative w-full md:w-1/3 h-[400px] md:h-[600px]">
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              alt={movie.title}
              fill
              className="rounded-lg object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <p className="text-gray-300">{movie.overview}</p>

            <p>
              <strong>Genres:</strong>{" "}
              {movie.genres?.map((g) => g.name).join(", ")}
            </p>

            <p>
              <strong>Runtime:</strong> {movie.runtime} min |{" "}
              <strong>Release Date:</strong> {movie.release_date}
            </p>

            <p>
              <strong>Rating:</strong> {movie.vote_average} / 10 (
              {movie.vote_count} votes)
            </p>

            <p>
              <strong>Production Companies:</strong>{" "}
              {movie.production_companies?.map((c) => c.name).join(", ")}
            </p>

            <p>
              <strong>Production Countries:</strong>{" "}
              {movie.production_countries?.map((c) => c.name).join(", ")}
            </p>

            {/* Trailer */}
            {trailer && (
              <div className="mt-4">
                <iframe
                  width="100%"
                  height="400"
                  src={`https://www.youtube.com/embed/${trailer}`}
                  title="Trailer"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleFavorite}
                disabled={loading || favorites}
                className={`px-4 py-2 rounded font-bold ${
                  favorites ? "bg-yellow-500" : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {favorites ? "★ Favorited" : "☆ Add to Favorites"}
              </button>

              <button
                onClick={handleWatchlist}
                disabled={loading || watchlist}
                className={`px-4 py-2 rounded font-bold ${
                  watchlist ? "bg-green-500" : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {watchlist ? "✔ In Watchlist" : "➕ Add to Watchlist"}
              </button>

              <button
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-500"
                onClick={() => router.back()}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
