import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  CreditCard,
  Smartphone,
  Wallet,
} from 'lucide-react'
import { events as mockEvents } from '../data/mockData.js'
import { useBooking } from '../context/BookingContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { apiGetEventById, apiCreateOrder, apiVerifyAndBook } from '../services/api.js'

// ── Confetti burst ────────────────────────────────────────────────────────────
function ConfettiBurst({ pieces }) {
  if (!pieces.length) return null
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, y: -12, x: 0, rotate: p.rot }}
          animate={{ opacity: 0, y: '110vh', x: p.drift, rotate: p.rot + 240 }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'easeOut' }}
          className="absolute top-0 h-3 w-2 rounded-sm"
          style={{ left: p.left, backgroundColor: p.color }}
        />
      ))}
    </div>
  )
}

// ── UPI input panel ───────────────────────────────────────────────────────────
function UpiPanel({ value, onChange, error }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-5 space-y-3"
    >
      <label className="block text-xs font-semibold uppercase tracking-wider text-white/45">
        UPI ID
      </label>
      <input
        id="upi-id-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="yourname@upi  (e.g. success@razorpay)"
        className={[
          'w-full rounded-2xl border bg-white/5 px-4 py-3 text-sm text-white outline-none transition',
          error
            ? 'border-[#f84464]/60 focus:border-[#f84464]'
            : 'border-white/10 focus:border-[#f84464]/50',
        ].join(' ')}
      />
      {error && <p className="text-xs text-[#f84464]">{error}</p>}
      <p className="text-xs text-white/35">
        Test UPI: <span className="font-mono text-white/60">success@razorpay</span>
      </p>
    </motion.div>
  )
}

// ── Card input panel ─────────────────────────────────────────────────────────
function CardPanel({ card, onChange, error }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-5 space-y-3"
    >
      <label className="block text-xs font-semibold uppercase tracking-wider text-white/45">
        Card Details
      </label>
      <input
        id="card-number-input"
        type="text"
        inputMode="numeric"
        maxLength={19}
        value={card.number}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
          onChange({ ...card, number: raw.replace(/(.{4})/g, '$1 ').trim() })
        }}
        placeholder="Card number  (test: 4111 1111 1111 1111)"
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[#f84464]/50"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          id="card-expiry-input"
          type="text"
          maxLength={5}
          value={card.expiry}
          onChange={(e) => {
            let v = e.target.value.replace(/\D/g, '').slice(0, 4)
            if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2)
            onChange({ ...card, expiry: v })
          }}
          placeholder="MM/YY  (e.g. 12/27)"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[#f84464]/50"
        />
        <input
          id="card-cvv-input"
          type="password"
          inputMode="numeric"
          maxLength={3}
          value={card.cvv}
          onChange={(e) => onChange({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
          placeholder="CVV  (e.g. 123)"
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[#f84464]/50"
        />
      </div>
      {error && <p className="text-xs text-[#f84464]">{error}</p>}
      <p className="text-xs text-white/35">
        Test card: <span className="font-mono text-white/60">4111 1111 1111 1111</span> · any future expiry · any 3-digit CVV
      </p>
    </motion.div>
  )
}

// ── Wallet panel ──────────────────────────────────────────────────────────────
function WalletPanel() {
  const wallets = ['Paytm', 'PhonePe', 'Amazon Pay', 'Mobikwik']
  const [selected, setSelected] = useState('Paytm')
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-5 space-y-3"
    >
      <label className="block text-xs font-semibold uppercase tracking-wider text-white/45">
        Choose Wallet
      </label>
      <div className="grid grid-cols-2 gap-2">
        {wallets.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => setSelected(w)}
            className={[
              'rounded-2xl border px-4 py-3 text-sm font-semibold transition',
              selected === w
                ? 'border-[#f84464]/45 bg-[#f84464]/10 text-white ring-1 ring-[#f84464]/30'
                : 'border-white/10 bg-white/5 text-white/65 hover:bg-white/10 hover:text-white',
            ].join(' ')}
          >
            {w}
          </button>
        ))}
      </div>
      <p className="text-xs text-white/35">
        Razorpay will handle wallet authentication after you proceed.
      </p>
    </motion.div>
  )
}

