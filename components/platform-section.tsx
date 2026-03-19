"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
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

export function PlatformSection() {
  return (
    <section className="py-10 px-4 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground lg:text-2xl">
            Plateformes de streaming
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Explorez le catalogue de vos services preferes
          </p>
        </div>
        <Link
          href="/platforms"
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-violet-400 transition-colors hover:bg-secondary hover:text-violet-300"
        >
          Voir tout
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {STREAMING_PROVIDERS.slice(0, 8).map((provider) => (
          <Link
            key={provider.id}
            href={`/platforms/${provider.slug}`}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-violet-800/20 p-5 transition-all duration-300 hover:border-violet-600/40 hover:shadow-lg hover:shadow-violet-900/20 hover:-translate-y-1 min-h-[120px]"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${PROVIDER_GRADIENTS[provider.slug] || "from-violet-900 to-violet-950"} opacity-90 transition-opacity duration-300 group-hover:opacity-100`}
            />
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-20"
              style={{
                background: `radial-gradient(ellipse at center, ${provider.color}, transparent 70%)`,
              }}
            />
            <div className="relative z-10 flex items-center justify-center text-xl text-white sm:text-2xl">
              {getPlatformLogo(provider.slug, "h-6 w-auto sm:h-8")}
            </div>
            <span className="relative z-10 mt-2 text-xs font-medium text-white/60 transition-colors group-hover:text-white/90">
              {provider.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
