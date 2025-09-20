"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MediaCard } from "./MediaCard";
import { SkeletonCard } from "./SkeletonCard"; // ✅ import skeleton
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { TMDBTVShow } from "@/types/tmdb";

export function PopularTV() {
  const [shows, setShows] = useState<TMDBTVShow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/trending/tv/week`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_ACCESS_TOKEN}`,
        },
      })
      .then((res) => setShows(res.data.results))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-6 max-w-full mb-6">
      <h2 className="text-2xl font-bold mb-4">Trending TV Shows</h2>

      {/* Mobile → Grid */}
      <div className="block md:hidden grid grid-cols-2 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => <SkeletonCard key={idx} />)
          : shows.map((show) => (
              <MediaCard
                key={show.id}
                id={show.id}
                title={show.name}
                image={show.poster_path}
                overview={show.overview}
                type="tv"
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
            : shows.map((show) => (
                <SwiperSlide key={show.id}>
                  <MediaCard
                    id={show.id}
                    title={show.name}
                    image={show.poster_path}
                    overview={show.overview}
                    type="tv"
                  />
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </section>
  );
}
