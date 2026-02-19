"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export interface User {
  id: string
  username: string
  email: string
  avatar: string
  isAdmin: boolean
  createdAt: string
}

export interface MediaItem {
  id: number
  type: "movie" | "tv"
  title: string
  poster_path: string | null
  vote_average: number
  addedAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signUp: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  likedItems: MediaItem[]
  watchedItems: MediaItem[]
  toggleLike: (item: Omit<MediaItem, "addedAt">) => void
  toggleWatched: (item: Omit<MediaItem, "addedAt">) => void
  isLiked: (id: number, type: "movie" | "tv") => boolean
  isWatched: (id: number, type: "movie" | "tv") => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const AVATARS = [
  "bg-gradient-to-br from-violet-500 to-purple-700",
  "bg-gradient-to-br from-violet-600 to-indigo-800",
  "bg-gradient-to-br from-purple-500 to-fuchsia-700",
  "bg-gradient-to-br from-indigo-500 to-violet-700",
  "bg-gradient-to-br from-fuchsia-500 to-purple-800",
]

function buildUserFromProfile(profile: Record<string, unknown>, email: string): User {
  return {
    id: profile.id as string,
    username: (profile.display_name as string) || "Exemple",
    email: email || (profile.email as string) || "",
    avatar: (profile.avatar_url as string) || AVATARS[Math.floor(Math.random() * AVATARS.length)],
    isAdmin: (profile.is_admin as boolean) || false,
    createdAt: (profile.created_at as string) || new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [likedItems, setLikedItems] = useState<MediaItem[]>([])
  const [watchedItems, setWatchedItems] = useState<MediaItem[]>([])

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
        await loadUserData(supabaseUser)
      }
      setIsLoading(false)
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await loadUserData(session.user)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setLikedItems([])
        setWatchedItems([])
      }
    })

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signUp = useCallback(async (username: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        data: {
          display_name: username,
        },
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${window.location.origin}/`,
      },
    })

    if (error) {
      if (error.message.includes("already registered")) {
        return { success: false, error: "Un compte avec cet email existe deja." }
      }
      return { success: false, error: error.message }
    }

    if (data.user) {
      // If email confirmation is not required, user will be logged in immediately
      if (data.session) {
        await loadUserData(data.user)
      }
      return { success: true }
    }

    return { success: false, error: "Erreur lors de l'inscription." }
  }, [supabase, loadUserData])

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    })

    if (error) {
      return { success: false, error: "Email ou mot de passe incorrect." }
    }

    if (data.user) {
      await loadUserData(data.user)
      return { success: true }
    }

    return { success: false, error: "Erreur de connexion." }
  }, [supabase, loadUserData])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    setLikedItems([])
    setWatchedItems([])
  }, [supabase])

  const toggleLike = useCallback(async (item: Omit<MediaItem, "addedAt">) => {
    if (!user) return

    const exists = likedItems.find((i) => i.id === item.id && i.type === item.type)

    if (exists) {
      // Remove from liked
      await supabase
        .from("liked_items")
        .delete()
        .eq("user_id", user.id)
        .eq("media_id", item.id)
        .eq("media_type", item.type)

      setLikedItems((prev) => prev.filter((i) => !(i.id === item.id && i.type === item.type)))
    } else {
      // Add to liked
      await supabase.from("liked_items").insert({
        user_id: user.id,
        media_id: item.id,
        media_type: item.type,
        title: item.title,
        poster_path: item.poster_path,
      })

      setLikedItems((prev) => [
        { ...item, addedAt: new Date().toISOString() },
        ...prev,
      ])
    }
  }, [user, likedItems, supabase])

  const toggleWatched = useCallback(async (item: Omit<MediaItem, "addedAt">) => {
    if (!user) return

    const exists = watchedItems.find((i) => i.id === item.id && i.type === item.type)

    if (exists) {
      await supabase
        .from("watched_items")
        .delete()
        .eq("user_id", user.id)
        .eq("media_id", item.id)
        .eq("media_type", item.type)

      setWatchedItems((prev) => prev.filter((i) => !(i.id === item.id && i.type === item.type)))
    } else {
      await supabase.from("watched_items").insert({
        user_id: user.id,
        media_id: item.id,
        media_type: item.type,
        title: item.title,
        poster_path: item.poster_path,
      })

      setWatchedItems((prev) => [
        { ...item, addedAt: new Date().toISOString() },
        ...prev,
      ])
    }
  }, [user, watchedItems, supabase])

  const isLiked = useCallback((id: number, type: "movie" | "tv") => {
    return likedItems.some((i) => i.id === id && i.type === type)
  }, [likedItems])

  const isWatched = useCallback((id: number, type: "movie" | "tv") => {
    return watchedItems.some((i) => i.id === id && i.type === type)
  }, [watchedItems])

  return (
    <AuthContext.Provider value={{
      user, isLoading, signUp, signIn, signOut,
      likedItems, watchedItems, toggleLike, toggleWatched, isLiked, isWatched
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
