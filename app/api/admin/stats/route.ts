import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const ADMIN_EMAILS = ["malefiqmax@gmail.com"]
const TMDB_TOKEN = process.env.TMDB_API_TOKEN || "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YTAxNWFmZjM3ZjM5ODY5NzM5ODk3YWUzZGNlZmU5MiIsIm5iZiI6MTc3MDg0MjcxNi45ODgsInN1YiI6IjY5OGNlYTVjNDFjOTYwZGNjZmIzMGYwOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rq0-m_bJcToSKDOJpaL0U0L3xfLfNut9zD5rCm2clak"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  let tmdbStatus = { ok: false, ms: 0 }
  try {
    const start = Date.now()
    const res = await fetch("https://api.themoviedb.org/3/configuration", {
      headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
    })
    tmdbStatus = { ok: res.ok, ms: Date.now() - start }
  } catch { tmdbStatus = { ok: false, ms: 0 } }

  let dbStatus = { ok: false, ms: 0 }
  try {
    const start = Date.now()
    await supabase.from("profiles").select("id").limit(1)
    dbStatus = { ok: true, ms: Date.now() - start }
  } catch { dbStatus = { ok: false, ms: 0 } }

  return NextResponse.json({
    totalUsers: userCount || 0,
    tmdb: tmdbStatus,
    database: dbStatus,
  })
}
