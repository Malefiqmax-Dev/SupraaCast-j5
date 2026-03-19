"use client"

import React, { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { X, Tv, RefreshCw } from "lucide-react"

interface TVChannel {
  id: string
  name: string
  logo: string
  url: string
  category?: string
  country?: string
}

export default function LiveTVPage() {
  const [channels, setChannels] = useState<TVChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeChannel, setActiveChannel] = useState<TVChannel | null>(null)
  const [activeCategory, setActiveCategory] = useState("Tous")
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  async function fetchChannels() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch("/api/live-tv")
      if (!res.ok) throw new Error("Erreur de chargement")
      const data = await res.json()
      setChannels(data.channels || [])
      setLastUpdate(new Date())
    } catch {
      setError("Impossible de charger les chaines")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChannels()
    // Refresh every 15 minutes
    const interval = setInterval(fetchChannels, 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const categories = ["Tous", ...Array.from(new Set(channels.map(c => c.category || "Autre").filter(Boolean)))]
  const filtered = activeCategory === "Tous" 
    ? channels 
    : channels.filter(c => (c.category || "Autre") === activeCategory)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tv className="h-7 w-7 text-violet-500" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Live TV</h1>
                <p className="text-muted-foreground">
                  Regardez la television en direct
                  {lastUpdate && (
                    <span className="ml-2 text-xs text-violet-400">
                      Mis a jour: {lastUpdate.toLocaleTimeString("fr-FR")}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={fetchChannels}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-violet-800/30 bg-secondary px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-violet-600/20 hover:text-foreground disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Actualiser
            </button>
          </div>

          {/* Category filter */}
          {categories.length > 1 && (
            <div className="mb-8 flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25"
                      : "border border-violet-800/30 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading && channels.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-8 w-8 animate-spin text-violet-500" />
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-800/30 bg-red-900/10 p-6 text-center">
              <p className="text-red-400">{error}</p>
              <button
                onClick={fetchChannels}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Reessayer
              </button>
            </div>
          )}

          {/* Channel Grid */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {filtered.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel)}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-violet-800/20 bg-card p-4 transition-all hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-900/20 hover:scale-[1.03]"
                >
                  <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                    {channel.logo ? (
                      <Image
                        src={channel.logo}
                        alt={channel.name}
                        width={56}
                        height={56}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Tv className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-center text-xs font-medium text-foreground group-hover:text-violet-400 transition-colors line-clamp-2">
                    {channel.name}
                  </span>
                  {channel.category && (
                    <span className="text-[10px] text-muted-foreground">{channel.category}</span>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    <span className="text-[10px] text-green-400">EN DIRECT</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <p className="py-20 text-center text-muted-foreground">
              Aucune chaine disponible dans cette categorie.
            </p>
          )}
        </div>

        {/* Player Modal */}
        {activeChannel && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="relative mx-4 w-full max-w-5xl">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />
                  <h2 className="text-lg font-semibold text-white">{activeChannel.name}</h2>
                  <span className="rounded bg-green-600/30 px-2 py-0.5 text-xs font-semibold text-green-300">LIVE</span>
                </div>
                <button
                  onClick={() => setActiveChannel(null)}
                  className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-violet-800/30">
                <iframe
                  src={activeChannel.url}
                  className="h-full w-full"
                  allowFullScreen
                  allow="autoplay; encrypted-media"
                  title={activeChannel.name}
                />
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
