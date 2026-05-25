import { useEffect, useState, useMemo } from 'react'
import EventCard from './EventCard.jsx'

export default function Carousel3D({ items }) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Take up to 10 items for the carousel
  const displayItems = useMemo(() => {
    if (!items) return []
    return items.slice(0, 10)
  }, [items])

  const count = displayItems.length

  useEffect(() => {
    if (count <= 1) return
    const t = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count)
    }, 3000)
    return () => clearInterval(t)
  }, [count])

  if (count === 0) return null

  return (
    <div className="relative mx-auto flex h-[500px] w-full items-center justify-center overflow-hidden [perspective:1200px]">
      <div className="relative h-[380px] w-[210px] [transform-style:preserve-3d]">
        {displayItems.map((event, i) => {
          // Calculate circular offset
          let offset = (i - activeIndex) % count
          if (offset < 0) offset += count // convert to positive modulo
          if (offset > count / 2) offset -= count // shift to -N/2 to N/2

          const absOffset = Math.abs(offset)
          const direction = offset === 0 ? 0 : offset < 0 ? -1 : 1

          // Coverflow math
          const z = offset === 0 ? 150 : -absOffset * 80
          const x = offset * 130 + direction * 80
          const rotateY = -direction * 45 // Left items rotate right, Right items rotate left
          const opacity = absOffset >= 4 ? 0 : 1 - absOffset * 0.15
          const zIndex = 100 - absOffset

          return (
            <div
              key={event.id}
              className="absolute inset-0 transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
              style={{
                transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg)`,
                zIndex,
                opacity,
                pointerEvents: absOffset > 1 ? 'none' : 'auto',
              }}
              onClick={() => {
                if (offset !== 0) {
                  // Click adjacent items to focus them
                  setActiveIndex(i)
                }
              }}
            >
              <EventCard event={event} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
