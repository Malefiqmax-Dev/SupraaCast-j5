const TMDB_TOKEN = process.env.TMDB_API_TOKEN || "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YTAxNWFmZjM3ZjM5ODY5NzM5ODk3YWUzZGNlZmU5MiIsIm5iZiI6MTc3MDg0MjcxNi45ODgsInN1YiI6IjY5OGNlYTVjNDFjOTYwZGNjZmIzMGYwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rq0-m_bJcToSKDOJpaL0U0L3xfLfNut9zD5rCm2clak"
const BASE_URL = "https://api.themoviedb.org/3"

async function tmdbFetch(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.set("language", "fr-FR")
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      "Content-Type": "application/json;charset=utf-8",
    },
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status}`)
  }

  return res.json()
}

export async function getTrending(mediaType: "movie" | "tv" | "all" = "all", timeWindow: "day" | "week" = "week") {
  return tmdbFetch(`/trending/${mediaType}/${timeWindow}`)
}

export async function getPopularMovies(page = 1) {
  return tmdbFetch("/movie/popular", { page: String(page) })
}

export async function getTopRatedMovies(page = 1) {
  return tmdbFetch("/movie/top_rated", { page: String(page) })
}

export async function getNowPlayingMovies(page = 1) {
  return tmdbFetch("/movie/now_playing", { page: String(page) })
}

export async function getPopularTV(page = 1) {
  return tmdbFetch("/tv/popular", { page: String(page) })
}

export async function getTopRatedTV(page = 1) {
  return tmdbFetch("/tv/top_rated", { page: String(page) })
}

export async function getMovieDetails(id: number) {
  return tmdbFetch(`/movie/${id}`, { append_to_response: "credits,similar,videos" })
}

export async function getTVDetails(id: number) {
  return tmdbFetch(`/tv/${id}`, { append_to_response: "credits,similar,videos" })
}

export async function getTVSeasonDetails(tvId: number, seasonNumber: number) {
  return tmdbFetch(`/tv/${tvId}/season/${seasonNumber}`)
}

export async function searchMulti(query: string, page = 1) {
  return tmdbFetch("/search/multi", { query, page: String(page) })
}

export async function getMovieGenres() {
  return tmdbFetch("/genre/movie/list")
}

export async function getTVGenres() {
  return tmdbFetch("/genre/tv/list")
}

export async function discoverByNetwork(networkId: number, page = 1) {
  return tmdbFetch("/discover/tv", { with_networks: String(networkId), page: String(page), sort_by: "name.asc" })
}

export async function discoverMoviesByCompany(companyId: number, page = 1) {
  return tmdbFetch("/discover/movie", { with_companies: String(companyId), page: String(page), sort_by: "title.asc" })
}

export function getImageUrl(path: string | null, size = "w500") {
  if (!path) return null
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export function getBackdropUrl(path: string | null) {
  return getImageUrl(path, "original")
}
