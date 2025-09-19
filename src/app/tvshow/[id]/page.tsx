"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function TVShowDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [show, setShow] = useState<any>(null);
  const [trailer, setTrailer] = useState<string | null>(null);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=videos,credits`
        );

        setShow(res.data);

        // Get the first trailer if available
        const videos = res.data.videos?.results || [];
        const trailerVideo = videos.find((v: any) => v.type === "Trailer");
        if (trailerVideo) setTrailer(trailerVideo.key);
      } catch (err) {
        console.error(err);
      }
    };

    fetchShow();
  }, [id]);

  if (!show) return <p className="text-white p-4">Loading...</p>;

  return (
    <div className="p-6 md:p-12 text-white bg-black min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Poster */}
        <div className="relative w-full md:w-1/3 h-[400px] md:h-[600px]">
          <Image
            src={`https://image.tmdb.org/t/p/original${show.poster_path}`}
            alt={show.name}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl font-bold">{show.name}</h1>
          <p className="text-gray-300">{show.overview}</p>

          <p>
            <strong>Genres:</strong>{" "}
            {show.genres?.map((g: any) => g.name).join(", ")}
          </p>

          <p>
            <strong>Created By:</strong>{" "}
            {show.created_by?.map((c: any) => c.name).join(", ")}
          </p>

          <p>
            <strong>Seasons:</strong> {show.number_of_seasons} |{" "}
            <strong>Episodes:</strong> {show.number_of_episodes}
          </p>

          <p>
            <strong>Rating:</strong> {show.vote_average} / 10
          </p>

          <p>
            <strong>Production Companies:</strong>{" "}
            {show.production_companies?.map((c: any) => c.name).join(", ")}
          </p>

          <p>
            <strong>Status:</strong> {show.status}
          </p>

          {/* Trailer */}
          {trailer && (
            <div className="mt-4">
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${trailer}`}
                title="Trailer"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {/* Back Button */}
          <button
            className="mt-4 bg-red-600 px-4 py-2 rounded hover:bg-red-500"
            onClick={() => router.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
