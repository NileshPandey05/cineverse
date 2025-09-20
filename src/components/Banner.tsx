"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useRouter } from "next/navigation";
import { TrailerModal } from "./TrailerModal";
import { TMDBMovie, TMDBTVShow } from "@/types/tmdb";

type TMDBTrendingItem = (TMDBMovie | TMDBTVShow) & {
  media_type: "movie" | "tv";
};

interface TMDBVideo {
  id: string;
  key: string;
  site: string;
  type: string;
}

export default function Banner() {
  const [trending, setTrending] = useState<TMDBTrendingItem[]>([]);
  const [trailerKey, setTrailerKey] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get<{ results: TMDBTrendingItem[] }>(
          `${process.env.NEXT_PUBLIC_BASE_URL}/trending/all/day`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_ACCESS_TOKEN}`,
            },
          }
        );
        setTrending(res.data.results.filter((m) => m.backdrop_path));
      } catch (err) {
        console.error(err);
      }
    };
    fetchTrending();
  }, []);

  const playTrailer = async (id: number, mediaType: "movie" | "tv") => {
    try {
      const res = await axios.get<{ results: TMDBVideo[] }>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/${mediaType}/${id}/videos`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_ACCESS_TOKEN}`,
          },
        }
      );
      const trailer = res.data.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      if (trailer) {
        setTrailerKey(trailer.key);
        setIsOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const goToDetails = (id: number, mediaType: "movie" | "tv") => {
    const route = mediaType === "tv" ? "tvshow" : "movie";
    router.push(`/${route}/${id}`);
  };

  return (
    <div className="w-full relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="w-full h-[60vh] sm:h-[70vh] md:h-screen"
      >
        {trending.map((item) => {
          const title = "title" in item ? item.title : item.name;
          const mediaType = item.media_type;
          return (
            <SwiperSlide key={item.id}>
              <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-screen">
                <Image
                  src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                  alt={title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute bottom-4 sm:bottom-10 left-4 sm:left-8 md:left-10 max-w-[90%] sm:max-w-[70%] md:max-w-[60%] text-white space-y-2 sm:space-y-4"
                >
                  <h2 className="text-xl sm:text-3xl md:text-6xl font-extrabold leading-tight">
                    {title}
                  </h2>
                  <p className="text-xs sm:text-sm md:text-lg line-clamp-3">
                    {item.overview}
                  </p>
                  <p className="text-yellow-400 font-semibold text-sm sm:text-base">
                    ⭐ {item.vote_average?.toFixed(1)} / 10
                  </p>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mt-2 sm:mt-4">
                    <button
                      className="bg-white text-black px-3 sm:px-4 py-1 sm:py-2 rounded-md font-bold hover:bg-gray-300 transition text-sm sm:text-base"
                      onClick={() => playTrailer(item.id, mediaType)}
                    >
                      ▶ Play
                    </button>
                    <button
                      className="bg-gray-700/80 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md font-bold hover:bg-gray-600 transition text-sm sm:text-base"
                      onClick={() => goToDetails(item.id, mediaType)}
                    >
                      ℹ More Info
                    </button>
                  </div>
                </motion.div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <TrailerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        trailerKey={trailerKey}
      />
    </div>
  );
}
