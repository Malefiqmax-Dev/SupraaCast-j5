"use client"

interface LogoProps {
  className?: string
}

export function NetflixLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 111 30" className={className} fill="currentColor" aria-hidden="true">
      <path d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.874L94.468 0H99.5l3.062 8.095L105.687 0h4.937l-5.562 14.28zM90.47 0h-4.594v27.25c1.5.094 3.062.156 4.594.343V0zm-8.563 26.937c-4.187-.282-8.156-1.5-8.156-1.5V0h4.687v21.875c1.156.375 2.344.563 3.469.75v4.312zM64.25 10.657v4.687h-6.406V0H62.5v10.657h1.75zM57.344.375l.313 4.563c-3.125-.312-6.656-.343-6.656-.343v7.156h5.25v4.813h-5.25v9.375c1.562.092 3.124.187 4.625.343V0c-.062 0-3.063.157-5.282.375V.375h7zm-16.5 11.47V4.688h5.219V.001H35.782v.374h.063V26.72c1.5.094 3.032.155 4.593.343V11.845h.407zm-11.438 0V4.688h4.782V.001H24.344v.374h.063V26.72c1.5.094 3.03.155 4.593.343V11.845h.406zM18.75 16.22V0h-4.594v21.875c1.094.25 2.25.5 3.375.781l1.22-6.437zM4.782 12.938V0H.188v27.625c1.5.094 3.093.155 4.594.343V12.938z" />
    </svg>
  )
}

export function DisneyPlusLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 180 60" className={className} fill="currentColor" aria-hidden="true">
      <g>
        <path d="M42.5 6c-1.2-.4-3.1-.6-4.8-.6-8.5 0-14.6 5.2-14.6 13.8 0 7 4.2 11.8 10.8 11.8 3.4 0 6-1.2 7.8-3.2l.8 2.6h5.8V6.8C46.4 6.8 44.2 6.6 42.5 6zm-.8 17.8c-1.2 1.4-3 2.2-5 2.2-3.8 0-6.2-3-6.2-7.6 0-5 2.8-8.4 7.4-8.4 1.4 0 2.8.2 3.8.6v13.2z" />
        <circle cx="50.5" cy="4" r="3.2" />
        <rect x="48" y="6.8" width="5.2" height="24.2" rx="1" />
        <path d="M68 6.2c-4.4 0-7.2 2-8.4 3.6l-.6-3h-4.8v24.2h5.2V16c1-2.2 3.2-4.2 6-4.2 2.2 0 3.4 1 3.4 3.8v15.4h5.2V14.4C74 9 71.8 6.2 68 6.2z" />
        <path d="M89 24c-1.2 1.6-3 2.4-5 2.4-3.4 0-5.4-2.6-5.6-6.4h15.4c.2-1 .2-2 .2-2.8 0-6.4-3.8-11-10-11-6.4 0-10.8 5-10.8 12 0 7.2 4.6 12.2 11 12.2 4 0 7-1.6 8.8-4l-4-2.4zm-10.4-8.6c.4-3.4 2.4-5.6 5.4-5.6 3.2 0 4.8 2.2 4.8 5.2v.4H78.6z" />
        <path d="M100.5 36.8l4-9.6-9.2-20.4h5.6l6 14.4 5.6-14.4h5.4l-12.2 30h-5.2z" />
        <path d="M132 11.8v-5h-3.8V0l-5.2 1.6v5.2h-3v5h3V25c0 4.4 2.2 6.4 6.8 6.4 1.2 0 2.2-.2 3-.4v-4.8c-.4.2-1 .2-1.6.2-1.8 0-3-.6-3-3V11.8h4.8z" />
      </g>
      <text x="130" y="32" fontFamily="Arial Black, Arial, sans-serif" fontWeight="900" fontSize="34" fill="currentColor" letterSpacing="-2">+</text>
      {/* Arc swirl */}
      <path d="M17 38c28-4 52-6 80-4 26 2 48 6 64 12-18-8-42-13-68-14-28-1-52 1-76 6z" opacity="0.7" />
    </svg>
  )
}

