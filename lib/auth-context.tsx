"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export interface AppUser {
  id: string
  username: string
  email: string
  role: string
  createdAt: string
}

interface AuthContextType {
  user: AppUser | null
  isLoading: boolean
  isAdmin: boolean
  signUp: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

function mapUser(supabaseUser: SupabaseUser, profile?: { username?: string; role?: string }): AppUser {
  return {
    id: supabaseUser.id,
    username: profile?.username || supabaseUser.user_metadata?.username || "Exemple",
    email: supabaseUser.email || "",
    role: profile?.role || "member",
    createdAt: supabaseUser.created_at,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchProfile = useCallback(async (supabaseUser: SupabaseUser) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, role")
      .eq("id", supabaseUser.id)
      .single()

    setUser(mapUser(supabaseUser, profile || undefined))
  }, [supabase])

  const supabase = createClient()

  const loadUserData = useCallback(async (supabaseUser: SupabaseUser) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", supabaseUser.id)
      .single()

    if (profile) {
      setUser(buildUserFromProfile(profile, supabaseUser.email || ""))
    }

    // Load liked items
    const { data: liked } = await supabase
      .from("liked_items")
      .select("*")
      .eq("user_id", supabaseUser.id)
      .order("created_at", { ascending: false })

    if (liked) {
      setLikedItems(
        liked.map((item: Record<string, unknown>) => ({
          id: item.media_id as number,
          type: item.media_type as "movie" | "tv",
          title: (item.title as string) || "",
          poster_path: item.poster_path as string | null,
          vote_average: 0,
          addedAt: (item.created_at as string) || new Date().toISOString(),
        }))
      )
    }

    // Load watched items
    const { data: watched } = await supabase
      .from("watched_items")
      .select("*")
      .eq("user_id", supabaseUser.id)
      .order("created_at", { ascending: false })

    if (watched) {
      setWatchedItems(
        watched.map((item: Record<string, unknown>) => ({
          id: item.media_id as number,
          type: item.media_type as "movie" | "tv",
          title: (item.title as string) || "",
          poster_path: item.poster_path as string | null,
          vote_average: 0,
          addedAt: (item.created_at as string) || new Date().toISOString(),
        }))
      )
    }
  }, [supabase])

  useEffect(() => {
    async function init() {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser()
      if (supabaseUser) {
        await fetchProfile(supabaseUser)
      }
      setIsLoading(false)
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchProfile(session.user)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, fetchProfile])

  const signUp = useCallback(async (username: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${window.location.origin}/`,
      },
    })
    if (error) {
      if (error.message.includes("already registered")) {
        return { success: false, error: "Un compte avec cet email existe deja." }
      }
      return { success: false, error: error.message }
    }
    return { success: true }
  }, [supabase])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      return { success: false, error: "Email ou mot de passe incorrect." }
    }
    return { success: true }
  }, [supabase])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [supabase])

  const isAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
