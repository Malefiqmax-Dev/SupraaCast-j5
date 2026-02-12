"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

export interface User {
  id: string
  username: string
  email: string
  avatar: string
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
  signUp: (username: string, email: string, password: string) => { success: boolean; error?: string }
  signIn: (email: string, password: string) => { success: boolean; error?: string }
  signOut: () => void
  likedItems: MediaItem[]
  watchedItems: MediaItem[]
  toggleLike: (item: Omit<MediaItem, "addedAt">) => void
  toggleWatched: (item: Omit<MediaItem, "addedAt">) => void
  isLiked: (id: number, type: "movie" | "tv") => boolean
  isWatched: (id: number, type: "movie" | "tv") => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const USERS_KEY = "supracast_users"
const SESSION_KEY = "supracast_session"
const LIKED_KEY = "supracast_liked"
const WATCHED_KEY = "supracast_watched"

const AVATARS = [
  "bg-gradient-to-br from-violet-500 to-purple-700",
  "bg-gradient-to-br from-violet-600 to-indigo-800",
  "bg-gradient-to-br from-purple-500 to-fuchsia-700",
  "bg-gradient-to-br from-indigo-500 to-violet-700",
  "bg-gradient-to-br from-fuchsia-500 to-purple-800",
]

function getStoredUsers(): (User & { password: string })[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
  } catch {
    return []
  }
}

function storeUsers(users: (User & { password: string })[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function getUserListKey(userId: string, listType: string) {
  return `${listType}_${userId}`
}

function getStoredList(userId: string, listType: string): MediaItem[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem(getUserListKey(userId, listType)) || "[]")
  } catch {
    return []
  }
}

function storeList(userId: string, listType: string, items: MediaItem[]) {
  localStorage.setItem(getUserListKey(userId, listType), JSON.stringify(items))
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [likedItems, setLikedItems] = useState<MediaItem[]>([])
  const [watchedItems, setWatchedItems] = useState<MediaItem[]>([])

  useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_KEY)
    if (sessionId) {
      const users = getStoredUsers()
      const found = users.find((u) => u.id === sessionId)
      if (found) {
        const { password: _, ...userData } = found
        setUser(userData)
        setLikedItems(getStoredList(found.id, LIKED_KEY))
        setWatchedItems(getStoredList(found.id, WATCHED_KEY))
      }
    }
    setIsLoading(false)
  }, [])

  const signUp = useCallback((username: string, email: string, password: string) => {
    const users = getStoredUsers()
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Un compte avec cet email existe deja." }
    }
    if (users.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: "Ce nom d'utilisateur est deja pris." }
    }
    const newUser = {
      id: crypto.randomUUID(),
      username,
      email: email.toLowerCase(),
      password,
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      createdAt: new Date().toISOString(),
    }
    storeUsers([...users, newUser])
    const { password: _, ...userData } = newUser
    setUser(userData)
    setLikedItems([])
    setWatchedItems([])
    localStorage.setItem(SESSION_KEY, newUser.id)
    return { success: true }
  }, [])

  const signIn = useCallback((email: string, password: string) => {
    const users = getStoredUsers()
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) {
      return { success: false, error: "Email ou mot de passe incorrect." }
    }
    const { password: _, ...userData } = found
    setUser(userData)
    setLikedItems(getStoredList(found.id, LIKED_KEY))
    setWatchedItems(getStoredList(found.id, WATCHED_KEY))
    localStorage.setItem(SESSION_KEY, found.id)
    return { success: true }
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    setLikedItems([])
    setWatchedItems([])
    localStorage.removeItem(SESSION_KEY)
  }, [])

  const toggleLike = useCallback((item: Omit<MediaItem, "addedAt">) => {
    if (!user) return
    setLikedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id && i.type === item.type)
      let updated: MediaItem[]
      if (exists) {
        updated = prev.filter((i) => !(i.id === item.id && i.type === item.type))
      } else {
        updated = [...prev, { ...item, addedAt: new Date().toISOString() }]
      }
      storeList(user.id, LIKED_KEY, updated)
      return updated
    })
  }, [user])

  const toggleWatched = useCallback((item: Omit<MediaItem, "addedAt">) => {
    if (!user) return
    setWatchedItems((prev) => {
      const exists = prev.find((i) => i.id === item.id && i.type === item.type)
      let updated: MediaItem[]
      if (exists) {
        updated = prev.filter((i) => !(i.id === item.id && i.type === item.type))
      } else {
        updated = [...prev, { ...item, addedAt: new Date().toISOString() }]
      }
      storeList(user.id, WATCHED_KEY, updated)
      return updated
    })
  }, [user])

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
