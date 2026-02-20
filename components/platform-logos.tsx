"use client"

interface LogoProps {
  className?: string
}

export function NetflixLogo({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 111 30" className={className} aria-hidden="true">
      <path
        fill="#E50914"
        d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.874L94.468 0H99.5l3.062 8.095L105.687 0h4.937l-5.562 14.28zM90.47 0h-4.594v27.25c1.5.094 3.062.156 4.594.343V0zm-8.563 26.937c-4.187-.282-8.156-1.5-8.156-1.5V0h4.687v21.875c1.156.375 2.344.563 3.469.75v4.312zM64.25 10.657v4.687h-6.406V0H62.5v10.657h1.75zM57.344.375l.313 4.563c-3.125-.312-6.656-.343-6.656-.343v7.156h5.25v4.813h-5.25v9.375c1.562.092 3.124.187 4.625.343V0c-.062 0-3.063.157-5.282.375V.375h7zm-16.5 11.47V4.688h5.219V.001H35.782v.374h.063V26.72c1.5.094 3.032.155 4.593.343V11.845h.407zm-11.438 0V4.688h4.782V.001H24.344v.374h.063V26.72c1.5.094 3.03.155 4.593.343V11.845h.406zM18.75 16.22V0h-4.594v21.875c1.094.25 2.25.5 3.375.781l1.22-6.437zM4.782 12.938V0H.188v27.625c1.5.094 3.093.155 4.594.343V12.938z"
      />
    </svg>
  )
}

export function DisneyPlusLogo({ className }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className="font-bold tracking-tight text-[#113CCF]" style={{ fontSize: "inherit" }}>
        Disney+
      </span>
    </div>
  )
}

export function MaxLogo({ className }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className="font-bold tracking-tight text-[#002BE7]" style={{ fontSize: "inherit" }}>
        max
      </span>
    </div>
  )
}

export function PrimeVideoLogo({ className }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className="font-bold tracking-tight text-[#00A8E1]" style={{ fontSize: "inherit" }}>
        prime video
      </span>
    </div>
  )
}

export function AppleTVLogo({ className }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className="font-bold tracking-tight" style={{ fontSize: "inherit", color: "#A2AAAD" }}>
        tv+
      </span>
    </div>
  )
}

export function ParamountPlusLogo({ className }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className="font-bold tracking-tight text-[#0064FF]" style={{ fontSize: "inherit" }}>
        Paramount+
      </span>
    </div>
  )
}

export function CanalPlusLogo({ className }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className="font-bold uppercase tracking-widest" style={{ fontSize: "inherit", color: "#fff" }}>
        Canal+
      </span>
    </div>
  )
}

export function CrunchyrollLogo({ className }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className="font-bold tracking-tight text-[#F47521]" style={{ fontSize: "inherit" }}>
        Crunchyroll
      </span>
    </div>
  )
}

export function getPlatformLogo(slug: string, className?: string) {
  switch (slug) {
    case "netflix":
      return <NetflixLogo className={className} />
    case "disney-plus":
      return <DisneyPlusLogo className={className} />
    case "max":
      return <MaxLogo className={className} />
    case "prime-video":
      return <PrimeVideoLogo className={className} />
    case "apple-tv-plus":
      return <AppleTVLogo className={className} />
    case "paramount-plus":
      return <ParamountPlusLogo className={className} />
    case "canal-plus":
      return <CanalPlusLogo className={className} />
    case "crunchyroll":
      return <CrunchyrollLogo className={className} />
    default:
      return null
  }
}
