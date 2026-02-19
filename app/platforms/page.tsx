import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import Image from "next/image"

const PLATFORMS = [
  { id: "netflix", name: "Netflix", networkId: 213, color: "from-red-600 to-red-900", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
  { id: "disney", name: "Disney+", networkId: 2739, color: "from-blue-600 to-blue-900", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg" },
  { id: "hbo", name: "HBO", networkId: 49, color: "from-violet-700 to-indigo-900", logo: "https://upload.wikimedia.org/wikipedia/commons/d/de/HBO_logo.svg" },
  { id: "prime", name: "Prime Video", networkId: 1024, color: "from-cyan-600 to-blue-800", logo: "https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg" },
  { id: "apple", name: "Apple TV+", networkId: 2552, color: "from-gray-600 to-gray-900", logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg" },
  { id: "paramount", name: "Paramount+", networkId: 4330, color: "from-blue-500 to-blue-800", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Paramount_Plus.svg" },
]

export default function PlatformsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Platformes</h1>
          <p className="mb-8 text-muted-foreground">Explorez le catalogue de vos services de streaming preferes</p>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {PLATFORMS.map((platform) => (
              <Link
                key={platform.id}
                href={`/platforms/${platform.id}`}
                className="group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-violet-800/20 bg-card p-8 transition-all hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-900/20 hover:scale-[1.02]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-10 transition-opacity group-hover:opacity-20`} />
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="flex h-20 w-40 items-center justify-center">
                    <Image
                      src={platform.logo}
                      alt={platform.name}
                      width={160}
                      height={60}
                      className="max-h-14 w-auto brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <span className="text-lg font-semibold text-foreground">{platform.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
