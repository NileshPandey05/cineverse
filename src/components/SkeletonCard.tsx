"use client";

export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-[2/3] rounded-lg bg-gray-800" />
      <div className="h-4 mt-2 w-3/4 bg-gray-700 rounded" />
    </div>
  );
}
