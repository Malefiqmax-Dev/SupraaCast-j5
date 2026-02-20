"use client"

interface LogoProps {
  className?: string
}

export function NetflixLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 111 30" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.874L94.468 0H99.5l3.062 8.095L105.687 0h4.937l-5.562 14.28zM90.47 0h-4.594v27.25c1.5.094 3.062.156 4.594.343V0zm-8.563 26.937c-4.187-.282-8.156-1.5-8.156-1.5V0h4.687v21.875c1.156.375 2.344.563 3.469.75v4.312zM64.25 10.657v4.687h-6.406V0H62.5v10.657h1.75zM57.344.375l.313 4.563c-3.125-.312-6.656-.343-6.656-.343v7.156h5.25v4.813h-5.25v9.375c1.562.092 3.124.187 4.625.343V0c-.062 0-3.063.157-5.282.375V.375h7zm-16.5 11.47V4.688h5.219V.001H35.782v.374h.063V26.72c1.5.094 3.032.155 4.593.343V11.845h.407zm-11.438 0V4.688h4.782V.001H24.344v.374h.063V26.72c1.5.094 3.03.155 4.593.343V11.845h.406zM18.75 16.22V0h-4.594v21.875c1.094.25 2.25.5 3.375.781l1.22-6.437zM4.782 12.938V0H.188v27.625c1.5.094 3.093.155 4.594.343V12.938z"
      />
    </svg>
  )
}

export function DisneyPlusLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 200 76" className={className} aria-hidden="true">
      <g fill="currentColor">
        <path d="M90.996 27.5c-1.552 0-3.59.36-5.092 1.38-3.04 2.06-4.1 6.28-3.1 10.14 1.09 4.2 4.61 7.88 10.08 7.88 2.38 0 4.56-.94 5.88-2.48l.42.24c-.84 2.18-3.6 5.16-8.36 5.16-4.18 0-7.66-2.1-9.76-5.4-2-3.14-2.56-7.38-.8-10.84 1.72-3.38 5.48-5.82 9.78-5.82 2.76 0 5.2.98 6.56 2.24l-1 3.18c-1.02-2.2-2.72-5.66-4.58-5.66z" />
        <text x="105" y="48" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="36" fill="currentColor">{"+"}</text>
      </g>
      <text x="8" y="48" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="32" letterSpacing="-1" fill="currentColor">
        {"Disney"}
      </text>
      <text x="130" y="48" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="42" fill="currentColor">
        {"+"}
      </text>
    </svg>
  )
}

export function getPlatformLogo(slug: string, className?: string) {
  const logoClass = className || "h-10 w-auto"

  switch (slug) {
    case "netflix":
      return <NetflixLogo className={logoClass} />
    case "disney-plus":
      return (
        <span className={`font-black tracking-tight text-current`} style={{ fontFamily: "'Arial Black', sans-serif" }}>
          Disney+
        </span>
      )
    case "max":
      return (
        <span className={`font-black uppercase tracking-widest text-current`} style={{ fontFamily: "'Arial Black', sans-serif" }}>
          HBO
        </span>
      )
    case "prime-video":
      return (
        <span className={`font-bold tracking-tight text-current`} style={{ fontFamily: "'Arial', sans-serif" }}>
          prime video
        </span>
      )
    case "apple-tv-plus":
      return (
        <span className="flex items-center gap-1 text-current">
          <svg viewBox="0 0 17 20" className="h-6 w-auto" fill="currentColor" aria-hidden="true">
            <path d="M15.5 10.1c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.3C2.2 10 3.2 14.1 4.9 16c.8 1 1.8 2 3 2 1.2 0 1.7-.8 3.1-.8 1.4 0 1.8.8 3.1.8 1.3 0 2.1-1 2.9-2 .9-1.3 1.3-2.6 1.3-2.6C18.2 13 15.5 12 15.5 10.1zM13.1 3.1C13.7 2.3 14.2 1.2 14 0c-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.8-.9 2.8 1 .1 2-.5 2.6-1.1z"/>
          </svg>
          tv+
        </span>
      )
    case "paramount-plus":
      return (
        <span className={`font-bold italic tracking-tight text-current`} style={{ fontFamily: "'Georgia', serif" }}>
          Paramount+
        </span>
      )
    case "canal-plus":
      return (
        <span className={`font-black uppercase tracking-[0.25em] text-current`} style={{ fontFamily: "'Arial Black', sans-serif" }}>
          Canal+
        </span>
      )
    case "crunchyroll":
      return (
        <span className={`font-bold tracking-tight text-current`} style={{ fontFamily: "'Arial', sans-serif" }}>
          Crunchyroll
        </span>
      )
    default:
      return null
  }
}
