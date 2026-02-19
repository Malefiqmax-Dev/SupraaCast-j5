"use client"

import React, { useState } from "react"
import { X, Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const { signIn, signUp } = useAuth()

  if (!isOpen) return null

  function reset() {
    setEmail("")
    setPassword("")
    setUsername("")
    setError("")
    setSuccess("")
    setShowPassword(false)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (mode === "signup") {
      if (!username.trim()) { setError("Veuillez entrer un nom d'utilisateur."); return }
      if (username.trim().length < 3) { setError("Le nom d'utilisateur doit contenir au moins 3 caracteres."); return }
    }
    if (!email.trim()) { setError("Veuillez entrer votre email."); return }
    if (!password.trim() || password.length < 6) { setError("Le mot de passe doit contenir au moins 6 caracteres."); return }

    setLoading(true)

    if (mode === "signin") {
      const result = await signIn(email, password)
      setLoading(false)
      if (!result.success) { setError(result.error || "Erreur de connexion."); return }
      reset()
      onClose()
    } else {
      const result = await signUp(username.trim(), email, password)
      setLoading(false)
      if (!result.success) { setError(result.error || "Erreur lors de l'inscription."); return }
      setSuccess("Compte cree avec succes ! Verifiez votre email pour confirmer votre inscription, ou connectez-vous directement.")
    }
  }

  function switchMode() {
    setMode(mode === "signin" ? "signup" : "signin")
    setError("")
    setSuccess("")
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md rounded-2xl border border-violet-800/30 bg-card p-8 shadow-2xl shadow-violet-900/20">
        <button
          onClick={() => { reset(); onClose() }}
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Fermer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <h2 className="font-display text-2xl font-bold bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
            SupraaCast
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin" ? "Connectez-vous a votre compte" : "Creez votre compte"}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm text-green-400">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "signup" && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-sm font-medium text-foreground/80">
                Nom d{"'"}utilisateur
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Exemple"
                className="rounded-lg border border-violet-800/40 bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-foreground/80">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              className="rounded-lg border border-violet-800/40 bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-foreground/80">Mot de passe</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 caracteres minimum"
                className="w-full rounded-lg border border-violet-800/40 bg-secondary px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Masquer" : "Afficher"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-700 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-purple-600 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Se connecter" : "Creer un compte"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>Pas encore de compte ? <button onClick={switchMode} className="font-medium text-violet-400 hover:text-violet-300">S{"'"}inscrire</button></>
          ) : (
            <>Deja un compte ? <button onClick={switchMode} className="font-medium text-violet-400 hover:text-violet-300">Se connecter</button></>
          )}
        </div>
      </div>
    </div>
  )
}
