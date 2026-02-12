"use client"

import Image from "next/image"
import { Play, Download, Star, Clock, Calendar } from "lucide-react"
import { getBackdropUrl, getImageUrl } from "@/lib/tmdb"
import { PlayerModal } from "@/components/player-modal"
import { useState } from "react"

interface MovieDetailClientProps {
  movie: {
    id: number
    title: string
    overview: string
    backdrop_path: string | null
    poster_path: string | null
    vote_average: number
    release_date: string
    runtime: number
    genres: { id: number; name: string }[]
    credits?: {
      cast: { id: number; name: string; character: string; profile_path: string | null }[]
    }
  }
}

export function MovieDetailClient({ movie }: MovieDetailClientProps) {
  const [playerMode, setPlayerMode] = useState<"watch" | "download" | null>(null)

  const backdropUrl = getBackdropUrl(movie.backdrop_path)
  const posterUrl = getImageUrl(movie.poster_path, "w500")
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null
  const hours = Math.floor(movie.runtime / 60)
  const minutes = movie.runtime % 60

  const watchUrl = `https://wwembed.wavewatch.xyz/api/v1/streaming/ww-movie-${movie.id}`
  const downloadUrl = `https://wwembed.wavewatch.xyz/api/v1/download/ww-movie-${movie.id}`

  return (
    <>
      <div className="relative min-h-[85vh]">
        {backdropUrl && (
          <Image
            src={backdropUrl || "/placeholder.svg"}
            alt={movie.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

        <div className="relative flex min-h-[85vh] items-end px-4 pb-12 pt-24 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-end">
            {posterUrl && (
              <div className="hidden flex-shrink-0 md:block">
                <Image
                  src={posterUrl || "/placeholder.svg"}
                  alt={movie.title}
                  width={260}
                  height={390}
                  className="rounded-lg shadow-2xl shadow-violet-950/50"
                />
              </div>
            )}
            <div className="max-w-2xl">
              <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
                {movie.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-foreground/70">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-violet-400 text-violet-400" />
                  {movie.vote_average.toFixed(1)}
                </span>
                {year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {year}
                  </span>
                )}
                {movie.runtime > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {hours}h {minutes}min
                  </span>
                )}
              </div>

              {movie.genres.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full border border-violet-700/40 bg-violet-950/50 px-3 py-1 text-xs text-violet-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-4 leading-relaxed text-foreground/80 text-sm lg:text-base">
                {movie.overview || "Aucune description disponible."}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setPlayerMode("watch")}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-3 text-sm font-semibold text-foreground transition-all hover:from-violet-500 hover:to-violet-600 hover:shadow-lg hover:shadow-violet-700/25"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Regarder
                </button>
                <button
                  onClick={() => setPlayerMode("download")}
                  className="flex items-center gap-2 rounded-lg border border-violet-700/40 bg-violet-950/50 px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-violet-900/50"
                >
                  <Download className="h-5 w-5" />
                  Telecharger
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {movie.credits?.cast && movie.credits.cast.length > 0 && (
        <section className="px-4 py-8 lg:px-8">
          <h2 className="mb-4 font-display text-xl font-bold text-foreground">Casting</h2>
          <div className="hide-scrollbar flex gap-4 overflow-x-auto">
            {movie.credits.cast.slice(0, 12).map((person) => (
              <div key={person.id} className="flex-shrink-0 text-center w-[100px]">
                <div className="relative mx-auto h-[100px] w-[100px] overflow-hidden rounded-full">
                  {person.profile_path ? (
                    <Image
                      src={getImageUrl(person.profile_path, "w185") || ""}
                      alt={person.name}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground text-xs">
                      N/A
                    </div>
                  )}
                </div>
                <p className="mt-2 truncate text-xs font-medium text-foreground">{person.name}</p>
                <p className="truncate text-xs text-muted-foreground">{person.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {playerMode && (
        <PlayerModal
          url={playerMode === "watch" ? watchUrl : downloadUrl}
          title={`${playerMode === "watch" ? "Regarder" : "Telecharger"} - ${movie.title}`}
          onClose={() => setPlayerMode(null)}
        />
      )}
    </>
  )
}
