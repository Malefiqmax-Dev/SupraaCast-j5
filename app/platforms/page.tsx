import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PlatformGrid } from "@/components/platform-grid"

export const metadata = {
  title: "Plateformes - SupraaCast",
  description: "Explorez le catalogue de vos services de streaming preferes.",
}

export default function PlatformsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="px-4 pt-24 pb-12 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-foreground lg:text-4xl text-balance">
          Plateformes
        </h1>
        <p className="mt-2 text-sm text-muted-foreground lg:text-base">
          Explorez le catalogue de vos services de streaming preferes
        </p>
        <div className="mt-8">
          <PlatformGrid />
        </div>
      </div>
      <Footer />
    </main>
  )
}