export function HBOMaxLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 120 40" className={className} fill="currentColor" aria-hidden="true">
      {/* H */}
      <path d="M4 4h5v12h10V4h5v32h-5V21H9v15H4V4z" />
      {/* B */}
      <path d="M30 4h12c5 0 8 2.5 8 6.5 0 3-1.5 5-4 6 3 .8 5 3.2 5 6.5 0 5-3.5 8-9 8H30V4zm5 11h6c2.5 0 4-1.2 4-3.5S43.5 8 41 8h-6v7zm0 13h7c2.8 0 4.5-1.5 4.5-4s-1.7-4-4.5-4h-7v8z" />
      {/* O */}
      <path d="M58 3c8.5 0 14 6.5 14 17s-5.5 17-14 17-14-6.5-14-17S49.5 3 58 3zm0 5c-5.2 0-8.5 4.8-8.5 12s3.3 12 8.5 12 8.5-4.8 8.5-12-3.3-12-8.5-12z" />
    </svg>
  )
}

export function PrimeVideoLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 200 60" className={className} fill="currentColor" aria-hidden="true">
      {/* "prime" text */}
      <path d="M10 42V18h6.5c5.5 0 8.5 2.8 8.5 7 0 4.5-3.2 7.2-8.5 7.2H14.5V42H10zm4.5-14h2.2c3 0 4.5-1.4 4.5-3.8s-1.5-3.6-4.5-3.6h-2.2v7.4z" />
      <path d="M28 42V24h4v2.8c1.2-2 3.2-3.2 5.5-3.2v4.5c-3.2 0-5.2 1.2-5.2 4.5V42H28z" />
      <path d="M41 42V24h4.2v18H41zm2.1-21c-1.5 0-2.6-1-2.6-2.4s1.1-2.4 2.6-2.4 2.6 1 2.6 2.4-1.1 2.4-2.6 2.4z" />
      <path d="M49 42V24h4.2v2.5c1.2-1.8 3.2-3 5.8-3 2.4 0 4.2 1 5.2 3 1.4-2 3.6-3 6-3 3.8 0 6.2 2.5 6.2 7V42h-4.2V31.5c0-2.8-1.2-4-3.4-4-2.4 0-4 1.6-4 4.5V42h-4.2V31.5c0-2.8-1.2-4-3.4-4-2.4 0-4 1.6-4 4.5V42H49z" />
      <path d="M88 42.5c-5.8 0-9.5-4-9.5-9.5s3.8-9.5 9.2-9.5c5.6 0 9 3.8 9 9.2 0 .6 0 1.2-.1 1.8H82.8c.4 3 2.4 4.8 5.4 4.8 2.2 0 3.8-1 4.8-2.5l3.4 2c-1.6 2.4-4.4 3.7-8.4 3.7zm-5-11.2h10c-.3-2.8-2.2-4.5-4.8-4.5-2.8 0-4.6 1.6-5.2 4.5z" />
      {/* Smile arrow */}
      <path d="M108 48c15-5 30-8 48-8 16 0 28 3 36 6l-3 4c-8-3-19-5.5-33-5.5-16 0-32 3-46 8l-2-4.5z" />
      {/* Arrow tip */}
      <path d="M188 43l6-7 6 7h-12z" />
      {/* "video" text */}
      <path d="M112 24l5.5 14 5.5-14h4.5l-7.8 18h-4.5L108 24h4z" />
      <path d="M131 42V24h4.2v18H131zm2.1-21c-1.5 0-2.6-1-2.6-2.4s1.1-2.4 2.6-2.4 2.6 1 2.6 2.4-1.1 2.4-2.6 2.4z" />
      <path d="M148.5 42.5c-5.5 0-9-4-9-9.5s3.5-9.5 9-9.5c3 0 5.2 1.2 6.5 3V16h4.2v26h-4.2v-2.5c-1.3 1.8-3.5 3-6.5 3zm.8-3.8c3.2 0 5.8-2.4 5.8-5.7s-2.6-5.8-5.8-5.8c-3.2 0-5.6 2.4-5.6 5.8 0 3.3 2.4 5.7 5.6 5.7z" />
      <path d="M171 42.5c-5.8 0-9.5-4-9.5-9.5s3.8-9.5 9.5-9.5 9.5 4 9.5 9.5-3.8 9.5-9.5 9.5zm0-3.8c3.2 0 5.5-2.4 5.5-5.7s-2.3-5.8-5.5-5.8-5.5 2.4-5.5 5.8 2.3 5.7 5.5 5.7z" />
    </svg>
  )
}