// ── Main Checkout ─────────────────────────────────────────────────────────────
export default function Checkout() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    selectedEventId,
    selectedDate,
    selectedTime,
    selectedSeats,
    setPromoCode,
    promoApplied,
    setPromoApplied,
    resetBooking,
    city,
  } = useBooking()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [payment, setPayment] = useState('upi')

  // UPI state
  const [upiId, setUpiId] = useState('')
  const [upiError, setUpiError] = useState('')

  // Card state
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '' })
  const [cardError, setCardError] = useState('')

  // Promo state
  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')

  // Payment flow state
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')
  const [success, setSuccess] = useState(false)
  const [confettiPieces, setConfettiPieces] = useState([])
  const [ticket, setTicket] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/login', { replace: true }); return }
    if (!selectedEventId || !selectedSeats.length) { navigate('/', { replace: true }); return }
  }, [user, selectedEventId, selectedSeats, navigate])

  useEffect(() => {
    async function loadEvent() {
      if (!selectedEventId) return
      try {
        setLoading(true)
        const mockEvent = mockEvents.find(e => e.id === selectedEventId)
        if (mockEvent) { setEvent(mockEvent); setLoading(false); return }
        const response = await apiGetEventById(selectedEventId)
        setEvent({ ...response.data, id: response.data._id || response.data.id })
      } catch {
        navigate('/', { replace: true })
      } finally {
        setLoading(false)
      }
    }
    loadEvent()
  }, [selectedEventId, navigate])

  // ── Pricing ────────────────────────────────────────────────────────────────
  const subtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0)
  const convenience = Math.round(subtotal * 0.12)

  let discount = 0
  if (promoApplied?.code === 'SPEKTRA10') discount = Math.min(Math.round(subtotal * 0.1), 300)
  else if (promoApplied?.code === 'EV50') discount = Math.min(50, subtotal + convenience)

  const grandTotal = Math.max(0, subtotal + convenience - discount)

  // ── Promo ──────────────────────────────────────────────────────────────────
  function applyPromo() {
    setPromoError('')
    const code = promoInput.trim().toUpperCase()
    if (!code) { setPromoApplied(null); setPromoCode(''); return }
    if (code === 'SPEKTRA10') { setPromoApplied({ code, discountAmount: Math.min(Math.round(subtotal * 0.1), 300) }); setPromoCode(code); return }
    if (code === 'EV50') { setPromoApplied({ code, discountAmount: 50 }); setPromoCode(code); return }
    setPromoApplied(null); setPromoCode('')
    setPromoError('Invalid code. Try SPEKTRA10 or EV50.')
  }

  // ── Validate payment method inputs ─────────────────────────────────────────
  function validateInputs() {
    if (payment === 'upi') {
      if (!upiId.trim()) { setUpiError('Please enter your UPI ID'); return false }
      if (!upiId.includes('@')) { setUpiError('Enter a valid UPI ID (e.g. name@upi)'); return false }
      setUpiError('')
    }
    if (payment === 'card') {
      const digits = card.number.replace(/\s/g, '')
      if (digits.length < 16) { setCardError('Enter a valid 16-digit card number'); return false }
      if (!card.expiry || card.expiry.length < 5) { setCardError('Enter a valid expiry date (MM/YY)'); return false }
      if (card.cvv.length < 3) { setCardError('Enter a valid 3-digit CVV'); return false }
      setCardError('')
    }
    return true
  }

  // ── Simple booking flow (no Razorpay) ─────────────────────────────────────
  async function handleBooking() {
    if (!user) {
      navigate('/login')
      return
    }

    if (!validateInputs()) return

    setPayError('')
    setPaying(true)

    try {
      // Create booking directly
      const verifyRes = await apiVerifyAndBook({
        razorpay_order_id: 'order_' + Date.now(),
        razorpay_payment_id: 'pay_' + Date.now(),
        razorpay_signature: 'sig_' + Date.now(),
        eventId: selectedEventId,
        eventTitle: event?.title,
        eventDate: selectedDate,
        showtime: selectedTime,
        venue: event?.venue,
        city: city || event?.city,
        seats: selectedSeats.length,
        seatNumbers: selectedSeats.map(s => s.id),
        category: selectedSeats[0]?.category || 'General',
        totalAmount: grandTotal,
        discount: discount,
        finalAmount: grandTotal,
        promoCode: promoApplied?.code || '',
        paymentMethod: payment === 'upi' ? 'UPI' : payment === 'card' ? 'Card' : 'Wallet',
      })

      if (verifyRes.data.success) {
        setTicket(verifyRes.data.ticket)
        // Fire confetti
        const rnd = () => Math.random()
        setConfettiPieces(
          Array.from({ length: 52 }, (_, i) => ({
            id: i,
            left: `${rnd() * 100}%`,
            drift: (rnd() - 0.5) * 180,
            delay: rnd() * 0.35,
            dur: 1.8 + rnd() * 1.2,
            rot: rnd() * 360,
            color: rnd() > 0.45 ? '#f84464' : rnd() > 0.5 ? '#ffffff' : '#fbbf24',
          }))
        )
        setSuccess(true)
      } else {
        setPayError('Booking failed. Please try again.')
      }
    } catch (err) {
      console.error('Booking error:', err)
      setPayError(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  function doneAndReset() {
    setConfettiPieces([])
    resetBooking()
    navigate('/')
  }

  // ── Loading / guard ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }
  if (!event) return null

  // ── Success screen ─────────────────────────────────────────────────────────
  if (success && ticket) {
    return (
      <div className="relative pb-10">
        <ConfettiBurst pieces={confettiPieces} />
        <div className="mx-auto max-w-lg space-y-8 pt-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 18, rotateX: 12 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-3xl border border-[#f84464]/30 bg-gradient-to-br from-[#1a1a2e] to-black p-8 text-left shadow-[0_0_60px_rgba(248,68,100,0.2)]"
          >
            {/* Glow */}
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#f84464]/20 blur-3xl" />

            {/* Payment verified badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">Payment Verified ✓</span>
            </div>

            {/* Brand strip */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-bold tracking-tight text-white">EventVerse</span>
              <span className="rounded-full bg-[#f84464]/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[#f84464]">
                {ticket.category}
              </span>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-white">{ticket.eventTitle}</h2>
            <p className="mt-1 text-sm text-white/55">{ticket.venue} · {ticket.city}</p>

            {/* Tear line */}
            <div className="my-5 flex items-center gap-0">
              <div className="-ml-8 h-5 w-5 rounded-full bg-black" />
              <div className="flex-1 border-t-2 border-dashed border-white/15" />
              <div className="-mr-8 h-5 w-5 rounded-full bg-black" />
            </div>

            {/* Details grid */}
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <TicketRow label="Date"       value={ticket.eventDate} />
              <TicketRow label="Showtime"   value={ticket.showtime} />
              <TicketRow label="Seats"      value={Array.isArray(ticket.seatNumbers) ? ticket.seatNumbers.join(', ') : `${ticket.seats} seat(s)`} />
              <TicketRow label="Category"   value={ticket.category} />
              <TicketRow label="Booking ID" value={ticket.bookingId} accent />
              <TicketRow label="Amount Paid" value={`₹${ticket.finalAmount}`} accent />
            </div>

            {/* Payment ID */}
            <div className="mt-4 rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-xs">
              <span className="text-white/40">Payment ID: </span>
              <span className="font-mono text-white/65">{ticket.paymentId}</span>
            </div>
          </motion.div>

          <div className="flex gap-3">
            <button
              id="ticket-go-home-btn"
              type="button"
              onClick={doneAndReset}
              className="flex-1 rounded-2xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              🏠 Go Home
            </button>
            <button
              id="ticket-my-bookings-btn"
              type="button"
              onClick={() => { resetBooking(); navigate('/my-bookings') }}
              className="flex-1 rounded-2xl bg-[#f84464] py-3 text-sm font-semibold text-black transition hover:brightness-110"
            >
              🎟️ My Bookings
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Main checkout UI ───────────────────────────────────────────────────────
  return (
    <div className="relative pb-10">
      <ConfettiBurst pieces={[]} />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left column */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
            <p className="mt-1 text-sm text-white/55">
              Complete your payment securely via Razorpay.
            </p>
          </div>

          {/* Order summary */}
          <section className="rounded-3xl border border-white/10 bg-[#1a1a2e]/55 p-6 backdrop-blur-xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/45">
              Order Summary
            </h2>
            <div className="mt-4 flex gap-4">
              <img
                src={event.posterImage}
                alt=""
                className="h-28 w-20 shrink-0 rounded-xl object-cover ring-1 ring-white/10"
              />
              <div className="min-w-0 flex-1 space-y-2 text-sm">
                <div className="text-lg font-semibold leading-tight text-white">{event.title}</div>
                <div className="text-white/65">{event.venue}</div>
                <div className="text-white/55">{city}</div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/75">{selectedDate}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/75">{selectedTime}</span>
                </div>
                <div className="pt-2 text-xs text-white/45">
                  Seats: <span className="font-semibold text-white/80">{selectedSeats.map(s => s.id).join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Promo code */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                id="promo-input"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                placeholder="Promo code (try SPEKTRA10 or EV50)"
                className="w-full flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[#f84464]/45"
              />
              <button
                type="button"
                onClick={applyPromo}
                className="rounded-2xl bg-[#f84464] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.99]"
              >
                Apply
              </button>
            </div>
            {promoError  && <p className="mt-2 text-sm text-[#f84464]">{promoError}</p>}
            {promoApplied && <p className="mt-2 text-sm text-emerald-400">✓ Applied <strong>{promoApplied.code}</strong> — saving ₹{promoApplied.discountAmount}</p>}
          </section>

          {/* Payment method */}
          <section className="rounded-3xl border border-white/10 bg-[#1a1a2e]/55 p-6 backdrop-blur-xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/45">
              Payment Method
            </h2>

            {/* Method selector tabs */}
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { key: 'upi',    label: 'UPI',    Icon: Smartphone },
                { key: 'card',   label: 'Card',   Icon: CreditCard },
                { key: 'wallet', label: 'Wallet', Icon: Wallet },
              ].map((opt) => (
                <button
                  key={opt.key}
                  id={`payment-method-${opt.key}`}
                  type="button"
                  onClick={() => { setPayment(opt.key); setUpiError(''); setCardError('') }}
                  className={[
                    'flex items-center gap-3 rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition active:scale-[0.99]',
                    payment === opt.key
                      ? 'border-[#f84464]/45 bg-[#f84464]/10 text-white ring-1 ring-[#f84464]/35'
                      : 'border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white',
                  ].join(' ')}
                >
                  <opt.Icon className="h-5 w-5 text-[#f84464]" />
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Dynamic input based on selected method */}
            {payment === 'upi'    && <UpiPanel  value={upiId} onChange={setUpiId} error={upiError} />}
            {payment === 'card'   && <CardPanel card={card}  onChange={setCard}   error={cardError} />}
            {payment === 'wallet' && <WalletPanel />}
          </section>
        </div>

        {/* Right: Price + Pay */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-white/10 bg-[#1a1a2e]/70 p-6 backdrop-blur-xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/45">
              Price Breakdown
            </h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-white/65">
                <dt>Tickets ({selectedSeats.length})</dt>
                <dd>₹{subtotal}</dd>
              </div>
              <div className="flex justify-between text-white/65">
                <dt>Convenience fee</dt>
                <dd>₹{convenience}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <dt>Discount ({promoApplied?.code})</dt>
                  <dd>− ₹{discount}</dd>
                </div>
              )}
              <div className="border-t border-white/10 pt-4">
                <div className="flex justify-between text-lg font-semibold text-white">
                  <dt>Total</dt>
                  <dd>₹{grandTotal}</dd>
                </div>
              </div>
            </dl>

            {payError && (
              <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                {payError}
              </p>
            )}

            <button
              id="pay-now-btn"
              type="button"
              onClick={handleBooking}
              disabled={paying}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f84464] py-4 text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.99] disabled:opacity-60"
            >
              <CheckCircle2 className="h-4 w-4" />
              {paying ? 'Processing...' : `Confirm Booking - ₹${grandTotal}`}
            </button>

            <p className="mt-3 text-center text-xs text-white/35">
              🔒 Secure booking · Your data is safe
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

// ── Helper ────────────────────────────────────────────────────────────────────
function TicketRow({ label, value, accent }) {
  return (
    <div>
      <p className="text-xs text-white/40 uppercase tracking-wider">{label}</p>
      <p className={`mt-0.5 font-semibold ${accent ? 'text-[#f84464]' : 'text-white'}`}>{value}</p>
    </div>
  )
}
