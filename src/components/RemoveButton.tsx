"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface RemoveButtonProps {
  itemId: string; // prisma favorite or watchlist id
  type: "favorite" | "watchlist"; // specify which list
}

export function RemoveButton({ itemId, type }: RemoveButtonProps) {
  const [loading, setLoading] = useState(false);

  const endpoint = type === "favorite" ? "/api/favourites" : "/api/watchlist";

  const handleRemove = async () => {
    try {
      setLoading(true);
      await axios.delete(endpoint, { data: { id: itemId } });
      toast.success("Removed successfully!");
      window.location.reload(); // or use router.replace to stay on same page
    } catch (error) {
        throw error
      toast.error("Failed to remove.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="px-4 py-2 mt-4 bg-red-600 hover:bg-red-500 text-white rounded-md"
    >
      {loading ? "..." : type === "favorite" ? "Remove from Favorites" : "Remove from Watchlist"}
    </button>
  );
}
