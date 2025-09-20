"use client";

import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { SkeletonCard } from "@/components/SkeletonCard";
import { useSession } from "next-auth/react";
import { TMDBTVShow, TMDBResponse } from "@/types/tmdb";
import  ProtectedRoute  from "@/components/ProctedRoute";

function TvShowPageContent() {
  const [shows, setShows] = useState<TMDBTVShow[]>([]); // ✅ No more any[]
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [watchlist, setWatchlist] = useState<{ [key: number]: boolean }>({});
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      try {
        const res = await axios.get<TMDBResponse<TMDBTVShow>>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/discover/tv?page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_ACCESS_TOKEN}`,
            },
          }
        );
        setShows(res.data.results);
        setTotalPages(res.data.total_pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, [currentPage]);

  const goToDetails = (id: number) => {
    router.push(`/tvshow/${id}`);
  };

  const handlePageChange = (page: number) => {
    router.push(`/tvshow?page=${page}`);
  };

  // ✅ Add to favorites
  const toggleFavorite = async (id: number) => {
    if (!session) {
      router.push("/signup");
      return;
    }

    try {
      setActionLoading(true);
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tvId: id, type: "tv" }),
      });
      setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ Add to watchlist
  const toggleWatchlist = async (id: number) => {
    if (!session) {
      router.push("/signup");
      return;
    }

    try {
      setActionLoading(true);
      await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tvId: id, type: "tv" }),
      });
      setWatchlist((prev) => ({ ...prev, [id]: !prev[id] }));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 py-10 text-white">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="mb-6 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          ⬅ Back
        </button>

        <h1 className="text-3xl font-bold mb-6">TV Shows</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : shows.map((show) => (
                <div
                  key={show.id}
                  className="group relative flex flex-col cursor-pointer"
                >
                  {/* Poster */}
                  <div
                    className="relative w-full aspect-[2/3] rounded-lg overflow-hidden"
                    onClick={() => goToDetails(show.id)}
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                      alt={show.name}
                      fill
                      className="object-cover group-hover:scale-110 transition"
                    />
                  </div>

                  {/* Title */}
                  <p className="mt-2 text-sm line-clamp-1">{show.name}</p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => toggleFavorite(show.id)}
                      disabled={actionLoading}
                      className={`px-2 py-1 text-xs rounded ${
                        favorites[show.id]
                          ? "bg-yellow-500"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {favorites[show.id] ? "★" : "☆"}
                    </button>

                    <button
                      onClick={() => toggleWatchlist(show.id)}
                      disabled={actionLoading}
                      className={`px-2 py-1 text-xs rounded ${
                        watchlist[show.id]
                          ? "bg-green-500"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      {watchlist[show.id] ? "✔" : "➕"}
                    </button>
                  </div>
                </div>
              ))}
        </div>

        {/* Pagination */}
        {!loading && (
          <div className="flex justify-center mt-10 space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-gray-700 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}


export default function TvShowPage(){
  return (
      <ProtectedRoute>
        <Suspense fallback={<SkeletonCard />}>
          <TvShowPageContent />
        </Suspense>
      </ProtectedRoute>
    );
}