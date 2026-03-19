import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PlatformCatalog } from "./platform-catalog"
import {
  discoverMoviesByProvider,
  discoverTVByProvider,
  getProviderBySlug,
  STREAMING_PROVIDERS,
} from "@/lib/tmdb"

export function generateStaticParams() {
  return STREAMING_PROVIDERS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const provider = getProviderBySlug(slug)
  if (!provider) return { title: "Plateforme introuvable - SupraaCast" }
  return {
    title: `${provider.name} - Catalogue | SupraaCast`,
    description: `Decouvrez tous les films et series disponibles sur ${provider.name}.`,
  }
}

export default async function PlatformPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const provider = getProviderBySlug(slug)

  if (!provider) {
    notFound()
  }

  const [moviesData, tvData] = await Promise.all([
    discoverMoviesByProvider(provider.id),
    discoverTVByProvider(provider.id),
  ])

  // Sort alphabetically
  const movies = [...(moviesData.results || [])].sort(
    (a: { title?: string }, b: { title?: string }) =>
      (a.title || "").localeCompare(b.title || "", "fr")
  )

  const tvShows = [...(tvData.results || [])].sort(
    (a: { name?: string }, b: { name?: string }) =>
      (a.name || "").localeCompare(b.name || "", "fr")
  )

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <PlatformCatalog
        provider={provider}
        movies={movies}
        tvShows={tvShows}
        totalMoviePages={moviesData.total_pages || 1}
        totalTVPages={tvData.total_pages || 1}
      />
      <Footer />
    </main>
  )
}
