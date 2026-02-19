"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  BarChart3, Users, Activity, Clock, Calendar,
  Database, Server, Search, ChevronLeft, ChevronRight,
  Shield, RefreshCw, Loader2
} from "lucide-react"

interface Stats {
  totalUsers: number
  tmdb: { ok: boolean; ms: number }
  database: { ok: boolean; ms: number }
}

interface ProfileUser {
  id: string
  username: string
  email: string
  role: string
  created_at: string
}

interface UsersResponse {
  users: ProfileUser[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export default function AdminPage() {
  const { user, isAdmin, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<"dashboard" | "users">("dashboard")
  const [stats, setStats] = useState<Stats | null>(null)
  const [usersData, setUsersData] = useState<UsersResponse | null>(null)
  const [usersSearch, setUsersSearch] = useState("")
  const [usersPage, setUsersPage] = useState(1)
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats")
      if (res.ok) setStats(await res.json())
    } catch {}
    setLoadingStats(false)
  }, [])

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true)
    try {
      const params = new URLSearchParams({ page: String(usersPage), search: usersSearch })
      const res = await fetch(`/api/admin/users?${params}`)
      if (res.ok) setUsersData(await res.json())
    } catch {}
    setLoadingUsers(false)
  }, [usersPage, usersSearch])

  useEffect(() => { fetchStats() }, [fetchStats])
  useEffect(() => { fetchUsers() }, [fetchUsers])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center bg-background pt-16">
          <div className="text-center">
            <Shield className="mx-auto h-16 w-16 text-violet-500/50" />
            <h1 className="mt-4 text-2xl font-bold text-foreground">Acces Refuse</h1>
            <p className="mt-2 text-muted-foreground">Cette page est reservee aux administrateurs.</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const tabs = [
    { id: "dashboard" as const, label: "Dashboard", icon: BarChart3 },
    { id: "users" as const, label: `Utilisateurs${stats ? ` (${stats.totalUsers})` : ""}`, icon: Users },
  ]

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-20 pb-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Administration</h1>
            <p className="mt-1 text-muted-foreground">Panneau de gestion SupraaCast</p>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex items-center gap-1 overflow-x-auto rounded-xl border border-violet-800/20 bg-card p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="flex flex-col gap-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-violet-800/20 bg-card p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">En Ligne Maintenant</span>
                    <Activity className="h-5 w-5 text-green-400" />
                  </div>
                  <p className="mt-2 text-3xl font-bold text-green-400">
                    {loadingStats ? "-" : "1"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Actifs (5 dernieres minutes)</p>
                </div>
                <div className="rounded-xl border border-violet-800/20 bg-card p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Derniere Heure</span>
                    <Clock className="h-5 w-5 text-violet-400" />
                  </div>
                  <p className="mt-2 text-3xl font-bold text-violet-400">
                    {loadingStats ? "-" : "1"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Utilisateurs actifs</p>
                </div>
                <div className="rounded-xl border border-violet-800/20 bg-card p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Dernieres 24h</span>
                    <Calendar className="h-5 w-5 text-violet-400" />
                  </div>
                  <p className="mt-2 text-3xl font-bold text-violet-400">
                    {loadingStats ? "-" : "1"}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Utilisateurs actifs</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-violet-800/20 bg-card p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Utilisateurs Total</span>
                    <Users className="h-5 w-5 text-violet-400" />
                  </div>
                  <p className="mt-2 text-3xl font-bold text-foreground">
                    {loadingStats ? "-" : stats?.totalUsers ?? 0}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Inscrits sur SupraaCast</p>
                </div>
                <div className="rounded-xl border border-violet-800/20 bg-card p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Contenu TMDB</span>
                    <Database className="h-5 w-5 text-violet-400" />
                  </div>
                  <p className="mt-2 text-3xl font-bold text-foreground">1 000 000+</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Films, series, chaines TV</p>
                </div>
              </div>

              {/* System Status */}
              <div className="rounded-xl border border-violet-800/20 bg-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Etat du systeme</h3>
                    <p className="text-sm text-muted-foreground">Surveillance en temps reel</p>
                  </div>
                  <button
                    onClick={async () => {
                      setRefreshing(true)
                      await fetchStats()
                      setRefreshing(false)
                    }}
                    className="flex items-center gap-2 rounded-lg border border-violet-800/30 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                    Rafraichir
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between rounded-lg border border-violet-800/10 bg-secondary/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-2.5 w-2.5 rounded-full ${stats?.tmdb.ok ? "bg-green-500" : "bg-red-500"}`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">API TMDB</p>
                        <p className="text-xs text-muted-foreground">{stats?.tmdb.ok ? "Operationnel" : "Indisponible"}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{stats?.tmdb.ms ?? 0}ms</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-violet-800/10 bg-secondary/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-2.5 w-2.5 rounded-full ${stats?.database.ok ? "bg-blue-500" : "bg-red-500"}`} />
                      <div>
                        <p className="text-sm font-medium text-foreground">Base de donnees</p>
                        <p className="text-xs text-muted-foreground">{stats?.database.ok ? "Connectee" : "Deconnectee"}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{stats?.database.ms ?? 0}ms</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-violet-800/10 bg-secondary/50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Serveurs</p>
                        <p className="text-xs text-muted-foreground">En ligne</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">OK</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="rounded-xl border border-violet-800/20 bg-card p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">Gestion des Utilisateurs</h3>
                <p className="text-sm text-muted-foreground">
                  {usersData ? `${usersData.total} utilisateurs inscrits` : "Chargement..."}
                </p>
              </div>

              <div className="mb-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={usersSearch}
                    onChange={(e) => { setUsersSearch(e.target.value); setUsersPage(1) }}
                    placeholder="Rechercher un utilisateur par nom ou email..."
                    className="w-full rounded-lg border border-violet-800/40 bg-secondary py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>

              {loadingUsers ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-violet-800/20">
                          <th className="py-3 text-left text-sm font-medium text-muted-foreground">Utilisateur</th>
                          <th className="py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                          <th className="py-3 text-left text-sm font-medium text-muted-foreground">Privileges</th>
                          <th className="py-3 text-left text-sm font-medium text-muted-foreground">Inscription</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersData?.users.map((u) => (
                          <tr key={u.id} className="border-b border-violet-800/10 transition-colors hover:bg-secondary/30">
                            <td className="py-3">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-xs font-bold text-white">
                                  {u.username?.charAt(0).toUpperCase() || "?"}
                                </div>
                                <span className="text-sm font-medium text-foreground">{u.username || "Exemple"}</span>
                              </div>
                            </td>
                            <td className="py-3 text-sm text-muted-foreground">{u.email}</td>
                            <td className="py-3">
                              <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                                u.role === "admin" ? "bg-violet-600/30 text-violet-300" : "bg-secondary text-muted-foreground"
                              }`}>
                                {u.role === "admin" ? "Admin" : "Membre"}
                              </span>
                            </td>
                            <td className="py-3 text-sm text-muted-foreground">
                              {u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR") : "-"}
                            </td>
                          </tr>
                        ))}
                        {usersData?.users.length === 0 && (
                          <tr><td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">Aucun utilisateur trouve.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {usersData && usersData.totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Page {usersData.page} / {usersData.totalPages}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setUsersPage(Math.max(1, usersPage - 1))}
                          disabled={usersPage <= 1}
                          className="rounded-lg border border-violet-800/30 p-1.5 text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setUsersPage(Math.min(usersData.totalPages, usersPage + 1))}
                          disabled={usersPage >= usersData.totalPages}
                          className="rounded-lg border border-violet-800/30 p-1.5 text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-50"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
