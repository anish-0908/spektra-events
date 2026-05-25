import React from 'react'

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

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

function describeArc(x, y, innerRadius, outerRadius, startAngle, endAngle) {
  const startInner = polarToCartesian(x, y, innerRadius, endAngle)
  const endInner = polarToCartesian(x, y, innerRadius, startAngle)
  const startOuter = polarToCartesian(x, y, outerRadius, endAngle)
  const endOuter = polarToCartesian(x, y, outerRadius, startAngle)

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  const d = [
    'M', startOuter.x, startOuter.y,
    'A', outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
    'L', endInner.x, endInner.y,
    'A', innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
    'Z',
  ].join(' ')

  return d
}

export default function SportsSeatMap({
  eventId,
  pricesByTier,
  selectedIds,
  onToggle,
}) {
  const SIZE = 700
  const CENTER = SIZE / 2

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-6 text-xs text-white/55">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#f84464]/85 ring-1 ring-white/15" />
          Premium
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-amber-400/85 ring-1 ring-white/15" />
          Gold
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-sky-500/85 ring-1 ring-white/15" />
          Silver
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-white/15 ring-1 ring-white/15" />
          Booked
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-black/20 p-4">
        <div className="mx-auto aspect-square w-full min-w-[500px]">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full drop-shadow-xl">
            {/* Field */}
            <rect
              x={CENTER - 50}
              y={CENTER - 80}
              width={100}
              height={160}
              rx={20}
              fill="#4ade80"
              fillOpacity={0.2}
              stroke="#4ade80"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <circle cx={CENTER} cy={CENTER} r={20} stroke="#4ade80" strokeWidth="2" fill="none" opacity={0.5} />
            <line x1={CENTER - 50} y1={CENTER} x2={CENTER + 50} y2={CENTER} stroke="#4ade80" strokeWidth="2" opacity={0.5} />

            <text x={CENTER} y={CENTER} fill="#4ade80" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" opacity={0.6} transform={`rotate(-90 ${CENTER} ${CENTER})`}>
              FIELD
            </text>

            {/* Seats */}
            {ROWS.map((row, rIndex) => {
              const tier = tierForRow(row)
              // Base radius must be > 100 to clear the field
              const innerRadius = 110 + rIndex * 18
              const outerRadius = innerRadius + 14

              // Colors based on tier
              const baseColor =
                tier === 'premium'
                  ? '#f84464'
                  : tier === 'gold'
                    ? '#fbbf24'
                    : '#0ea5e9'

              return Array.from({ length: 12 }, (_, i) => {
                const num = i + 1
                const id = `${row}${num}`
                const booked = seatBooked(eventId, row, num)
                const selected = selectedIds.includes(id)

                const startAngle = i * 30 + 1.5
                const endAngle = (i + 1) * 30 - 1.5

                const pathData = describeArc(CENTER, CENTER, innerRadius, outerRadius, startAngle, endAngle)

                let fill = baseColor
                let opacity = 0.8
                let stroke = 'none'

                if (booked) {
                  fill = '#ffffff'
                  opacity = 0.1
                } else if (selected) {
                  fill = '#ffffff'
                  opacity = 1
                  stroke = baseColor
                }

                // calculate text position for section labels in the outermost row
                const textPos = polarToCartesian(CENTER, CENTER, outerRadius + 15, startAngle + 13.5)

                return (
                  <g key={id}>
                    <path
                      d={pathData}
                      fill={fill}
                      fillOpacity={opacity}
                      stroke={stroke}
                      strokeWidth={selected ? 2 : 0}
                      className={booked ? 'cursor-not-allowed' : 'cursor-pointer transition-all hover:opacity-100'}
                      onClick={() => {
                        if (!booked) {
                          onToggle({
                            id,
                            row,
                            number: num,
                            tier,
                            price: pricesByTier[tier],
                          })
                        }
                      }}
                    >
                      <title>{`Seat ${id} (${tier}) - ₹${pricesByTier[tier]}`}</title>
                    </path>
                    {/* Add row labels to the first seat of each row */}
                    {i === 0 && (
                      <text
                        x={CENTER}
                        y={CENTER - innerRadius - 4}
                        fill="rgba(255,255,255,0.4)"
                        fontSize="8"
                        textAnchor="middle"
                      >
                        {row}
                      </text>
                    )}
                    {/* Add section numbers around the stadium */}
                    {rIndex === ROWS.length - 1 && (
                      <text
                        x={textPos.x}
                        y={textPos.y}
                        fill="rgba(255,255,255,0.5)"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {num}
                      </text>
                    )}
                  </g>
                )
              })
            })}
          </svg>
        </div>
      </div>
    </div>
  )
}
