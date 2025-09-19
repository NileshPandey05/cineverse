"use client";

import Herosection from "@/components/Herosection";
import { PopularMovies } from "@/components/PopularMovies";
import { PopularTV } from "@/components/PopularTV";

export default function Home() {
  return (
    <div className="w-full h-full overflow-x-hidden">
      <Herosection />
      <div className="mt-10 md:mt-34 space-y-16">
        <PopularMovies />
        <PopularTV />
      </div>
    </div>
  );
}