export function AppleTVPlusLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 150 50" className={className} fill="currentColor" aria-hidden="true">
      {/* Apple icon */}
      <path d="M30.2 13.6c-1.7 0-3.8 1.1-5.1 2.5-1.1 1.3-2.1 3.2-1.8 5.1 1.9.1 3.8-1 5-2.4 1.1-1.3 1.9-3.1 1.9-5.2z" />
      <path d="M35 22.5c-2.8-.1-5.2 1.6-6.5 1.6s-3.4-1.5-5.6-1.5c-2.9 0-5.5 1.7-7 4.3-3 5.1-0.8 12.7 2.1 16.9 1.4 2.1 3.1 4.4 5.3 4.3 2.1-.1 2.9-1.4 5.5-1.4s3.3 1.4 5.5 1.3c2.3 0 3.7-2.1 5.1-4.2 1.6-2.4 2.3-4.7 2.3-4.8 0 0-4.4-1.7-4.5-6.7 0-4.2 3.4-6.2 3.6-6.3-2-2.9-5.1-3.3-6.1-3.4l.3-.1z" />
      {/* "tv" text */}
      <path d="M57 23h-6.5v-4h17.5v4H61.5v21H57V23z" />
      <path d="M68.5 19h4.8l6.2 18.5L85.8 19h4.6L81.2 46h-3.5L68.5 19z" />
      {/* "+" */}
      <rect x="100" y="28" width="20" height="4" rx="1" />
      <rect x="108" y="20" width="4" height="20" rx="1" />
    </svg>
  )
}

export function ParamountPlusLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 200 50" className={className} fill="currentColor" aria-hidden="true">
      {/* Mountain peak */}
      <path d="M28 8l-6 14h3l3-7 3 7h3L28 8z" opacity="0.5" />
      <path d="M28 2l-8 20h4l4-10 4 10h4L28 2z" />
      {/* Stars */}
      <circle cx="16" cy="16" r="1.2" />
      <circle cx="20" cy="10" r="1.2" />
      <circle cx="28" cy="6" r="1" />
      <circle cx="36" cy="10" r="1.2" />
      <circle cx="40" cy="16" r="1.2" />
      {/* Text */}
      <text x="8" y="42" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="16" letterSpacing="0.5" fill="currentColor">
        {"PARAMOUNT"}
      </text>
      {/* + */}
      <text x="158" y="42" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="18" fill="currentColor">
        {"+"}
      </text>
    </svg>
  )
}

export function CanalPlusLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 160 50" className={className} fill="currentColor" aria-hidden="true">
      {/* CANAL text */}
      <text x="4" y="36" fontFamily="Arial Black, Impact, sans-serif" fontWeight="900" fontSize="30" letterSpacing="3" fill="currentColor">
        {"CANAL"}
      </text>
      {/* + in a circle */}
      <circle cx="138" cy="26" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <rect x="132" y="24" width="12" height="3.5" rx="0.5" />
      <rect x="136.2" y="18" width="3.5" height="16" rx="0.5" />
    </svg>
  )
}

export function CrunchyrollLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 200 50" className={className} fill="currentColor" aria-hidden="true">
      {/* CR icon - simplified */}
      <circle cx="20" cy="25" r="16" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="26" cy="18" r="5" />
      <path d="M12 30a12 12 0 0 1 4-16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Text */}
      <text x="44" y="33" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="18" letterSpacing="0.3" fill="currentColor">
        {"Crunchyroll"}
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
      return <DisneyPlusLogo className={logoClass} />
    case "max":
      return <HBOMaxLogo className={logoClass} />
    case "prime-video":
      return <PrimeVideoLogo className={logoClass} />
    case "apple-tv-plus":
      return <AppleTVPlusLogo className={logoClass} />
    case "paramount-plus":
      return <ParamountPlusLogo className={logoClass} />
    case "canal-plus":
      return <CanalPlusLogo className={logoClass} />
    case "crunchyroll":
      return <CrunchyrollLogo className={logoClass} />
    default:
      return null
  }
}
