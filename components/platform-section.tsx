"use client"

import Link from "next/link"
import { STREAMING_PROVIDERS } from "@/lib/tmdb"
import { getPlatformLogo } from "@/components/platform-logos"

export function PlatformSection() {
  return (
    <section className="py-10 px-4 lg:px-8">
      <h2 className="mb-2 font-display text-xl font-bold text-foreground lg:text-2xl">
        Explorer par plateforme
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Retrouvez les films et series disponibles sur votre plateforme preferee.
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {STREAMING_PROVIDERS.map((provider) => (
          <Link
            key={provider.id}
            href={`/platforms/${provider.slug}`}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-violet-800/20 bg-card p-6 transition-all duration-300 hover:border-violet-600/40 hover:shadow-lg hover:shadow-violet-900/20 hover:-translate-y-1"
          >
            {/* Subtle glow on hover using the provider's brand color */}
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-[0.06]"
              style={{ backgroundColor: provider.color }}
            />
            <div className="relative z-10 flex h-12 items-center justify-center text-xl">
              {getPlatformLogo(provider.slug, "h-8 w-auto")}
            </div>
            <span className="relative z-10 mt-3 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
              {provider.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
