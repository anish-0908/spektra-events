import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiGetMyBookings, apiCancelBooking } from '../services/api.js'

const STATUS_STYLE = {
  confirmed: 'bg-green-500/20 text-green-300 border border-green-500/30',
  cancelled:  'bg-red-500/20 text-red-400 border border-red-500/30',
}

const CATEGORY_ICON = {
  movies:   '🎬',
  concerts: '🎵',
  sports:   '🏟',
  theatre:  '🎭',
  comedy:   '😂',
}

export default function MyBookings() {
  const navigate   = useNavigate()
  const [bookings, setBookings]   = useState([])
  const [loading,  setLoading]    = useState(true)
  const [error,    setError]      = useState('')
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('ev_token')
    if (!token) {
      navigate('/login')
      return
    }

    apiGetMyBookings()
      .then((res) => setBookings(res.data.data || []))
      .catch((err) => {
        if (err.response?.status === 401) navigate('/login')
        else setError('Failed to load bookings. Please try again.')
      })
      .finally(() => setLoading(false))
  }, [navigate])

  async function handleCancel(id) {
    if (!window.confirm('Cancel this booking? This cannot be undone.')) return
    setCancelling(id)
    try {
      await apiCancelBooking(id)
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b))
      )
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel. Please try again.')
    } finally {
      setCancelling(null)
    }
  }

  /* ── Loading skeleton ─────────────────────────── */
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10 sm:px-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-36 animate-pulse rounded-3xl bg-white/5" />
        ))}
      </div>
    )
  }

  /* ── Main render ──────────────────────────────── */
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Bookings</h1>
          <p className="mt-1 text-sm text-white/50">
            {bookings.length > 0
              ? `${bookings.length} booking${bookings.length !== 1 ? 's' : ''} found`
              : 'Your booking history'}
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white active:scale-[0.99]"
        >
          ← Browse Events
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!error && bookings.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-[#1a1a2e]/45 px-6 py-16 text-center backdrop-blur-xl">
          <div className="text-5xl">🎟</div>
          <h2 className="mt-4 text-xl font-semibold text-white">No bookings yet</h2>
          <p className="mt-2 text-sm text-white/50">
            Browse events and make your first booking — it's quick and easy.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 inline-block rounded-2xl bg-[#f84464] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.99]"
          >
            Browse Events
          </button>
        </div>
      )}

      {/* Bookings list */}
      {bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((b) => {
            const category = b.eventId?.category || ''
            return (
              <div
                key={b._id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-[#1a1a2e]/55 backdrop-blur-xl transition hover:border-white/20"
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                  {/* Category icon */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
                    {CATEGORY_ICON[category] || '🎫'}
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1 space-y-3">
                    {/* Title + badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">{b.eventTitle}</h3>
                      <span
                        className={[
                          'rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize',
                          STATUS_STYLE[b.status] || 'border border-white/10 bg-white/5 text-white/60',
                        ].join(' ')}
                      >
                        {b.status}
                      </span>
                    </div>

                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-white/55 sm:grid-cols-4">
                      <div>
                        <p className="text-white/35">Booking ID</p>
                        <p className="font-mono font-semibold text-[#f84464]">{b.bookingId}</p>
                      </div>
                      <div>
                        <p className="text-white/35">Date</p>
                        <p>{b.eventDate || '—'}</p>
                      </div>
                      <div>
                        <p className="text-white/35">Venue</p>
                        <p className="truncate">{b.venue || '—'}</p>
                      </div>
                      <div>
                        <p className="text-white/35">Seats</p>
                        <p>{b.seats}</p>
                      </div>
                    </div>

                    {/* Payment */}
                    <p className="text-xs text-white/40">
                      Paid via <span className="text-white/65">{b.paymentMethod}</span>
                      {' · '}
                      Booked {new Date(b.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Amount + cancel */}
                  <div className="flex shrink-0 flex-col items-end gap-3 sm:items-end">
                    <p className="text-xl font-bold text-white">
                      ₹<span className="text-[#f84464]">{b.totalAmount}</span>
                    </p>
                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        disabled={cancelling === b._id}
                        className="rounded-xl border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
                      >
                        {cancelling === b._id ? 'Cancelling…' : 'Cancel Booking'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
