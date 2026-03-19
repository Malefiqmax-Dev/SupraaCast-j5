"use client"

import { useState } from "react"
import { Trash2, Shield, ShieldOff, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface UserProfile {
  id: string
  display_name: string
  email: string
  is_admin: boolean
  created_at: string
}

interface UsersTableProps {
  users: UserProfile[]
  currentUserId: string
  onRefresh: () => void
}

const PAGE_SIZE = 10

export function UsersTable({ users, currentUserId, onRefresh }: UsersTableProps) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState<string | null>(null)

  const supabase = createClient()

  const filtered = users.filter(
    (u) =>
      u.display_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  async function toggleAdmin(userId: string, currentStatus: boolean) {
    if (userId === currentUserId) return
    setLoading(userId)
    await supabase
      .from("profiles")
      .update({ is_admin: !currentStatus })
      .eq("id", userId)
    setLoading(null)
    onRefresh()
  }

  async function deleteUser(userId: string) {
    if (userId === currentUserId) return
    if (!confirm("Etes-vous sur de vouloir supprimer cet utilisateur ? Cette action est irreversible.")) return
    setLoading(userId)
    // Delete user profile (cascade will handle related data)
    await supabase.from("profiles").delete().eq("id", userId)
    setLoading(null)
    onRefresh()
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="rounded-xl border border-violet-800/30 bg-card/50">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-violet-800/20 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">Utilisateurs</h2>
          <p className="text-sm text-muted-foreground">
            {filtered.length} utilisateur{filtered.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            placeholder="Rechercher..."
            className="w-full rounded-lg border border-violet-800/40 bg-secondary pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50 sm:w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-violet-800/20">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Utilisateur
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Role
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Inscription
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-violet-800/10">
            {paged.map((user) => {
              const isSelf = user.id === currentUserId
              const isProcessing = loading === user.id
              return (
                <tr
                  key={user.id}
                  className={`transition-colors hover:bg-violet-950/30 ${isProcessing ? "opacity-50" : ""}`}
                >
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-xs font-bold text-white">
                        {(user.display_name || "?").charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {user.display_name || "Sans nom"}
                        {isSelf && (
                          <span className="ml-2 rounded-full bg-violet-600/20 px-2 py-0.5 text-[10px] font-semibold text-violet-400">
                            Vous
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    {user.is_admin ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
                        <Shield className="h-3 w-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        Membre
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {!isSelf && (
                        <>
                          <button
                            onClick={() => toggleAdmin(user.id, user.is_admin)}
                            disabled={isProcessing}
                            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                              user.is_admin
                                ? "text-amber-400 hover:bg-amber-500/10"
                                : "text-muted-foreground hover:bg-violet-500/10 hover:text-violet-400"
                            }`}
                            title={user.is_admin ? "Retirer le role admin" : "Promouvoir en admin"}
                          >
                            {user.is_admin ? (
                              <>
                                <ShieldOff className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Retirer</span>
                              </>
                            ) : (
                              <>
                                <Shield className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Promouvoir</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            disabled={isProcessing}
                            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
                            title="Supprimer l'utilisateur"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Supprimer</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
            {paged.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  Aucun utilisateur trouve.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-violet-800/20 px-5 py-3">
          <p className="text-xs text-muted-foreground">
            Page {page + 1} sur {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-30"
              aria-label="Page precedente"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-30"
              aria-label="Page suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
