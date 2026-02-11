import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MediaCard } from "@/components/media-card"
import { searchMulti } from "@/lib/tmdb"

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q || ""

  let results: {
    id: number
    title?: string
    name?: string
    poster_path: string | null
    vote_average: number
    media_type: string
    release_date?: string
    first_air_date?: string
  }[] = []

  if (query) {
    const data = await searchMulti(query)
    results = data.results.filter(
      (item: { media_type: string }) =>
        item.media_type === "movie" || item.media_type === "tv"
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="px-4 pt-24 pb-12 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-foreground lg:text-4xl">
          Recherche
        </h1>
        {query && (
          <p className="mt-2 text-muted-foreground">
            Resultats pour{" "}
            <span className="font-medium text-violet-400">{`"${query}"`}</span>
          </p>
        )}

        {!query && (
          <p className="mt-8 text-center text-muted-foreground">
            Entrez un terme de recherche pour trouver des films et series.
          </p>
        )}

        {query && results.length === 0 && (
          <p className="mt-8 text-center text-muted-foreground">
            Aucun resultat pour cette recherche.
          </p>
        )}

        {results.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {results.map((item) => (
              <MediaCard
                key={item.id}
                id={item.id}
                title={item.title || item.name || ""}
                posterPath={item.poster_path}
                voteAverage={item.vote_average}
                mediaType={item.media_type as "movie" | "tv"}
                releaseDate={item.release_date || item.first_air_date}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}
