"use client"

import React, { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { X, Radio } from "lucide-react"

interface Channel {
  name: string
  logo: string
  url: string
  category: string
}

const CHANNELS: Channel[] = [
  {
    name: "Automoto",
    logo: "https://upload.wikimedia.org/wikipedia/fr/8/86/Logo_Automoto_2018.jpg",
    url: "https://wwembed.wavewatch.xyz/api/v1/live/ww-live-a639290c-e6c8-4dc6-9081-048c7ccc30b8",
    category: "Sport Auto",
  },
  {
    name: "beIN Sport 1",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX2U-OmZOSNn4UWVxAQlLRSijBFmvdq7L0IAHf6q1mtw&s=10",
    url: "https://wwembed.wavewatch.xyz/api/v1/live/ww-live-cc0461f5-90ca-4cb1-a3bf-5152cf2577e0",
    category: "beIN Sports",
  },
  {
    name: "beIN Sport 2",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX2U-OmZOSNn4UWVxAQlLRSijBFmvdq7L0IAHf6q1mtw&s=10",
    url: "https://wwembed.wavewatch.xyz/api/v1/live/ww-live-1a8daa4c-e28b-468b-b124-e4e995180673",
    category: "beIN Sports",
  },
  {
    name: "beIN Sport 3",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX2U-OmZOSNn4UWVxAQlLRSijBFmvdq7L0IAHf6q1mtw&s=10",
    url: "https://wwembed.wavewatch.xyz/api/v1/live/ww-live-321613ac-eb73-4b76-844b-ccc097951b0a",
    category: "beIN Sports",
  },
  {
    name: "Canal+",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsU3lAeFyGPaq3edPYRdEckbjuQiFPud2moxgWvVSTkQ&s=10",
    url: "https://wwembed.wavewatch.xyz/api/v1/live/ww-live-0ef6f591-718f-41a8-ae8c-6a28814c8c32",
    category: "Canal+",
  },
  {
    name: "Canal+ Sport",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuG8AKRMVpJMiKo-OhFaDG_KulnFez_N77NyPbqpT0lw&s=10",
    url: "https://wwembed.wavewatch.xyz/api/v1/live/ww-live-bf914486-1e83-4381-8d97-52cc5160d658",
    category: "Canal+ Sport",
  },
  {
    name: "Canal+ Sport 1",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuG8AKRMVpJMiKo-OhFaDG_KulnFez_N77NyPbqpT0lw&s=10",
    url: "https://wwembed.wavewatch.xyz/api/v1/live/ww-live-d97bede9-8e84-4d7a-95ce-cc7d1b9da6d2",
    category: "Canal+ Sport",
  },
  {
    name: "Canal+ Sport 360",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuG8AKRMVpJMiKo-OhFaDG_KulnFez_N77NyPbqpT0lw&s=10",
    url: "https://wwembed.wavewatch.xyz/api/v1/live/ww-live-40d79109-da6a-4804-925b-4dc539d2a492",
    category: "Canal+ Sport",
  },
  {
    name: "Canal+ Foot",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOQerbbbbiGR5X3zbSrz-lesIWm5EntHrkvXs_ac6yWg&s=10",
    url: "https://wwembed.wavewatch.xyz/api/v1/live/ww-live-3a38bf24-6572-4b1e-b43a-a4d57e9c72ca",
    category: "Canal+ Foot",
  },
]

const CATEGORIES = ["Tous", ...Array.from(new Set(CHANNELS.map(c => c.category)))]

export default function LiveSportPage() {
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null)
  const [activeCategory, setActiveCategory] = useState("Tous")

  const filtered = activeCategory === "Tous" ? CHANNELS : CHANNELS.filter(c => c.category === activeCategory)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <Radio className="h-7 w-7 text-red-500" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Live Sport</h1>
              <p className="text-muted-foreground">Regardez vos chaines sportives en direct</p>
            </div>
          </div>

          {/* Category filter */}
          <div className="mb-8 flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
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

          {/* Channel Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((channel) => (
              <button
                key={channel.name}
                onClick={() => setActiveChannel(channel)}
                className="group flex flex-col items-center gap-3 rounded-xl border border-violet-800/20 bg-card p-5 transition-all hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-900/20 hover:scale-[1.03]"
              >
                <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-secondary">
                  <Image
                    src={channel.logo}
                    alt={channel.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="text-center text-sm font-medium text-foreground group-hover:text-violet-400 transition-colors">
                  {channel.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  <span className="text-xs text-red-400">EN DIRECT</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Player Modal */}
        {activeChannel && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="relative mx-4 w-full max-w-5xl">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
                  <h2 className="text-lg font-semibold text-white">{activeChannel.name}</h2>
                  <span className="rounded bg-red-600/30 px-2 py-0.5 text-xs font-semibold text-red-300">LIVE</span>
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
