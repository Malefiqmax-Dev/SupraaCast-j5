import { getMovieDetails } from "@/lib/tmdb"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MediaRow } from "@/components/media-row"
import { MovieDetailClient } from "./movie-detail-client"

interface Props {
  params: Promise<{ id: string }>
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params
  const movie = await getMovieDetails(Number(id))

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <MovieDetailClient movie={movie} />
      {movie.similar?.results?.length > 0 && (
        <div className="pb-8">
          <MediaRow
            title="Films similaires"
            items={movie.similar.results}
            mediaType="movie"
          />
        </div>
      )}
      <Footer />
    </main>
  )
}
