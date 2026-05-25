import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, Star } from 'lucide-react'

export default function EventCard({ event }) {
  const fillingFast = Number(event.rating) > 8.5
  const eventId = event._id || event.id // Support both MongoDB _id and mock id

  return (
    <Link
      to={`/event/${eventId}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a2e]/60 transition will-change-transform hover:scale-[1.03] hover:border-[#f84464]/30 hover:shadow-[0_0_0_1px_rgba(248,68,100,0.18),0_16px_50px_rgba(248,68,100,0.18)] active:scale-[1.01]"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <img
          src={event.posterImage}
          alt={event.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.06]"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />

        {fillingFast ? (
          <div className="absolute left-3 top-3 rounded-full bg-[#f84464] px-3 py-1 text-xs font-semibold text-black shadow">
            Filling Fast
          </div>
        ) : null}

        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-xs text-white/85 ring-1 ring-white/10">
          <Star className="h-3.5 w-3.5 text-[#f84464]" />
          <span className="font-semibold">{event.rating}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold tracking-tight text-white">
              {event.title}
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/70">
                {event.category}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/70">
                {Array.isArray(event.genre) ? event.genre.join(', ') : event.genre}
              </span>
            </div>
          </div>

          <div className="shrink-0 rounded-xl bg-white/5 px-2.5 py-2 text-sm font-semibold text-white/85 ring-1 ring-white/10">
            ₹{event.price}
          </div>
        </div>

        <div className="mt-3 space-y-1.5 text-sm text-white/65">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-white/45" />
            <span className="truncate">{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-white/45" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute -inset-24 bg-[radial-gradient(circle_at_30%_30%,rgba(248,68,100,0.18),transparent_55%)]" />
      </div>
    </Link>
  )
}

