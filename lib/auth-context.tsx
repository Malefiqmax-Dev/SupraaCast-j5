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
  
  const supabaseClient = createClient()

  const fetchProfile = useCallback(async (supabaseUser: SupabaseUser) => {
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("username, role")
      .eq("id", supabaseUser.id)
      .single()

    setUser(mapUser(supabaseUser, profile || undefined))
  }, [supabaseClient])

  useEffect(() => {
    async function init() {
      const { data: { user: currentUser } } = await supabaseClient.auth.getUser()
      if (currentUser) {
        await fetchProfile(currentUser)
      }
      setIsLoading(false)
    }
    init()

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchProfile(session.user)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabaseClient, fetchProfile])

  const signUp = useCallback(async (username: string, email: string, password: string) => {
    const { error } = await supabaseClient.auth.signUp({
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
  }, [supabaseClient])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password })
    if (error) {
      return { success: false, error: "Email ou mot de passe incorrect." }
    }
    return { success: true }
  }, [supabaseClient])

  const signOut = useCallback(async () => {
    await supabaseClient.auth.signOut()
    setUser(null)
  }, [supabaseClient])

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
