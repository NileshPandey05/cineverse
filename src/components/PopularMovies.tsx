"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MediaCard } from "./MediaCard";
import { SkeletonCard } from "./SkeletonCard"; // ✅ import skeleton
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { TMDBMovie } from "@/types/tmdb";

export function PopularMovies() {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/trending/movie/week`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_ACCESS_TOKEN}`,
        },
      })
      .then((res) => setMovies(res.data.results))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-6 max-w-full">
      <h2 className="text-2xl font-bold mb-4">Popular Movies</h2>

      {/* Mobile → Grid */}
      <div className="block md:hidden grid grid-cols-2 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)
          : movies.map((movie) => (
              <MediaCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                image={movie.poster_path}
                overview={movie.overview}
                type="movie"
              />
            ))}
      </div>

      {/* Desktop → Slider */}
      <div className="hidden md:block">
        <Swiper modules={[Navigation]} spaceBetween={15} slidesPerView={5} navigation>
          {loading
            ? Array.from({ length: 5 }).map((_, idx) => (
                <SwiperSlide key={idx}>
                  <SkeletonCard />
                </SwiperSlide>
              ))
            : movies.map((movie) => (
                <SwiperSlide key={movie.id}>
                  <MediaCard
                    id={movie.id}
                    title={movie.title}
                    image={movie.poster_path}
                    overview={movie.overview}
                    type="movie"
                  />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </section>
  );
}
