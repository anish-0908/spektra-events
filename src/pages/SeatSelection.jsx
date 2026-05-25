import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SeatMap from '../components/SeatMap.jsx'
import SportsSeatMap from '../components/SportsSeatMap.jsx'
import { tierPrices } from '../utils/seatPricing.js'
import TicketSummary from '../components/TicketSummary.jsx'
import { events as mockEvents } from '../data/mockData.js'
import { useBooking } from '../context/BookingContext.jsx'

export default function SeatSelection() {
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const { selectedSeats, setSelectedSeats, setSelectedEventId } = useBooking()

  useEffect(() => {
    // Find event from mock data
    const mockEvent = mockEvents.find(e => e.id === eventId)
    setEvent(mockEvent || null)
    setLoading(false)
  }, [eventId])

  const pricesByTier = useMemo(
    () => (event ? tierPrices(event) : { premium: 0, gold: 0, silver: 0 }),
    [event],
  )

  useEffect(() => {
    if (event) setSelectedEventId(event.id)
  }, [event, setSelectedEventId])

  useEffect(() => {
    setSelectedSeats([])
  }, [eventId, setSelectedSeats])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white">Event not found</div>
      </div>
    )
  }

  function toggleSeat(seat) {
    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === seat.id)
      if (exists) return prev.filter((s) => s.id !== seat.id)
      if (prev.length >= 8) return prev
      return [...prev, seat]
    })
  }

  if (!event) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
        <p className="text-lg font-semibold">Event not found</p>
        <Link
          to="/"
          className="mt-4 inline-block rounded-2xl bg-[#f84464] px-6 py-3 text-sm font-semibold text-black"
        >
          Back home
        </Link>
      </div>
    )
  }

  const selectedIds = selectedSeats.map((s) => s.id)

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Pick your seats
          </h1>
          <p className="mt-1 text-sm text-white/55">
            {event.title} • Rows A–L, 12 seats each • Premium / Gold / Silver
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#1a1a2e]/45 p-4 backdrop-blur-xl sm:p-6">
          {event.category === 'sports' ? (
            <SportsSeatMap
              eventId={event.id}
              pricesByTier={pricesByTier}
              selectedIds={selectedIds}
              onToggle={toggleSeat}
            />
          ) : (
            <SeatMap
              eventId={event.id}
              pricesByTier={pricesByTier}
              selectedIds={selectedIds}
              onToggle={toggleSeat}
            />
          )}
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <TicketSummary event={event} />
      </div>
    </div>
  )
}
