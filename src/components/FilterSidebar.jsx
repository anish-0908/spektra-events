import { SlidersHorizontal, X } from 'lucide-react'

const PRICE_MIN = 0
const PRICE_MAX = 2500

export default function FilterSidebar({
  genres,
  languages,
  filters,
  onChange,
  onReset,
  variant = 'desktop',
  onCloseMobile,
}) {
  function toggleGenre(g) {
    const next = filters.genres.includes(g)
      ? filters.genres.filter((x) => x !== g)
      : [...filters.genres, g]
    onChange({ ...filters, genres: next })
  }

  function toggleLanguage(l) {
    const next = filters.languages.includes(l)
      ? filters.languages.filter((x) => x !== l)
      : [...filters.languages, l]
    onChange({ ...filters, languages: next })
  }

  const body = (
    <>
      <div className="flex items-center justify-between gap-3 lg:hidden">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <SlidersHorizontal className="h-4 w-4 text-[#f84464]" />
          Filters
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/75 transition hover:bg-white/10 active:scale-[0.98]"
          aria-label="Close filters"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-6 pt-2 lg:pt-0">
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/45">
            Genre
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {genres.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => toggleGenre(g)}
                className={[
                  'rounded-full border px-3 py-1.5 text-xs font-semibold transition active:scale-[0.98]',
                  filters.genres.includes(g)
                    ? 'border-[#f84464]/45 bg-[#f84464]/15 text-white'
                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white',
                ].join(' ')}
              >
                {g}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/45">
            Date
          </h3>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#f84464]/45"
          />
          <p className="mt-2 text-xs text-white/45">
            Shows events on or after this date (uses event schedule date).
          </p>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/45">
            Price range (₹)
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="space-y-1">
              <span className="text-xs text-white/50">Min</span>
              <input
                type="number"
                min={PRICE_MIN}
                max={filters.priceMax}
                value={filters.priceMin}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    priceMin: Math.min(
                      Number(e.target.value) || 0,
                      filters.priceMax,
                    ),
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-[#f84464]/45"
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs text-white/50">Max</span>
              <input
                type="number"
                min={filters.priceMin}
                max={PRICE_MAX}
                value={filters.priceMax}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    priceMax: Math.max(
                      Number(e.target.value) || 0,
                      filters.priceMin,
                    ),
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition focus:border-[#f84464]/45"
              />
            </label>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/45">
              Min rating
            </h3>
            <span className="text-sm font-semibold text-[#f84464]">
              {filters.ratingMin.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={0.5}
            value={filters.ratingMin}
            onChange={(e) =>
              onChange({ ...filters, ratingMin: Number(e.target.value) })
            }
            className="mt-3 h-2 w-full cursor-pointer accent-[#f84464]"
          />
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/45">
            Language
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {languages.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => toggleLanguage(l)}
                className={[
                  'rounded-full border px-3 py-1.5 text-xs font-semibold transition active:scale-[0.98]',
                  filters.languages.includes(l)
                    ? 'border-[#f84464]/45 bg-[#f84464]/15 text-white'
                    : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white',
                ].join(' ')}
              >
                {l}
              </button>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={onReset}
          className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10 active:scale-[0.99]"
        >
          Clear all
        </button>
      </div>
    </>
  )

  if (variant === 'mobile') {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#0c0c12]/95 p-5 backdrop-blur-xl">
        {body}
      </div>
    )
  }

  return (
    <aside className="sticky top-24 hidden h-fit rounded-3xl border border-white/10 bg-[#1a1a2e]/55 p-5 backdrop-blur-xl lg:block">
      <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-white">
        <SlidersHorizontal className="h-4 w-4 text-[#f84464]" />
        Filters
      </div>
      {body}
    </aside>
  )
}
