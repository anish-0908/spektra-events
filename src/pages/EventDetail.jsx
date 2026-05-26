import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Clock, Globe, MapPin, Sparkles, Star } from 'lucide-react'
import ShowtimeSelector from '../components/ShowtimeSelector.jsx'
import ReviewSection from '../components/ReviewSection.jsx'
import { events as mockEvents } from '../data/mockData.js'
import { useBooking } from '../context/BookingContext.jsx'

function getLiveEvents() {
  try {
    const stored = JSON.parse(localStorage.getItem('ev_events') || '[]')
    const adminEvents = stored.filter(e => String(e.id).startsWith('evt_'))
    return [...adminEvents, ...mockEvents]
  } catch {
    return mockEvents
  }
}

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  const {
    setSelectedEventId,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    setSelectedSeats,
    city,
  } = useBooking()

  const [tab, setTab] = useState('about')

  useEffect(() => {
    const found = getLiveEvents().find(e => e.id === id)
    setEvent(found || null)
    setLoading(false)
  }, [id])

  useEffect(() => {
    if (!event) return
    setSelectedEventId(event.id)
    setSelectedDate(event.showtimes?.[0]?.date ?? '')
    setSelectedTime(null)
    setSelectedSeats([])
  }, [event, setSelectedDate, setSelectedEventId, setSelectedSeats, setSelectedTime])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
        <p className="text-lg font-semibold">Event not found</p>
        <Link to="/" className="mt-4 inline-block rounded-2xl bg-[#f84464] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110">
          Back home
        </Link>
      </div>
    )
  }

  const wrongCity = event.city !== city
  const canBook = Boolean(selectedDate && selectedTime && !wrongCity)

  function handleBook() {
    if (!selectedDate || !selectedTime) return
    navigate(`/book/${event.id}`)
  }

  return (
    <div className="space-y-1 pb-28">
      <div className="relative overflow-hidden rounded-2xl">
        <div className="relative aspect-[21/9] min-h-[220px] w-full overflow-hidden sm:min-h-[280px]">
          <img src={event.bannerImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
        </div>
      </div>

      <div className="relative z-[1] -mt-16 flex flex-col gap-6 sm:-mt-20 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex gap-5">
          <div className="relative hidden h-52 w-36 shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-2xl sm:block sm:h-60 sm:w-40">
            <img src={event.posterImage} alt={event.title} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold capitalize text-white/85 backdrop-blur">{event.category}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">{Array.isArray(event.genre) ? event.genre.join(', ') : event.genre}</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#f84464]/25 bg-[#f84464]/10 px-3 py-1 text-xs font-semibold text-[#f84464]">
                <Sparkles className="h-3.5 w-3.5" /> Spektra Exclusive
              </span>
            </div>
            <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{event.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/65">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-[#f84464] text-[#f84464]" />
                <span className="font-semibold text-white">{event.rating}</span> / 10
              </span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-white/45" />{event.duration}</span>
              <span className="inline-flex items-center gap-1.5"><Globe className="h-4 w-4 text-white/45" />{event.language}</span>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#1a1a2e]/55 p-5 backdrop-blur-xl lg:w-80">
          <div className="text-xs font-semibold uppercase tracking-wider text-white/45">From</div>
          <div className="mt-1 text-3xl font-semibold text-white">₹{event.price}</div>
          <p className="mt-2 text-sm text-white/55">Taxes & fees calculated at checkout.</p>
        </div>
      </div>

      {wrongCity ? (
        <div className="rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          This event is in <strong>{event.city}</strong>, but your selected city is <strong>{city}</strong>. Switch city in the header to book.
        </div>
      ) : null}

      <ShowtimeSelector
        showtimes={event.showtimes}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onSelectDate={setSelectedDate}
        onSelectTime={setSelectedTime}
      />

      <div className="rounded-3xl border border-white/10 bg-[#1a1a2e]/45 backdrop-blur-xl">
        <div className="flex gap-1 border-b border-white/10 p-2">
          {[{ key: 'about', label: 'About' }, { key: 'cast', label: 'Cast & Crew' }, { key: 'reviews', label: 'Reviews' }].map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={['flex-1 rounded-2xl px-3 py-2.5 text-sm font-semibold transition active:scale-[0.99]', tab === t.key ? 'bg-[#f84464]/15 text-white ring-1 ring-[#f84464]/35' : 'text-white/65 hover:bg-white/5 hover:text-white'].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="p-5 sm:p-6">
          {tab === 'about' && <p className="text-sm leading-relaxed text-white/70 sm:text-base">{event.description}</p>}
          {tab === 'cast' && (
            <div className="grid gap-4 sm:grid-cols-2">
              {event.cast.map((c) => (
                <div key={c.name + c.role} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <img src={c.image} alt="" className="h-16 w-16 rounded-2xl object-cover ring-1 ring-white/10" />
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-white">{c.name}</div>
                    <div className="text-sm text-white/55">{c.role}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === 'reviews' && (
            <ReviewSection eventId={event.id} eventTitle={event.title} />
          )}
        </div>
      </div>

      <section className="rounded-3xl border border-white/10 bg-[#1a1a2e]/45 p-6 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5">
            <MapPin className="h-5 w-5 text-[#f84464]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Venue</h3>
            <p className="mt-1 text-white/75">{event.venue}</p>
            <p className="mt-1 text-sm text-white/55">{event.city}</p>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/55 px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="hidden min-w-0 sm:block">
            <div className="truncate text-sm font-semibold text-white">{event.title}</div>
            <div className="truncate text-xs text-white/55">
              {selectedDate && selectedTime ? `${selectedDate} • ${selectedTime}` : 'Select date & showtime'}
            </div>
          </div>
          <button
            type="button"
            disabled={!canBook}
            onClick={handleBook}
            className="inline-flex w-full shrink-0 items-center justify-center rounded-2xl bg-[#f84464] px-8 py-3.5 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.99] sm:w-auto"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}
