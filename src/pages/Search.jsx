import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import EventCard from '../components/EventCard.jsx'
import { useEvents } from '../hooks/useEvents.js'
import { useBooking } from '../context/BookingContext.jsx'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [tab, setTab] = useState('all')
  const { city } = useBooking()
  const allEvents = useEvents()

  const searchResults = useMemo(() => {
    let results = allEvents
    if (city) results = results.filter((e) => e.city === city)
    if (!query.trim()) return results
    const lowerQuery = query.toLowerCase()
    return results.filter((e) =>
      e.title.toLowerCase().includes(lowerQuery) ||
      e.category.toLowerCase().includes(lowerQuery) ||
      (Array.isArray(e.genre)
        ? e.genre.some(g => g.toLowerCase().includes(lowerQuery))
        : e.genre.toLowerCase().includes(lowerQuery)) ||
      e.venue.toLowerCase().includes(lowerQuery) ||
      e.city.toLowerCase().includes(lowerQuery)
    )
  }, [query, city, allEvents])

  const filtered = useMemo(() => {
    if (tab === 'all') return searchResults
    return searchResults.filter((e) => e.category === tab)
  }, [searchResults, tab])

  function onSubmit(e) {
    e.preventDefault()
    const v = query.trim()
    if (v) setSearchParams({ q: v })
    else setSearchParams({})
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Search
        </h1>
        <p className="mt-1 text-sm text-white/55">
          Search results in{' '}
          <span className="text-white/80">{city}</span>.
        </p>
      </div>

      <form onSubmit={onSubmit} className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
        <input
          value={query}
          onChange={(e) => {
            const v = e.target.value
            setSearchParams(v ? { q: v } : {}, { replace: true })
          }}
          placeholder="Movies, artists, venues…"
          className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-base text-white outline-none transition focus:border-[#f84464]/45"
        />
      </form>

      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'All' },
          { key: 'movies', label: 'Movies' },
          { key: 'concerts', label: 'Concerts' },
          { key: 'sports', label: 'Sports' },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={[
              'shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition active:scale-[0.98]',
              tab === t.key
                ? 'border-[#f84464]/35 bg-[#f84464]/15 text-white'
                : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#1a1a2e]/45 px-6 py-16 text-center backdrop-blur-xl">
          <div className="mx-auto mb-6 grid h-36 w-36 place-items-center rounded-full border border-dashed border-white/15 bg-white/5">
            <svg
              viewBox="0 0 120 120"
              className="h-28 w-28 text-white/25"
              aria-hidden
            >
              <circle cx="60" cy="60" r="44" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 8" />
              <circle cx="48" cy="52" r="10" fill="currentColor" opacity="0.35" />
              <path d="M38 78c10 14 34 14 44 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M78 46l18 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-white">No results</p>
          <p className="mt-2 text-sm text-white/55">
            Try another keyword or switch category tabs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  )
}
