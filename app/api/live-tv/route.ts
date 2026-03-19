import { NextResponse } from "next/server"

export const revalidate = 900 // 15 minutes in seconds

export async function GET() {
  try {
    const res = await fetch("https://livewatch.sbs/api/tv/channels", {
      next: { revalidate: 900 }, // Cache for 15 minutes
      headers: {
        "Accept": "application/json",
      },
    })

    if (!res.ok) {
      // If API fails, return empty array
      return NextResponse.json({ channels: [], error: "API unavailable" })
    }

    const data = await res.json()
    
    // Transform the data to match our interface
    // Adjust this based on the actual API response structure
    const channels = Array.isArray(data) ? data : (data.channels || data.data || [])
    
    return NextResponse.json({
      channels: channels.map((ch: { id?: string; name?: string; logo?: string; url?: string; stream_url?: string; category?: string; country?: string }, index: number) => ({
        id: ch.id || `channel-${index}`,
        name: ch.name || "Unknown Channel",
        logo: ch.logo || "",
        url: ch.url || ch.stream_url || "",
        category: ch.category || "Generaliste",
        country: ch.country || "FR",
      })),
      lastUpdate: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ channels: [], error: "Failed to fetch channels" })
  }
}
