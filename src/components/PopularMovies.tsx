"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { MediaCard } from "./MediaCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export function PopularMovies() {
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/trending/movie/week`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_ACCESS_TOKEN}`,
        },
      })
      .then((res) => setMovies(res.data.results))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="px-6 max-w-full">
      <h2 className="text-2xl font-bold mb-4">Popular Movies</h2>

      {/* Mobile → Grid, Desktop → Slider */}
      <div className="block md:hidden grid grid-cols-2 gap-4">
        {movies.map((movie) => (
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

      <div className="hidden md:block">
        <Swiper
          modules={[Navigation]}
          spaceBetween={15}
          slidesPerView={5}
          navigation
        >
          {movies.map((movie) => (
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
