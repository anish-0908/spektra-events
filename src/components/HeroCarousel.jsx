import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents.js'

export default function HeroCarousel() {
  const [idx, setIdx] = useState(0)
  const allEvents = useEvents()

  const featured = useMemo(() => {
    return [...allEvents]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5)
  }, [allEvents])

  useEffect(() => {
    if (featured.length === 0) return
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % featured.length)
    }, 4000)
    return () => clearInterval(t)
  }, [featured.length])

  if (featured.length === 0) {
    return (
      <section className="relative flex h-[450px] w-full items-center justify-center overflow-hidden sm:h-[600px] lg:h-[700px] mt-4">
        <div className="text-white/50">Loading...</div>
      </section>
    )
  }

  const current = featured[idx]

  return (
    <section className="relative flex h-[450px] w-full items-center justify-center overflow-hidden [perspective:1500px] sm:h-[600px] lg:h-[700px] mt-4">
      <div className="relative w-[75%] max-w-[1400px] aspect-[16/9] sm:aspect-[21/9] [transform-style:preserve-3d]">
        {featured.map((current, i) => {
          let offset = (i - idx) % featured.length
          if (offset < 0) offset += featured.length
          if (offset > featured.length / 2) offset -= featured.length

          const absOffset = Math.abs(offset)
          const direction = offset === 0 ? 0 : offset < 0 ? -1 : 1

          const z = offset === 0 ? 150 : -absOffset * 200
          const x = offset * 65 + direction * 15 // percentages
          const rotateY = -direction * 40
          const opacity = absOffset >= 3 ? 0 : 1 - absOffset * 0.3
          const zIndex = 100 - absOffset

          return (
            <div
              key={current.id}
              className="absolute inset-0 overflow-hidden rounded-3xl shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
              style={{
                transform: `translateX(${x}%) translateZ(${z}px) rotateY(${rotateY}deg)`,
                zIndex,
                opacity,
                pointerEvents: offset === 0 ? 'auto' : 'none',
              }}
              onClick={() => {
                if (offset !== 0) setIdx(i)
              }}
            >
              <img
                src={current.bannerImage}
                alt={current.title}
                className="h-full w-full object-cover"
                loading={absOffset === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

              {offset === 0 && (
                <div className="absolute left-6 top-1/2 w-[min(560px,80%)] -translate-y-1/2 transition-opacity duration-700">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/75 backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-[#f84464]" />
                    Featured
                    <span className="text-white/40">•</span>
                    <span className="capitalize">{current.category}</span>
                  </div>
                  <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                    {current.title}
                  </h1>
                  <p className="mt-2 line-clamp-2 text-sm text-white/65 sm:text-base">
                    {current.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Link
                      to={`/event/${current.id}`}
                      className="rounded-2xl bg-[#f84464] px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.99]"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/browse/${current.category}`}
                      className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10 active:scale-[0.99]"
                    >
                      Explore {current.category}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 z-[200] flex -translate-x-1/2 gap-2">
        {featured.map((e, i) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setIdx(i)}
            className={[
              'h-2.5 rounded-full transition-all duration-500',
              i === idx ? 'w-8 bg-[#f84464]' : 'w-2.5 bg-white/30 hover:bg-white/50',
            ].join(' ')}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

