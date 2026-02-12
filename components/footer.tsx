import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-violet-900/20 bg-background">
      <div className="mx-auto flex flex-col items-center gap-4 px-4 py-8 text-center lg:px-8">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="SupraaCast"
            width={140}
            height={32}
            className="h-7 w-auto"
          />
        </Link>
        <p className="text-sm text-muted-foreground">
          Votre plateforme de streaming pour films et series.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Accueil
          </Link>
          <Link href="/movies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Films
          </Link>
          <Link href="/tv" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Series
          </Link>
        </div>
        <p className="text-xs text-muted-foreground/50">
          {"SupraaCast"} {new Date().getFullYear()}. Donnees fournies par TMDB.
        </p>
      </div>
    </footer>
  )
}
