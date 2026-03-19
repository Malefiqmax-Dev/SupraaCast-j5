import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const ADMIN_EMAILS = ["malefiqmax@gmail.com"]

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const url = new URL(request.url)
  const search = url.searchParams.get("search") || ""
  const page = parseInt(url.searchParams.get("page") || "1")
  const perPage = 10

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1)

  if (search) {
    query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const { data, count, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    users: data || [],
    total: count || 0,
    page,
    perPage,
    totalPages: Math.ceil((count || 0) / perPage),
  })
}
