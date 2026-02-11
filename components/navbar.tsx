"use client"

import React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-violet-900/30"
          : "bg-gradient-to-b from-background/80 to-transparent"
      }`}
    >
      <div className="mx-auto flex items-center justify-between px-4 py-3 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
              SupraaCast
            </span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm text-foreground/70 transition-colors hover:text-foreground"
            >
              Accueil
            </Link>
            <Link
              href="/movies"
              className="text-sm text-foreground/70 transition-colors hover:text-foreground"
            >
              Films
            </Link>
            <Link
              href="/tv"
              className="text-sm text-foreground/70 transition-colors hover:text-foreground"
            >
              Series
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                autoFocus
                className="w-40 rounded-lg border border-violet-800/50 bg-secondary px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-500 focus:outline-none sm:w-64"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Fermer la recherche"
              >
                <X className="h-5 w-5" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Ouvrir la recherche"
            >
              <Search className="h-5 w-5" />
            </button>
          )}

          <button
            className="text-muted-foreground transition-colors hover:text-foreground md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-violet-900/30 bg-background/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
            >
              Accueil
            </Link>
            <Link
              href="/movies"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
            >
              Films
            </Link>
            <Link
              href="/tv"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
            >
              Series
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
