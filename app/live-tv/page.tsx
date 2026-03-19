"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { X, Tv, RefreshCw, ChevronRight, Globe, Music, Trophy, Newspaper, Film, Gamepad2, Baby, Heart } from "lucide-react"

interface TVChannel {
  id: string
  name: string
  logo: string
  url: string
  category?: string
  country?: string
}

const COUNTRY_FLAGS: Record<string, string> = {
  FR: "🇫🇷",
  US: "🇺🇸",
  UK: "🇬🇧",
  ES: "🇪🇸",
  DE: "🇩🇪",
  IT: "🇮🇹",
  PT: "🇵🇹",
  BR: "🇧🇷",
  MA: "🇲🇦",
  DZ: "🇩🇿",
  TN: "🇹🇳",
  BE: "🇧🇪",
  CH: "🇨🇭",
  CA: "🇨🇦",
  AR: "🇸🇦",
  TR: "🇹🇷",
  RU: "🇷🇺",
  JP: "🇯🇵",
  KR: "🇰🇷",
  IN: "🇮🇳",
  CN: "🇨🇳",
}

const COUNTRY_NAMES: Record<string, string> = {
  FR: "France",
  US: "Etats-Unis",
  UK: "Royaume-Uni",
  ES: "Espagne",
  DE: "Allemagne",
  IT: "Italie",
  PT: "Portugal",
  BR: "Bresil",
  MA: "Maroc",
  DZ: "Algerie",
  TN: "Tunisie",
  BE: "Belgique",
  CH: "Suisse",
  CA: "Canada",
  AR: "Arabie Saoudite",
  TR: "Turquie",
  RU: "Russie",
  JP: "Japon",
  KR: "Coree du Sud",
  IN: "Inde",
  CN: "Chine",
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Sport: <Trophy className="h-4 w-4" />,
  Musique: <Music className="h-4 w-4" />,
  Info: <Newspaper className="h-4 w-4" />,
  Information: <Newspaper className="h-4 w-4" />,
  News: <Newspaper className="h-4 w-4" />,
  Cinema: <Film className="h-4 w-4" />,
  Film: <Film className="h-4 w-4" />,
  Divertissement: <Gamepad2 className="h-4 w-4" />,
  Enfants: <Baby className="h-4 w-4" />,
  Kids: <Baby className="h-4 w-4" />,
  Documentaire: <Globe className="h-4 w-4" />,
  Lifestyle: <Heart className="h-4 w-4" />,
  Generaliste: <Tv className="h-4 w-4" />,
}

