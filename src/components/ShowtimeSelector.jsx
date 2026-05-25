export default function ShowtimeSelector({
  showtimes = [],
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
}) {
  const dates = showtimes.map((s) => s.date)
  const active = showtimes.find((s) => s.date === selectedDate)
  const times = active?.times ?? []

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-white">Select date</h3>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {dates.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                onSelectDate(d)
                onSelectTime(null)
              }}
              className={[
                'shrink-0 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98]',
                selectedDate === d
                  ? 'border-[#f84464]/45 bg-[#f84464]/15 text-white'
                  : 'border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white',
              ].join(' ')}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white">Showtimes</h3>
        {!selectedDate ? (
          <p className="mt-3 text-sm text-white/45">Pick a date first.</p>
        ) : (
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {times.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onSelectTime(t)}
                className={[
                  'rounded-xl border px-3 py-2 text-sm font-semibold transition active:scale-[0.98]',
                  selectedTime === t
                    ? 'border-[#f84464]/45 bg-[#f84464]/15 text-white'
                    : 'border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white',
                ].join(' ')}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
