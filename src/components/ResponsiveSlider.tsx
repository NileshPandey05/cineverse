"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function ResponsiveSlider({ items, renderItem }: { items: any[]; renderItem: (item: any) => React.ReactNode }) {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={20}
      pagination={{ clickable: true }}
      navigation
      breakpoints={{
        320: { slidesPerView: 1 },
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 4 },
      }}
    >
      {items.map((item, idx) => (
        <SwiperSlide key={idx}>{renderItem(item)}</SwiperSlide>
      ))}
    </Swiper>
  );
}
