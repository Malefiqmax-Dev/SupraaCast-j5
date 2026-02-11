"use client"

import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { getImageUrl } from "@/lib/tmdb"

interface MediaCardProps {
  id: number
  title: string
  posterPath: string | null
  voteAverage: number
  mediaType: "movie" | "tv"
  releaseDate?: string
}

export function MediaCard({
  id,
  title,
  posterPath,
  voteAverage,
  mediaType,
  releaseDate,
}: MediaCardProps) {
  const imageUrl = getImageUrl(posterPath, "w342")
  const href = mediaType === "movie" ? `/movie/${id}` : `/tv/${id}`
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null

  return (
    <Link href={href} className="group flex-shrink-0">
      <div className="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105">
        <div className="relative aspect-[2/3] w-full">
          {imageUrl ? (
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 200px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <span className="text-sm text-muted-foreground">No Image</span>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-violet-400 text-violet-400" />
            <span className="text-xs font-medium text-foreground">
              {voteAverage.toFixed(1)}
            </span>
          </div>
        </div>
        <div className="absolute top-2 right-2 rounded-md bg-violet-600/80 px-1.5 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
          {mediaType === "movie" ? "Film" : "Serie"}
        </div>
      </div>
      <div className="mt-2 px-1">
        <h3 className="truncate text-sm font-medium text-foreground">{title}</h3>
        {year && (
          <p className="text-xs text-muted-foreground">{year}</p>
        )}
      </div>
    </Link>
  )
}
