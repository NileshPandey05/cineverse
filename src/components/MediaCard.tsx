"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MediaCardProps {
  id: number;
  title: string;
  image: string;
  overview?: string;
  type: "movie" | "tv";
}

export function MediaCard({ id, title, image, overview, type }: MediaCardProps) {
  const router = useRouter();

  const handleClick = () => {
    if (type === "movie") {
      router.push(`/movie/${id}`);
    } else if (type === "tv") {
      router.push(`/tvshow/${id}`);
    }
  };

  return (
    <div
      className="relative w-[180px] md:w-[200px] cursor-pointer group overflow-hidden rounded-lg"
      onClick={handleClick}
    >
      {/* Poster */}
      <div className="relative w-full h-[270px] md:h-[300px]">
        <Image
          src={`https://image.tmdb.org/t/p/w500${image}`}
          alt={title}
          fill
          className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Overlay on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
        <h3 className="font-semibold text-sm md:text-base">{title}</h3>
        {overview && (
          <p className="text-xs md:text-sm mt-1 line-clamp-3">{overview}</p>
        )}
      </div>
    </div>
  );
}
