"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { LoaderFour } from "@/components/ui/loader";

export default function MovieDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [favorites, setFavorites] = useState(false);
  const [watchlist, setWatchlist] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=videos,credits`
        );

        setMovie(res.data);

        const videos = res.data.videos?.results || [];
        const trailerVideo = videos.find((v: any) => v.type === "Trailer");
        if (trailerVideo) setTrailer(trailerVideo.key);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovie();
  }, [id]);

  if (!movie) return <p className="text-white p-4 w-full h-full item-center justify-center"><LoaderFour /></p>;

  return (
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
            {movie.genres?.map((g: any) => g.name).join(", ")}
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
            {movie.production_companies?.map((c: any) => c.name).join(", ")}
          </p>

          <p>
            <strong>Production Countries:</strong>{" "}
            {movie.production_countries?.map((c: any) => c.name).join(", ")}
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
              className={`px-4 py-2 rounded font-bold ${
                favorites ? "bg-yellow-500" : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => setFavorites(!favorites)}
            >
              {favorites ? "★ Favorited" : "☆ Add to Favorites"}
            </button>

            <button
              className={`px-4 py-2 rounded font-bold ${
                watchlist ? "bg-green-500" : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => setWatchlist(!watchlist)}
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
  );
}
