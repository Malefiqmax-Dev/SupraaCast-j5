"use client"

import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { StatsCards } from "@/components/admin/stats-cards"
import { UsersTable } from "@/components/admin/users-table"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect, useCallback } from "react"
import { Shield, RefreshCw, Loader2 } from "lucide-react"
import Link from "next/link"

interface UserProfile {
  id: string
  display_name: string
  email: string
  is_admin: boolean
  created_at: string
}

interface Stats {
  totalUsers: number
  totalLiked: number
  totalWatched: number
  totalAdmins: number
}

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalLiked: 0, totalWatched: 0, totalAdmins: 0 })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const supabase = createClient()

  const loadData = useCallback(async () => {
    // Load all profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (profiles) {
      setUsers(profiles as UserProfile[])
      setStats((prev) => ({
        ...prev,
        totalUsers: profiles.length,
        totalAdmins: profiles.filter((p: Record<string, unknown>) => p.is_admin).length,
      }))
    }

    // Count liked items
    const { count: likedCount } = await supabase
      .from("liked_items")
      .select("*", { count: "exact", head: true })

    // Count watched items
    const { count: watchedCount } = await supabase
      .from("watched_items")
      .select("*", { count: "exact", head: true })

    setStats((prev) => ({
      ...prev,
      totalLiked: likedCount || 0,
      totalWatched: watchedCount || 0,
    }))

    setLoading(false)
  }, [supabase])

  useEffect(() => {
    if (user?.isAdmin) {
      loadData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.isAdmin])

  async function handleRefresh() {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  // Loading state
  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
            <p className="text-sm text-muted-foreground">Chargement du panneau d{"'"}administration...</p>
          </div>
        </main>
      </>
    )
  }

  // Not authenticated or not admin
  if (!user || !user.isAdmin) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="max-w-md text-center">
            <Shield className="mx-auto mb-4 h-16 w-16 text-violet-500/40" />
            <h1 className="font-display text-2xl font-bold text-foreground">
              Acces refuse
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Cette page est reservee aux administrateurs. Connectez-vous avec un compte administrateur pour acceder a cette page.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-lg bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-purple-600"
            >
              Retour a l{"'"}accueil
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 pt-24 pb-12 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-violet-400" />
              <h1 className="font-display text-3xl font-bold text-foreground">Administration</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Gerez les utilisateurs et le contenu de SupraaCast.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 self-start rounded-lg border border-violet-700/40 bg-violet-950/50 px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-violet-900/50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Actualiser
          </button>
        </div>

        {/* Stats */}
        <section className="mt-8">
          <StatsCards
            totalUsers={stats.totalUsers}
            totalLiked={stats.totalLiked}
            totalWatched={stats.totalWatched}
            totalAdmins={stats.totalAdmins}
          />
        </section>

        {/* Users Table */}
        <section className="mt-8">
          <UsersTable
            users={users}
            currentUserId={user.id}
            onRefresh={handleRefresh}
          />
        </section>
      </main>
      <Footer />
    </>
  )
}
