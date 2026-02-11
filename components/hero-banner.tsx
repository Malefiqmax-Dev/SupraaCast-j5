"use client"

import Image from "next/image"
import Link from "next/link"
import { Play, Info } from "lucide-react"
import { getBackdropUrl } from "@/lib/tmdb"
import { useState, useEffect } from "react"

interface HeroItem {
  id: number
  title?: string
  name?: string
  overview: string
  backdrop_path: string | null
  media_type?: string
  vote_average: number
}

interface HeroBannerProps {
  items: HeroItem[]
}

export function HeroBanner({ items }: HeroBannerProps) {
  const [current, setCurrent] = useState(0)
  const featured = items.slice(0, 5)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [featured.length])

  const item = featured[current]
  if (!item) return null

  const backdropUrl = getBackdropUrl(item.backdrop_path)
  const mediaType = item.media_type === "tv" ? "tv" : "movie"
  const detailUrl = mediaType === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`

  return (
    <div className="relative h-[70vh] w-full overflow-hidden lg:h-[80vh]">
      {backdropUrl && (
        <Image
          src={backdropUrl || "/placeholder.svg"}
          alt={item.title || item.name || ""}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 px-4 pb-16 lg:px-8 lg:pb-24">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
            {item.title || item.name}
          </h1>
          <p className="mt-3 line-clamp-3 text-sm text-foreground/80 sm:text-base lg:mt-4">
            {item.overview || "Aucune description disponible."}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <Link
              href={detailUrl}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-700 px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:from-violet-500 hover:to-violet-600"
            >
              <Play className="h-4 w-4 fill-current" />
              Regarder
            </Link>
            <Link
              href={detailUrl}
              className="flex items-center gap-2 rounded-lg bg-foreground/10 px-5 py-2.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:bg-foreground/20"
            >
              <Info className="h-4 w-4" />
              Plus d{"'"}infos
            </Link>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          {featured.map((_, index) => (
            <button
              key={featured[index].id}
              onClick={() => setCurrent(index)}
              className={`h-1 rounded-full transition-all ${
                index === current
                  ? "w-8 bg-violet-500"
                  : "w-4 bg-foreground/30 hover:bg-foreground/50"
              }`}
              aria-label={`Voir element ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
