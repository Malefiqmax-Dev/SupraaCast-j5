"use client"

import Image from "next/image"
import { Play, Download, Star, Calendar, ChevronDown, Heart, Eye } from "lucide-react"
import { getBackdropUrl, getImageUrl } from "@/lib/tmdb"
import { PlayerModal } from "@/components/player-modal"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"

interface Episode {
  id: number
  name: string
  overview: string
  episode_number: number
  season_number: number
  still_path: string | null
  air_date: string
  runtime: number | null
  vote_average: number
}

interface Season {
  season_number: number
  name: string
  episodes: Episode[]
}

interface TVDetailClientProps {
  show: {
    id: number
    name: string
    overview: string
    backdrop_path: string | null
    poster_path: string | null
    vote_average: number
    first_air_date: string
    number_of_seasons: number
    genres: { id: number; name: string }[]
    credits?: {
      cast: { id: number; name: string; character: string; profile_path: string | null }[]
    }
  }
  seasonDetails: Season[]
}

export function TVDetailClient({ show, seasonDetails }: TVDetailClientProps) {
  const [selectedSeason, setSelectedSeason] = useState(0)
  const [playerInfo, setPlayerInfo] = useState<{
    mode: "watch" | "download"
    season: number
    episode: number
    title: string
  } | null>(null)
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false)
  const { user, toggleLike, toggleWatched, isLiked, isWatched } = useAuth()

  const backdropUrl = getBackdropUrl(show.backdrop_path)
  const posterUrl = getImageUrl(show.poster_path, "w500")
  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : null

  const currentSeason = seasonDetails[selectedSeason]
  const episodes = currentSeason?.episodes || []

  const liked = isLiked(show.id, "tv")
  const watched = isWatched(show.id, "tv")

  const mediaItem = {
    id: show.id,
    type: "tv" as const,
    title: show.name,
    poster_path: show.poster_path,
    vote_average: show.vote_average,
  }

  function getStreamUrl(season: number, episode: number) {
    return `https://wwembed.wavewatch.xyz/api/v1/streaming/ww-tv-${show.id}-s${season}-e${episode}`
  }

  function getDownloadUrl(season: number, episode: number) {
    return `https://wwembed.wavewatch.xyz/api/v1/download/ww-tv-${show.id}-s${season}-e${episode}`
  }

  return (
    <>
      <div className="relative min-h-[80vh]">
        {backdropUrl && (
          <Image
            src={backdropUrl || "/placeholder.svg"}
            alt={show.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />

        <div className="relative flex min-h-[80vh] items-end px-4 pb-12 pt-24 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-end">
            {posterUrl && (
              <div className="hidden flex-shrink-0 md:block">
                <Image
                  src={posterUrl || "/placeholder.svg"}
                  alt={show.name}
                  width={260}
                  height={390}
                  className="rounded-lg shadow-2xl shadow-violet-950/50"
                />
              </div>
            )}
            <div className="max-w-2xl">
              <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl text-balance">
                {show.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-foreground/70">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-violet-400 text-violet-400" />
                  {show.vote_average.toFixed(1)}
                </span>
                {year && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {year}
                  </span>
                )}
                <span>{show.number_of_seasons} saison{show.number_of_seasons > 1 ? "s" : ""}</span>
              </div>

              {show.genres.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {show.genres.map((genre) => (
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
                {show.overview || "Aucune description disponible."}
              </p>

              {user && (
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => toggleLike(mediaItem)}
                    className={`flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold transition-all ${
                      liked
                        ? "border-pink-500/60 bg-pink-950/40 text-pink-400 hover:bg-pink-950/60"
                        : "border-violet-700/40 bg-violet-950/50 text-foreground hover:bg-violet-900/50"
                    }`}
                    aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    <Heart className={`h-5 w-5 ${liked ? "fill-pink-400" : ""}`} />
                    {liked ? "Aime" : "J'aime"}
                  </button>
                  <button
                    onClick={() => toggleWatched(mediaItem)}
                    className={`flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold transition-all ${
                      watched
                        ? "border-emerald-500/60 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-950/60"
                        : "border-violet-700/40 bg-violet-950/50 text-foreground hover:bg-violet-900/50"
                    }`}
                    aria-label={watched ? "Retirer de la liste" : "Marquer comme vu"}
                  >
                    <Eye className={`h-5 w-5 ${watched ? "fill-emerald-400" : ""}`} />
                    {watched ? "Vu" : "Marquer vu"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cast */}
      {show.credits?.cast && show.credits.cast.length > 0 && (
        <section className="px-4 py-6 lg:px-8">
          <h2 className="mb-4 font-display text-xl font-bold text-foreground">Casting</h2>
          <div className="hide-scrollbar flex gap-4 overflow-x-auto">
            {show.credits.cast.slice(0, 12).map((person) => (
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

      {/* Seasons & Episodes */}
      <section className="px-4 py-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">Episodes</h2>
          <div className="relative">
            <button
              onClick={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
              className="flex items-center gap-2 rounded-lg border border-violet-700/40 bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-violet-950/50"
            >
              {currentSeason?.name || `Saison ${selectedSeason + 1}`}
              <ChevronDown className={`h-4 w-4 transition-transform ${seasonDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {seasonDropdownOpen && (
              <div className="absolute right-0 top-full z-20 mt-1 max-h-60 w-48 overflow-y-auto rounded-lg border border-violet-700/40 bg-card shadow-xl">
                {seasonDetails.map((season, index) => (
                  <button
                    key={season.season_number}
                    onClick={() => {
                      setSelectedSeason(index)
                      setSeasonDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-violet-950/50 ${
                      index === selectedSeason ? "bg-violet-900/30 text-violet-300" : "text-foreground"
                    }`}
                  >
                    {season.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="group flex flex-col gap-4 rounded-lg border border-violet-900/20 bg-card/50 p-4 transition-colors hover:border-violet-700/40 hover:bg-card sm:flex-row"
            >
              <div className="relative aspect-video w-full flex-shrink-0 overflow-hidden rounded-md sm:w-48 lg:w-56">
                {episode.still_path ? (
                  <Image
                    src={getImageUrl(episode.still_path, "w300") || ""}
                    alt={episode.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 224px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground text-xs">
                    Pas d{"'"}image
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      <span className="text-violet-400">E{episode.episode_number}</span>{" "}
                      {episode.name}
                    </h3>
                    {episode.vote_average > 0 && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                        <Star className="h-3 w-3 fill-violet-400 text-violet-400" />
                        {episode.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                    {episode.overview || "Aucune description disponible."}
                  </p>
                  {episode.runtime && (
                    <p className="mt-1 text-xs text-muted-foreground">{episode.runtime} min</p>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() =>
                      setPlayerInfo({
                        mode: "watch",
                        season: episode.season_number,
                        episode: episode.episode_number,
                        title: `${show.name} - S${episode.season_number}E${episode.episode_number}`,
                      })
                    }
                    className="flex items-center gap-1.5 rounded-md bg-gradient-to-r from-violet-600 to-violet-700 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:from-violet-500 hover:to-violet-600"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Regarder
                  </button>
                  <button
                    onClick={() =>
                      setPlayerInfo({
                        mode: "download",
                        season: episode.season_number,
                        episode: episode.episode_number,
                        title: `${show.name} - S${episode.season_number}E${episode.episode_number}`,
                      })
                    }
                    className="flex items-center gap-1.5 rounded-md border border-violet-700/40 bg-violet-950/50 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:bg-violet-900/50"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Telecharger
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {playerInfo && (
        <PlayerModal
          url={
            playerInfo.mode === "watch"
              ? getStreamUrl(playerInfo.season, playerInfo.episode)
              : getDownloadUrl(playerInfo.season, playerInfo.episode)
          }
          title={playerInfo.title}
          onClose={() => setPlayerInfo(null)}
        />
      )}
    </>
  )
}
