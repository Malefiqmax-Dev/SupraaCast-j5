import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MediaCard } from "@/components/media-card"
import { discoverByNetwork, discoverMoviesByCompany } from "@/lib/tmdb"
import { notFound } from "next/navigation"

const PLATFORMS: Record<string, { name: string; networkId: number; companyId: number }> = {
  netflix: { name: "Netflix", networkId: 213, companyId: 213 },
  disney: { name: "Disney+", networkId: 2739, companyId: 2 },
  hbo: { name: "HBO", networkId: 49, companyId: 7429 },
  prime: { name: "Prime Video", networkId: 1024, companyId: 9 },
  apple: { name: "Apple TV+", networkId: 2552, companyId: 420 },
  paramount: { name: "Paramount+", networkId: 4330, companyId: 4 },
}

interface MediaItem {
  id: number
  name?: string
  title?: string
  poster_path: string | null
  vote_average: number
  media_type?: string
}

export default async function PlatformDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const platform = PLATFORMS[id]
  if (!platform) notFound()

  // Fetch both TV shows and movies
  const [tvData, movieData] = await Promise.all([
    discoverByNetwork(platform.networkId),
    discoverMoviesByCompany(platform.companyId),
  ])

  // Combine and sort alphabetically
  const tvResults: MediaItem[] = (tvData.results || []).map((item: MediaItem) => ({ ...item, media_type: "tv" }))
  const movieResults: MediaItem[] = (movieData.results || []).map((item: MediaItem) => ({ ...item, media_type: "movie" }))
  
  const allResults = [...tvResults, ...movieResults].sort((a, b) => {
    const nameA = (a.name || a.title || "").toLowerCase()
    const nameB = (b.name || b.title || "").toLowerCase()
    return nameA.localeCompare(nameB)
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">{platform.name}</h1>
          <p className="mb-8 text-muted-foreground">
            {allResults.length} titres disponibles (films et series) - ordre alphabetique
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {allResults.map((item) => (
              <MediaCard
                key={`${item.media_type}-${item.id}`}
                id={item.id}
                title={item.name || item.title || ""}
                posterPath={item.poster_path}
                voteAverage={item.vote_average}
                mediaType={item.media_type as "movie" | "tv"}
              />
            ))}
          </div>
          {allResults.length === 0 && (
            <p className="py-20 text-center text-muted-foreground">Aucun contenu disponible pour cette plateforme.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
