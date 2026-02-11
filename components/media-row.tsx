"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { MediaCard } from "./media-card"

interface MediaItem {
  id: number
  title?: string
  name?: string
  poster_path: string | null
  vote_average: number
  media_type?: string
  release_date?: string
  first_air_date?: string
}

interface MediaRowProps {
  title: string
  items: MediaItem[]
  mediaType?: "movie" | "tv"
}

export function MediaRow({ title, items, mediaType }: MediaRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return
    const scrollAmount = scrollRef.current.clientWidth * 0.75
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <section className="relative py-4">
      <h2 className="mb-3 px-4 font-display text-xl font-bold text-foreground lg:px-8">
        {title}
      </h2>
      <div className="group relative">
        <button
          onClick={() => scroll("left")}
          className="absolute top-1/2 left-1 z-10 -translate-y-1/2 rounded-full bg-violet-900/70 p-2 text-foreground opacity-0 backdrop-blur-sm transition-opacity hover:bg-violet-800/80 group-hover:opacity-100"
          aria-label="Defiler vers la gauche"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div
          ref={scrollRef}
          className="hide-scrollbar flex gap-3 overflow-x-auto px-4 lg:px-8"
        >
          {items.map((item) => {
            const type = mediaType || (item.media_type as "movie" | "tv") || "movie"
            return (
              <div key={item.id} className="w-[140px] flex-shrink-0 sm:w-[160px] lg:w-[185px]">
                <MediaCard
                  id={item.id}
                  title={item.title || item.name || ""}
                  posterPath={item.poster_path}
                  voteAverage={item.vote_average}
                  mediaType={type}
                  releaseDate={item.release_date || item.first_air_date}
                />
              </div>
            )
          })}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute top-1/2 right-1 z-10 -translate-y-1/2 rounded-full bg-violet-900/70 p-2 text-foreground opacity-0 backdrop-blur-sm transition-opacity hover:bg-violet-800/80 group-hover:opacity-100"
          aria-label="Defiler vers la droite"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  )
}
