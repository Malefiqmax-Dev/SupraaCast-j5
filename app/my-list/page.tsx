"use client"

import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Heart, Eye, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getImageUrl } from "@/lib/tmdb"
import { useState } from "react"

type Tab = "liked" | "watched"

export default function MyListPage() {
  const { user, likedItems, watchedItems, toggleLike, toggleWatched } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>("liked")

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="max-w-md text-center">
            <Heart className="mx-auto mb-4 h-16 w-16 text-violet-500/40" />
            <h1 className="font-display text-2xl font-bold text-foreground">
              Connectez-vous pour acceder a votre liste
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Creez un compte ou connectez-vous pour sauvegarder vos films et series preferes.
            </p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const items = activeTab === "liked" ? likedItems : watchedItems

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 pt-24 pb-12 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Ma Liste</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Retrouvez vos films et series aimes et regardes.
        </p>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 rounded-lg border border-violet-900/30 bg-card/50 p-1 w-fit">
          <button
            onClick={() => setActiveTab("liked")}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "liked"
                ? "bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className={`h-4 w-4 ${activeTab === "liked" ? "fill-current" : ""}`} />
            Aimes ({likedItems.length})
          </button>
          <button
            onClick={() => setActiveTab("watched")}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              activeTab === "watched"
                ? "bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className={`h-4 w-4 ${activeTab === "watched" ? "fill-current" : ""}`} />
            Regardes ({watchedItems.length})
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            {activeTab === "liked" ? (
              <Heart className="mb-4 h-12 w-12 text-violet-500/30" />
            ) : (
              <Eye className="mb-4 h-12 w-12 text-violet-500/30" />
            )}
            <p className="text-lg font-medium text-foreground">
              {activeTab === "liked" ? "Aucun favori pour le moment" : "Aucun contenu marque comme vu"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeTab === "liked"
                ? "Ajoutez des films et series a vos favoris depuis leur page de detail."
                : "Marquez les films et series comme vus depuis leur page de detail."}
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((item) => {
              const posterUrl = getImageUrl(item.poster_path, "w342")
              const href = item.type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`
              return (
                <div
                  key={`${item.type}-${item.id}`}
                  className="group relative overflow-hidden rounded-lg border border-violet-900/20 bg-card/50 transition-all hover:border-violet-700/40 hover:shadow-lg hover:shadow-violet-900/20"
                >
                  <Link href={href}>
                    <div className="relative aspect-[2/3] w-full">
                      {posterUrl ? (
                        <Image
                          src={posterUrl}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary text-xs text-muted-foreground">
                          Pas d{"'"}image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </Link>

                  {/* Remove button */}
                  <button
                    onClick={() =>
                      activeTab === "liked" ? toggleLike(item) : toggleWatched(item)
                    }
                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-red-400 opacity-0 transition-all hover:bg-red-950/80 group-hover:opacity-100"
                    aria-label="Retirer de la liste"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Type badge */}
                  <span className="absolute top-2 left-2 rounded-md bg-violet-600/80 px-2 py-0.5 text-[10px] font-semibold text-white uppercase">
                    {item.type === "movie" ? "Film" : "Serie"}
                  </span>

                  <div className="p-3">
                    <Link href={href}>
                      <h3 className="truncate text-sm font-semibold text-foreground transition-colors hover:text-violet-400">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Note : {item.vote_average.toFixed(1)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
