const ROWS = 'ABCDEFGHIJKL'.split('')

function tierForRow(row) {
  if (row === 'A' || row === 'B') return 'premium'
  if ('CDEF'.includes(row)) return 'gold'
  return 'silver'
}

function seatBooked(eventId, row, num) {
  const s = `${eventId}-${row}-${num}`
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) % 6 === 0
}

export default function SeatMap({
  eventId,
  pricesByTier,
  selectedIds,
  onToggle,
}) {
  return (
    <div className="space-y-4">
      <div className="relative mx-auto max-w-xl rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.25em] text-white/45">
        Screen
        <div className="pointer-events-none absolute inset-x-8 top-full mt-2 h-8 rounded-b-[28px] border-x border-b border-white/10 bg-white/[0.03]" />
      </div>

      <div className="flex justify-center gap-6 pt-6 text-xs text-white/55">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#f84464]/85 ring-1 ring-white/15" />
          Premium
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-amber-400/85 ring-1 ring-white/15" />
          Gold
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-sky-500/85 ring-1 ring-white/15" />
          Silver
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-white/15 ring-1 ring-white/15" />
          Booked
        </span>
      </div>

      <div className="mx-auto max-w-4xl overflow-x-auto pb-2">
        <div
          className="mx-auto grid w-fit gap-x-2 gap-y-2"
          style={{
            gridTemplateColumns: `28px repeat(12, minmax(28px, 1fr))`,
          }}
        >
          <div />
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="text-center text-[10px] font-semibold text-white/35"
            >
              {i + 1}
            </div>
          ))}

          {ROWS.map((row) => {
            const tier = tierForRow(row)
            const tierColor =
              tier === 'premium'
                ? 'bg-[#f84464]/80 hover:bg-[#f84464]'
                : tier === 'gold'
                  ? 'bg-amber-400/80 hover:bg-amber-400'
                  : 'bg-sky-500/75 hover:bg-sky-500'

            return (
              <div key={row} className="contents">
                <div className="flex items-center justify-end pr-1 text-xs font-bold text-white/55">
                  {row}
                </div>
                {Array.from({ length: 12 }, (_, i) => {
                  const num = i + 1
                  const id = `${row}${num}`
                  const booked = seatBooked(eventId, row, num)
                  const selected = selectedIds.includes(id)

                  return (
                    <button
                      key={id}
                      type="button"
                      disabled={booked}
                      onClick={() =>
                        onToggle({
                          id,
                          row,
                          number: num,
                          tier,
                          price: pricesByTier[tier],
                        })
                      }
                      className={[
                        'h-7 w-7 rounded-md text-[10px] font-bold ring-1 transition active:scale-95',
                        booked
                          ? 'cursor-not-allowed bg-white/10 text-white/25 ring-white/10'
                          : selected
                            ? 'scale-105 bg-white text-black ring-white shadow-[0_0_0_2px_rgba(248,68,100,0.35)]'
                            : `${tierColor} text-black ring-black/10 hover:scale-105`,
                      ].join(' ')}
                      aria-label={`Seat ${row}${num}`}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
