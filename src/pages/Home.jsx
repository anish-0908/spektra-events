import { useMemo, useState } from 'react'
import HeroCarousel from '../components/HeroCarousel.jsx'
import EventCard from '../components/EventCard.jsx'
import { events as mockEvents } from '../data/mockData.js'
import { Flame } from 'lucide-react'
import { useBooking } from '../context/BookingContext.jsx'

function SectionHeader({ title, subtitle, icon: Icon, right }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          {Icon ? (
            <div className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <Icon className="h-5 w-5 text-[#f84464]" />
            </div>
          ) : null}
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h2>
        </div>
        {subtitle ? (
          <div className="mt-1 text-sm text-white/55">{subtitle}</div>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  )
}

function HorizontalRow({ items }) {
  return (
    <div className="no-scrollbar flex gap-4 overflow-x-auto pb-1">
      {items.map((e) => (
        <div key={e.id} className="w-[180px] shrink-0 sm:w-[210px]">
          <EventCard event={e} />
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const { city } = useBooking()
  const [tab, setTab] = useState('all')

  const inCity = useMemo(
    () => mockEvents.filter((e) => !city || e.city === city),
    [city],
  )

  const byCategory = useMemo(() => {
    if (tab === 'all') return inCity
    return inCity.filter((e) => e.category === tab)
  }, [inCity, tab])

  const nowShowing = useMemo(
    () =>
      inCity
        .filter((e) => e.category === 'movies')
        .slice()
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10),
    [inCity],
  )
  const topConcerts = useMemo(
    () =>
      inCity
        .filter((e) => e.category === 'concerts')
        .slice()
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10),
    [inCity],
  )
  const liveSports = useMemo(
    () =>
      inCity
        .filter((e) => e.category === 'sports')
        .slice()
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10),
    [inCity],
  )
  const upcoming = useMemo(
    () =>
      inCity
        .slice()
        .sort((a, b) => String(a.date).localeCompare(String(b.date)))
        .slice(0, 10),
    [inCity],
  )

  const trending = useMemo(
    () =>
      byCategory
        .slice()
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 12),
    [byCategory],
  )

  return (
    <div className="space-y-10">
      <HeroCarousel />

      <div className="space-y-4">
        <SectionHeader
          title="Explore by category"
          subtitle="Premium picks across movies, concerts, sports and more."
        />
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'movies', 'concerts', 'sports', 'theatre', 'comedy'].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={[
                'rounded-full border px-4 py-2 text-sm font-semibold transition capitalize',
                tab === k
                  ? 'border-[#f84464]/35 bg-[#f84464]/15 text-white'
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white',
              ].join(' ')}
            >
              {k === 'all' ? 'All' : k}
            </button>
          ))}
        </div>
        
      </div>

      <div className="space-y-4">
        <SectionHeader
          title="Now Showing"
          subtitle={city ? `Top movies in ${city}` : 'Top movies right now'}
        />
        <HorizontalRow items={nowShowing} />
      </div>

      <div className="space-y-4">
        <SectionHeader
          title="Top Concerts"
          subtitle="Curated live sets with premium production."
        />
        <HorizontalRow items={topConcerts} />
      </div>

      <div className="space-y-4">
        <SectionHeader
          title="Live Sports"
          subtitle="Big matches, loud arenas, best seats."
        />
        <HorizontalRow items={liveSports} />
      </div>

      <div className="space-y-4">
        <SectionHeader
          title="Upcoming Events"
          subtitle="Plan ahead — the best experiences sell out early."
        />
        <HorizontalRow items={upcoming} />
      </div>

      <div className="space-y-4">
        <SectionHeader
          title="Trending"
          subtitle="Based on ratings and hype."
          icon={Flame}
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {trending.map((e) => <EventCard key={e.id} event={e} />)}
        </div>
      </div>
    </div>
  )
}

