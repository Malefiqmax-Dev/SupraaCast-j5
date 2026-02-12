"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"

export interface User {
  id: string
  username: string
  email: string
  avatar: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signUp: (username: string, email: string, password: string) => { success: boolean; error?: string }
  signIn: (email: string, password: string) => { success: boolean; error?: string }
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const USERS_KEY = "supracast_users"
const SESSION_KEY = "supracast_session"

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_KEY)
    if (sessionId) {
      const users = getStoredUsers()
      const found = users.find((u) => u.id === sessionId)
      if (found) {
        const { password: _, ...userData } = found
        setUser(userData)
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
    localStorage.setItem(SESSION_KEY, found.id)
    return { success: true }
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    localStorage.removeItem(SESSION_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
