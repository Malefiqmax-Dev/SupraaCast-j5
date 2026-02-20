"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Film, Tv, Loader2 } from "lucide-react"
import { MediaCard } from "@/components/media-card"
import { getPlatformLogo } from "@/components/platform-logos"

interface Movie {
  id: number
  title: string
  poster_path: string | null
  vote_average: number
  release_date?: string
}

interface TVShow {
  id: number
  name: string
  poster_path: string | null
  vote_average: number
  first_air_date?: string
}

interface Provider {
  readonly id: number
  readonly name: string
  readonly slug: string
  readonly color: string
}

interface PlatformCatalogProps {
  provider: Provider
  movies: Movie[]
  tvShows: TVShow[]
  totalMoviePages: number
  totalTVPages: number
}

export function PlatformCatalog({
  provider,
  movies: initialMovies,
  tvShows: initialTV,
  totalMoviePages,
  totalTVPages,
}: PlatformCatalogProps) {
  const [tab, setTab] = useState<"movies" | "tv">("movies")
  const [movies, setMovies] = useState<Movie[]>(initialMovies)
  const [tvShows, setTVShows] = useState<TVShow[]>(initialTV)
  const [moviePage, setMoviePage] = useState(1)
  const [tvPage, setTVPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  const loadMoreMovies = useCallback(async () => {
    if (moviePage >= totalMoviePages || loadingMore) return
    setLoadingMore(true)
    try {
      const nextPage = moviePage + 1
      const res = await fetch(
        `/api/platforms/discover?provider=${provider.id}&type=movie&page=${nextPage}`
      )
      const data = await res.json()
      if (data.results) {
        const sorted = [...data.results].sort(
          (a: Movie, b: Movie) => (a.title || "").localeCompare(b.title || "", "fr")
        )
        setMovies((prev) => [...prev, ...sorted])
        setMoviePage(nextPage)
      }
    } finally {
      setLoadingMore(false)
    }
  }, [moviePage, totalMoviePages, loadingMore, provider.id])

  const loadMoreTV = useCallback(async () => {
    if (tvPage >= totalTVPages || loadingMore) return
    setLoadingMore(true)
    try {
      const nextPage = tvPage + 1
      const res = await fetch(
        `/api/platforms/discover?provider=${provider.id}&type=tv&page=${nextPage}`
      )
      const data = await res.json()
      if (data.results) {
        const sorted = [...data.results].sort(
          (a: TVShow, b: TVShow) => (a.name || "").localeCompare(b.name || "", "fr")
        )
        setTVShows((prev) => [...prev, ...sorted])
        setTVPage(nextPage)
      }
    } finally {
      setLoadingMore(false)
    }
  }, [tvPage, totalTVPages, loadingMore, provider.id])

  const currentItems = tab === "movies" ? movies : tvShows
  const hasMore =
    tab === "movies" ? moviePage < totalMoviePages : tvPage < totalTVPages

  return (
    <div className="px-4 pt-24 pb-12 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/platforms"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux plateformes
        </Link>
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl text-lg"
            style={{ backgroundColor: `${provider.color}20`, border: `1px solid ${provider.color}40` }}
          >
            {getPlatformLogo(provider.slug, "h-7 w-auto")}
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
              {provider.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Catalogue des films et series sur {provider.name}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-2">
        <button
          onClick={() => setTab("movies")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            tab === "movies"
              ? "bg-violet-600 text-white"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
          }`}
        >
          <Film className="h-4 w-4" />
          Films ({movies.length})
        </button>
        <button
          onClick={() => setTab("tv")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            tab === "tv"
              ? "bg-violet-600 text-white"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
          }`}
        >
          <Tv className="h-4 w-4" />
          Series ({tvShows.length})
        </button>
      </div>

      {/* Grid */}
      {currentItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg font-medium text-muted-foreground">
            Aucun contenu disponible pour le moment.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {tab === "movies"
              ? movies.map((movie) => (
                  <MediaCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    posterPath={movie.poster_path}
                    voteAverage={movie.vote_average}
                    mediaType="movie"
                    releaseDate={movie.release_date}
                  />
                ))
              : tvShows.map((show) => (
                  <MediaCard
                    key={show.id}
                    id={show.id}
                    title={show.name}
                    posterPath={show.poster_path}
                    voteAverage={show.vote_average}
                    mediaType="tv"
                    releaseDate={show.first_air_date}
                  />
                ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={tab === "movies" ? loadMoreMovies : loadMoreTV}
                disabled={loadingMore}
                className="flex items-center gap-2 rounded-lg bg-secondary px-6 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-secondary/80 disabled:opacity-50"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  "Charger plus"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
