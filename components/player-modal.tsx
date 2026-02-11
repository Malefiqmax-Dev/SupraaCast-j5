"use client"

import { X } from "lucide-react"
import { useEffect } from "react"

interface PlayerModalProps {
  url: string
  title: string
  onClose: () => void
}

export function PlayerModal({ url, title, onClose }: PlayerModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <div className="relative h-full w-full max-h-[90vh] max-w-[90vw] lg:max-h-[85vh] lg:max-w-[85vw]">
        <div className="absolute -top-2 right-0 z-10 flex items-center gap-3 -translate-y-full pb-2">
          <span className="truncate text-sm font-medium text-foreground">{title}</span>
          <button
            onClick={onClose}
            className="rounded-full bg-violet-700/80 p-2 text-foreground transition-colors hover:bg-violet-600"
            aria-label="Fermer le lecteur"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <iframe
          src={url}
          title={title}
          className="h-full w-full rounded-lg border border-violet-900/30"
          allowFullScreen
          allow="autoplay; fullscreen"
        />
      </div>
    </div>
  )
}
