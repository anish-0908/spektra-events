import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import FilterSidebar from '../components/FilterSidebar.jsx'
import { defaultBrowseFilters } from '../constants/browseFilters.js'
import EventCard from '../components/EventCard.jsx'
import { events as mockEvents } from '../data/mockData.js'
import { useBooking } from '../context/BookingContext.jsx'

const VALID = new Set(['movies', 'concerts', 'sports', 'theatre', 'comedy'])

export default function Browse() {
  const { category } = useParams()
  const { city } = useBooking()
  const [filters, setFilters] = useState(() => defaultBrowseFilters())
  const [sortBy, setSortBy] = useState('popularity')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const cat = VALID.has(category) ? category : 'movies'

  const pool = useMemo(() => {
    return mockEvents.filter((e) => {
      // Filter by category
      if (e.category !== cat) return false
      // Filter by city (if city is selected)
      if (city && e.city !== city) return false
      return true
    })
  }, [cat, city])

  const genreOptions = useMemo(() => {
    const s = new Set()
    pool.forEach((e) => {
      if (Array.isArray(e.genre)) {
        e.genre.forEach(g => s.add(g))
      } else {
        s.add(e.genre)
      }
    })
    return [...s].sort()
  }, [pool])

  const languageOptions = useMemo(() => {
    const s = new Set()
    pool.forEach((e) => s.add(e.language))
    return [...s].sort()
  }, [pool])

  const filtered = useMemo(() => {
    return pool.filter((e) => {
      // Genre filter - handle array of genres
      if (filters.genres.length) {
        const eventGenres = Array.isArray(e.genre) ? e.genre : [e.genre]
        const hasMatchingGenre = eventGenres.some(g => filters.genres.includes(g))
        if (!hasMatchingGenre) return false
      }
      if (filters.languages.length && !filters.languages.includes(e.language))
        return false
      if (e.rating < filters.ratingMin) return false
      if (e.price < filters.priceMin || e.price > filters.priceMax) return false
      if (filters.dateFrom) {
        const ev = String(e.date)
        if (ev < filters.dateFrom) return false
      }
      return true
    })
  }, [pool, filters])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    if (sortBy === 'popularity') arr.sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'date')
      arr.sort((a, b) => String(a.date).localeCompare(String(b.date)))
    else if (sortBy === 'price') arr.sort((a, b) => a.price - b.price)
    return arr
  }, [filtered, sortBy])

  const title =
    cat.charAt(0).toUpperCase() + cat.slice(1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Browse {title}
        </h1>
        <p className="mt-1 text-sm text-white/55">
          In <span className="text-white/80">{city}</span> • watch in your city
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 lg:hidden">
        <div className="text-sm text-white/55">
          {sorted.length} event{sorted.length === 1 ? '' : 's'}
        </div>
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.99]"
        >
          <SlidersHorizontal className="h-4 w-4 text-[#f84464]" />
          Filters
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <FilterSidebar
          genres={genreOptions}
          languages={languageOptions}
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(defaultBrowseFilters())}
          variant="desktop"
        />

        <div className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="hidden text-sm text-white/55 lg:block">
              {sorted.length} event{sorted.length === 1 ? '' : 's'} match your
              filters
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/45">
                Sort by
              </span>
              {[
                { key: 'popularity', label: 'Popularity' },
                { key: 'date', label: 'Date' },
                { key: 'price', label: 'Price' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSortBy(opt.key)}
                  className={[
                    'rounded-full border px-4 py-2 text-sm font-semibold transition active:scale-[0.98]',
                    sortBy === opt.key
                      ? 'border-[#f84464]/35 bg-[#f84464]/15 text-white'
                      : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {sorted.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-16 text-center">
              <p className="text-lg font-semibold text-white">
                No events match
              </p>
              <p className="mt-2 text-sm text-white/55">
                Try widening price range or clearing filters.
              </p>
              <button
                type="button"
                onClick={() => setFilters(defaultBrowseFilters())}
                className="mt-6 rounded-2xl bg-[#f84464] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.99]"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {sorted.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close overlay"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto p-4 pb-8">
            <FilterSidebar
              genres={genreOptions}
              languages={languageOptions}
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(defaultBrowseFilters())}
              variant="mobile"
              onCloseMobile={() => setMobileFiltersOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
