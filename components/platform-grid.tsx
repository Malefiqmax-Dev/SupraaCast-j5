"use client"

import Link from "next/link"
import { STREAMING_PROVIDERS } from "@/lib/tmdb"
import { getPlatformLogo } from "@/components/platform-logos"

const PROVIDER_GRADIENTS: Record<string, string> = {
  netflix: "from-[#8B0000] via-[#5C1018] to-[#1a0a12]",
  "disney-plus": "from-[#0B1E7A] via-[#1530A8] to-[#0a0e3a]",
  max: "from-[#4B0082] via-[#2E0854] to-[#0e0320]",
  "prime-video": "from-[#00495C] via-[#004E6A] to-[#001a24]",
  "apple-tv-plus": "from-[#1a1a3e] via-[#0d0d30] to-[#08081a]",
  "paramount-plus": "from-[#003399] via-[#0044B8] to-[#001040]",
  "canal-plus": "from-[#1a1a2e] via-[#16162a] to-[#0a0a18]",
  crunchyroll: "from-[#7A3400] via-[#5C2800] to-[#1a0e00]",
}

export function PlatformGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {STREAMING_PROVIDERS.map((provider) => (
        <Link
          key={provider.id}
          href={`/platforms/${provider.slug}`}
          className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-violet-800/20 p-8 transition-all duration-300 hover:border-violet-600/40 hover:shadow-xl hover:shadow-violet-900/30 hover:-translate-y-1 min-h-[180px] sm:min-h-[200px]"
        >
          {/* Gradient background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${PROVIDER_GRADIENTS[provider.slug] || "from-violet-900 to-violet-950"} opacity-90 transition-opacity duration-300 group-hover:opacity-100`}
          />
          {/* Subtle inner glow */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-20"
            style={{
              background: `radial-gradient(ellipse at center, ${provider.color}, transparent 70%)`,
            }}
          />

          {/* Logo */}
          <div className="relative z-10 flex items-center justify-center text-3xl text-white sm:text-4xl">
            {getPlatformLogo(provider.slug, "h-10 w-auto sm:h-12")}
          </div>

          {/* Name */}
          <span className="relative z-10 mt-4 text-sm font-medium text-white/70 transition-colors group-hover:text-white">
            {provider.name}
          </span>
        </Link>
      ))}
    </div>
  )
}
