"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";

interface UserProps {
  id: string;
  movieId: string;
  type: "movie" | "tv";
  title: string;
  posterPath: string;
  removable?: boolean;
  removeEndpoint?: string; // API endpoint to remove item
}

export function User({
  id,
  movieId,
  type,
  title,
  posterPath,
  removable = false,
  removeEndpoint,
}: UserProps) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    if (!removeEndpoint) return;
    try {
      setRemoving(true);
      await axios.delete(removeEndpoint, { data: { id } });
      toast.success("Removed!");
      window.location.reload();
    } catch (err) {
        throw err
      toast.error("Failed to remove item");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="relative group">
      <Link href={`/${type}/${movieId}`} className="block">
        <Image
          src={`https://image.tmdb.org/t/p/w500${posterPath}`}
          alt={title}
          width={300}
          height={450}
          className="rounded-lg shadow-md"
        />
        <p className="mt-2 text-center text-sm">{title}</p>
      </Link>

      {removable && removeEndpoint && (
        <button
          onClick={handleRemove}
          disabled={removing}
          className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition"
        >
          {removing ? "..." : "Remove"}
        </button>
      )}
    </div>
  );
}
