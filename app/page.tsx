import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroBanner } from "@/components/hero-banner"
import { MediaRow } from "@/components/media-row"
import {
  getTrending,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getPopularTV,
  getTopRatedTV,
} from "@/lib/tmdb"

export default async function HomePage() {
  const [trending, popularMovies, topRatedMovies, nowPlaying, popularTV, topRatedTV] =
    await Promise.all([
      getTrending("all", "week"),
      getPopularMovies(),
      getTopRatedMovies(),
      getNowPlayingMovies(),
      getPopularTV(),
      getTopRatedTV(),
    ])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroBanner items={trending.results} />
      <div className="-mt-16 relative z-10">
        <MediaRow title="Tendances de la semaine" items={trending.results} />
        <MediaRow title="Films populaires" items={popularMovies.results} mediaType="movie" />
        <MediaRow title="Films les mieux notes" items={topRatedMovies.results} mediaType="movie" />
        <MediaRow title="En salle actuellement" items={nowPlaying.results} mediaType="movie" />
        <MediaRow title="Series populaires" items={popularTV.results} mediaType="tv" />
        <MediaRow title="Series les mieux notees" items={topRatedTV.results} mediaType="tv" />
      </div>
      <Footer />
    </main>
  )
}
