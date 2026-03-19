import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SupraaCast - Administration",
  description: "Panneau d'administration SupraaCast",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