export default function LiveTVPage() {
  const [channels, setChannels] = useState<TVChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeChannel, setActiveChannel] = useState<TVChannel | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
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
    const interval = setInterval(fetchChannels, 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Get unique countries
  const countries = useMemo(() => {
    const countrySet = new Set(channels.map(c => c.country || "Autre"))
    return Array.from(countrySet).sort((a, b) => {
      if (a === "FR") return -1
      if (b === "FR") return 1
      return (COUNTRY_NAMES[a] || a).localeCompare(COUNTRY_NAMES[b] || b)
    })
  }, [channels])

  // Get categories for selected country
  const categoriesForCountry = useMemo(() => {
    if (!selectedCountry) return []
    const filtered = channels.filter(c => (c.country || "Autre") === selectedCountry)
    const catSet = new Set(filtered.map(c => c.category || "Generaliste"))
    return Array.from(catSet).sort()
  }, [channels, selectedCountry])

  // Get filtered channels
  const filteredChannels = useMemo(() => {
    if (!selectedCountry) return []
    let filtered = channels.filter(c => (c.country || "Autre") === selectedCountry)
    if (selectedCategory) {
      filtered = filtered.filter(c => (c.category || "Generaliste") === selectedCategory)
    }
    return filtered.sort((a, b) => a.name.localeCompare(b.name))
  }, [channels, selectedCountry, selectedCategory])

  // Count channels per country
  const countryChannelCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const ch of channels) {
      const country = ch.country || "Autre"
      counts[country] = (counts[country] || 0) + 1
    }
    return counts
  }, [channels])

  // Count channels per category for selected country
  const categoryChannelCounts = useMemo(() => {
    if (!selectedCountry) return {}
    const counts: Record<string, number> = {}
    const filtered = channels.filter(c => (c.country || "Autre") === selectedCountry)
    for (const ch of filtered) {
      const cat = ch.category || "Generaliste"
      counts[cat] = (counts[cat] || 0) + 1
    }
    return counts
  }, [channels, selectedCountry])

  function handleBack() {
    if (selectedCategory) {
      setSelectedCategory(null)
    } else if (selectedCountry) {
      setSelectedCountry(null)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Header */}
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

          {/* Breadcrumb */}
          {(selectedCountry || selectedCategory) && (
            <div className="mb-6 flex items-center gap-2 text-sm">
              <button onClick={() => { setSelectedCountry(null); setSelectedCategory(null) }} className="text-violet-400 hover:underline">
                Pays
              </button>
              {selectedCountry && (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <button onClick={() => setSelectedCategory(null)} className={selectedCategory ? "text-violet-400 hover:underline" : "text-foreground"}>
                    {COUNTRY_FLAGS[selectedCountry] || ""} {COUNTRY_NAMES[selectedCountry] || selectedCountry}
                  </button>
                </>
              )}
              {selectedCategory && (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{selectedCategory}</span>
                </>
              )}
            </div>
          )}

          {/* Back button */}
          {(selectedCountry || selectedCategory) && (
            <button
              onClick={handleBack}
              className="mb-6 flex items-center gap-2 rounded-lg border border-violet-800/30 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Retour
            </button>
          )}

          {/* Loading state */}
          {loading && channels.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-8 w-8 animate-spin text-violet-500" />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="rounded-xl border border-red-800/30 bg-red-900/10 p-6 text-center">
              <p className="text-red-400">{error}</p>
              <button onClick={fetchChannels} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">
                Reessayer
              </button>
            </div>
          )}

          {/* Step 1: Select Country */}
          {!loading && !error && !selectedCountry && (
            <>
              <h2 className="mb-4 text-xl font-semibold text-foreground">Choisissez un pays</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => setSelectedCountry(country)}
                    className="group flex flex-col items-center gap-3 rounded-xl border border-violet-800/20 bg-card p-6 transition-all hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-900/20 hover:scale-[1.03]"
                  >
                    <span className="text-4xl">{COUNTRY_FLAGS[country] || "🌍"}</span>
                    <span className="text-sm font-medium text-foreground group-hover:text-violet-400">
                      {COUNTRY_NAMES[country] || country}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {countryChannelCounts[country] || 0} chaines
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2: Select Category (after country selected) */}
          {!loading && !error && selectedCountry && !selectedCategory && (
            <>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                {COUNTRY_FLAGS[selectedCountry]} {COUNTRY_NAMES[selectedCountry] || selectedCountry} - Choisissez une categorie
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {categoriesForCountry.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="group flex flex-col items-center gap-3 rounded-xl border border-violet-800/20 bg-card p-6 transition-all hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-900/20 hover:scale-[1.03]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600/20 text-violet-400">
                      {CATEGORY_ICONS[cat] || <Tv className="h-5 w-5" />}
                    </div>
                    <span className="text-sm font-medium text-foreground group-hover:text-violet-400">
                      {cat}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {categoryChannelCounts[cat] || 0} chaines
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 3: Show Channels (after category selected) */}
          {!loading && !error && selectedCountry && selectedCategory && (
            <>
              <h2 className="mb-4 text-xl font-semibold text-foreground">
                {COUNTRY_FLAGS[selectedCountry]} {selectedCategory} - {filteredChannels.length} chaines
              </h2>
              {filteredChannels.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {filteredChannels.map((channel) => (
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
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                        <span className="text-[10px] text-green-400">EN DIRECT</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="py-20 text-center text-muted-foreground">
                  Aucune chaine disponible dans cette categorie.
                </p>
              )}
            </>
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
