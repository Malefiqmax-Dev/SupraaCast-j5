"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Menu, X, User, LogOut, Shield, Tv, Radio } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { AuthModal } from "@/components/auth-modal"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [authOpen, setAuthOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { user, signOut, isAdmin } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery("")
    }
  }

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/movies", label: "Films" },
    { href: "/tv", label: "Series" },
    { href: "/platforms", label: "Platformes", icon: Tv },
    { href: "/live", label: "Live Sport", icon: Radio },
  ]

  return (
    <>
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
            <div className="hidden items-center gap-5 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-1 text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  {link.icon && <link.icon className="h-3.5 w-3.5" />}
                  {link.label}
                </Link>
              ))}
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
                <button type="button" onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground" aria-label="Fermer la recherche">
                  <X className="h-5 w-5" />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Ouvrir la recherche">
                <Search className="h-5 w-5" />
              </button>
            )}

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-sm font-bold text-white transition-all ring-2 ring-transparent hover:ring-violet-500/50"
                  aria-label="Menu utilisateur"
                >
                  {user.username.charAt(0).toUpperCase()}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-violet-800/30 bg-card shadow-xl shadow-violet-900/20">
                    <div className="border-b border-violet-800/20 px-4 py-3">
                      <p className="text-sm font-semibold text-foreground">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      {isAdmin && <span className="mt-1 inline-block rounded bg-violet-600/30 px-1.5 py-0.5 text-[10px] font-semibold text-violet-300">Admin</span>}
                    </div>
                    <div className="p-1">
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setDropdownOpen(false)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-violet-400 transition-colors hover:bg-secondary">
                          <Shield className="h-4 w-4" />
                          Administration
                        </Link>
                      )}
                      <button
                        onClick={async () => { await signOut(); setDropdownOpen(false) }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-secondary"
                      >
                        <LogOut className="h-4 w-4" />
                        Se deconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-700 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:from-violet-500 hover:to-purple-600 sm:text-sm"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Connexion</span>
              </button>
            )}

            <button className="text-muted-foreground transition-colors hover:text-foreground lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-violet-900/30 bg-background/95 backdrop-blur-md lg:hidden">
            <div className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground">
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-violet-400 transition-colors hover:bg-secondary">
                  <Shield className="h-4 w-4" />
                  Administration
                </Link>
              )}
              {!user && (
                <button onClick={() => { setMenuOpen(false); setAuthOpen(true) }} className="mt-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-700 px-3 py-2 text-sm font-semibold text-white">
                  Connexion / Inscription
                </button>
              )}
              {user && (
                <button onClick={async () => { await signOut(); setMenuOpen(false) }} className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-secondary">
                  <LogOut className="h-4 w-4" />
                  Se deconnecter ({user.username})
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
