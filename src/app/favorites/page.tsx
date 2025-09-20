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

export default async function FavoritesPage() {
  const session = await getServerSession(AuthOption);
  if (!session) return <p className="p-6">Please sign in to view favorites.</p>;

  const userId = session.user?.id;
  if (!userId) {
    return <p className="p-6">User information not found.</p>;
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId },
  });

  const favoriteDetails = await Promise.all(
    favorites.map(async (f) => {
      const details = await fetchFromTMDB(f.movieId, f.type as "movie" | "tv");
      return { ...f, details };
    })
  );

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Favorites</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md"
        >
          ⬅ Back Home
        </Link>
      </div>

      {favoriteDetails.length === 0 ? (
        <p className="text-gray-400">No favorites added yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {favoriteDetails.map(
            (fav) =>
              fav.details && (
                <div
                  key={fav.id}
                  className="relative flex flex-col items-center"
                >
                  <User
                    id={fav.id}
                    movieId={fav.movieId}
                    type={fav.type as "movie" | "tv"}
                    title={fav.details.title || fav.details.name}
                    posterPath={fav.details.poster_path}
                    removable={true}
                    removeEndpoint="/api/favourites"
                  />
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
