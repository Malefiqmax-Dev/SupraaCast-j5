import { getTVDetails, getTVSeasonDetails } from "@/lib/tmdb"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MediaRow } from "@/components/media-row"
import { TVDetailClient } from "./tv-detail-client"

interface Props {
  params: Promise<{ id: string }>
}

export default async function TVPage({ params }: Props) {
  const { id } = await params
  const tvId = Number(id)
  const show = await getTVDetails(tvId)

  const seasonDetails = await Promise.all(
    show.seasons
      .filter((s: { season_number: number }) => s.season_number > 0)
      .map((s: { season_number: number }) =>
        getTVSeasonDetails(tvId, s.season_number)
      )
  )

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <TVDetailClient show={show} seasonDetails={seasonDetails} />
      {show.similar?.results?.length > 0 && (
        <div className="pb-8">
          <MediaRow
            title="Series similaires"
            items={show.similar.results}
            mediaType="tv"
          />
        </div>
      )}
      <Footer />
    </main>
  )
}
