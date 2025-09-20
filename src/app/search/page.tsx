"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { MediaCard } from "@/components/MediaCard";
import { SkeletonCard } from "@/components/SkeletonCard";

type SearchResult = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  media_type: "movie" | "tv";
};


function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const router = useRouter();
  const { data: session, status } = useSession();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      toast.error("You need to sign up first!");
      router.push("/signup");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (!query || !session) return;
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(query)}`
        );
        const filtered: SearchResult[] = res.data.results.filter(
          (item: SearchResult) => item.media_type === "movie" || item.media_type === "tv"
        );
        setResults(filtered);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, session]);

  return (
    <div className="p-6 md:p-12 bg-black min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Search Results for: <span className="text-red-500">{query}</span>
        </h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md"
        >
          Go Back
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <p className="text-gray-400">No results found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {results.map((item) => (
            <MediaCard
              key={item.id}
              id={item.id}
              title={item.title || item.name || ""}
              image={item.poster_path}
              type={item.media_type}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SearchPageContent />
    </Suspense>
  );
}


