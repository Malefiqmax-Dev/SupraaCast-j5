"use client"

import { Users, Heart, Eye, Shield } from "lucide-react"

interface StatsCardsProps {
  totalUsers: number
  totalLiked: number
  totalWatched: number
  totalAdmins: number
}

export function StatsCards({ totalUsers, totalLiked, totalWatched, totalAdmins }: StatsCardsProps) {
  const stats = [
    {
      label: "Utilisateurs",
      value: totalUsers,
      icon: Users,
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
    },
    {
      label: "Contenus aimes",
      value: totalLiked,
      icon: Heart,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/20",
    },
    {
      label: "Contenus vus",
      value: totalWatched,
      icon: Eye,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      label: "Administrateurs",
      value: totalAdmins,
      icon: Shield,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl border ${stat.borderColor} ${stat.bgColor} p-5 transition-colors`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 font-display text-3xl font-bold text-foreground">
                {stat.value}
              </p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
