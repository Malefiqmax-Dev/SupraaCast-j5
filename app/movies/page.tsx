import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MediaCard } from "@/components/media-card"
import { getPopularMovies, getTopRatedMovies, getNowPlayingMovies } from "@/lib/tmdb"

export default async function MoviesPage() {
  const [popular, topRated, nowPlaying] = await Promise.all([
    getPopularMovies(),
    getTopRatedMovies(),
    getNowPlayingMovies(),
  ])

  const allMovies = [
    ...popular.results,
    ...topRated.results,
    ...nowPlaying.results,
  ]

  const uniqueMovies = allMovies.filter(
    (movie: { id: number }, index: number, self: { id: number }[]) =>
      self.findIndex((m) => m.id === movie.id) === index
  )

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="px-4 pt-24 pb-12 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
          Films
        </h1>
        <p className="mt-2 text-muted-foreground">
          Decouvrez notre selection de films populaires, les mieux notes et en salle.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {uniqueMovies.map(
            (movie: {
              id: number
              title: string
              poster_path: string | null
              vote_average: number
              release_date: string
            }) => (
              <MediaCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                voteAverage={movie.vote_average}
                mediaType="movie"
                releaseDate={movie.release_date}
              />
            )
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
