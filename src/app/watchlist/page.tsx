import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { AuthOption } from "@/lib/auth";

import Link from "next/link";
import { User } from "@/components/FavoriteCard";

async function fetchFromTMDB(id: string, type: "movie" | "tv") {
  const res = await fetch(
    `https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function WatchListPage() {
  const session = await getServerSession(AuthOption);
  if (!session) return <p className="p-6">Please sign in to view your watchlist.</p>;

  if (!session.user) {
    return <p className="p-6">User information not found. Please sign in again.</p>;
  }

  const watchlist = await prisma.watchlist.findMany({
    where: { userId: session.user.id },
  });

  const watchlistDetails = await Promise.all(
    watchlist.map(async (item) => {
      const details = await fetchFromTMDB(item.movieId, item.type as "movie" | "tv");
      return { ...item, details };
    })
  );

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Watchlist</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md"
        >
          ⬅ Back Home
        </Link>
      </div>

      {watchlistDetails.length === 0 ? (
        <p className="text-gray-400">No items in your watchlist yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {watchlistDetails.map(
            (item) =>
              item.details && (
                <div key={item.id} className="relative flex flex-col items-center">
                  <User
                    id={item.id}
                    movieId={item.movieId}
                    type={item.type as "movie" | "tv"}
                    title={item.details.title || item.details.name}
                    posterPath={item.details.poster_path}
                    removable={true}
                    removeEndpoint="/api/watchlist"
                  />
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
