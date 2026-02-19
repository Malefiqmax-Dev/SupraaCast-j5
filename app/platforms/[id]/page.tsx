import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MediaCard } from "@/components/media-card"
import { discoverByNetwork } from "@/lib/tmdb"
import { notFound } from "next/navigation"

const PLATFORMS: Record<string, { name: string; networkId: number }> = {
  netflix: { name: "Netflix", networkId: 213 },
  disney: { name: "Disney+", networkId: 2739 },
  hbo: { name: "HBO", networkId: 49 },
  prime: { name: "Prime Video", networkId: 1024 },
  apple: { name: "Apple TV+", networkId: 2552 },
  paramount: { name: "Paramount+", networkId: 4330 },
}

export default async function PlatformDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const platform = PLATFORMS[id]
  if (!platform) notFound()

  const data = await discoverByNetwork(platform.networkId)
  const results = (data.results || []).sort((a: { name?: string; title?: string }, b: { name?: string; title?: string }) => {
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
            {results.length} titres disponibles - ordre alphabetique
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {results.map((item: { id: number; name?: string; title?: string; poster_path: string | null; vote_average: number; media_type?: string }) => (
              <MediaCard
                key={item.id}
                id={item.id}
                title={item.name || item.title || ""}
                posterPath={item.poster_path}
                voteAverage={item.vote_average}
                mediaType="tv"
              />
            ))}
          </div>
          {results.length === 0 && (
            <p className="py-20 text-center text-muted-foreground">Aucun contenu disponible pour cette plateforme.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
