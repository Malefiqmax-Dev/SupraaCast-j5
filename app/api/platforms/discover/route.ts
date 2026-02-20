import { NextRequest, NextResponse } from "next/server"
import { discoverMoviesByProvider, discoverTVByProvider } from "@/lib/tmdb"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const providerId = Number(searchParams.get("provider"))
  const type = searchParams.get("type") || "movie"
  const page = Number(searchParams.get("page")) || 1

  if (!providerId || isNaN(providerId)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 })
  }

  try {
    const data =
      type === "tv"
        ? await discoverTVByProvider(providerId, page)
        : await discoverMoviesByProvider(providerId, page)

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
