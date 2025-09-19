"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { SkeletonCard } from "@/components/SkeletonCard";

export default function TvShowPage() {
  const [shows, setShows] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
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

  const goToDetails = (id: string) => {
    router.push(`/tvshow/${id}`);
  };

  const handlePageChange = (page: number) => {
    router.push(`/tvshow?page=${page}`);
  };

  return (
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
                className="cursor-pointer group"
                onClick={() => goToDetails(show.id)}
              >
                <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                    fill
                    className="object-cover group-hover:scale-110 transition"
                  />
                </div>
                <p className="mt-2 text-sm line-clamp-1">{show.name}</p>
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
  );
}
