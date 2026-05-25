import { useNavigate } from 'react-router-dom'
import { Armchair, ArrowRight } from 'lucide-react'
import { useBooking } from '../context/BookingContext.jsx'

export default function TicketSummary({ event }) {
  const navigate = useNavigate()
  const { selectedSeats } = useBooking()

  const subtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0)
  const fees = Math.round(subtotal * 0.12)
  const total = subtotal + fees

  return (
    <div className="rounded-3xl border border-white/10 bg-[#1a1a2e]/70 p-5 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <Armchair className="h-4 w-4 text-[#f84464]" />
        Your seats
      </div>
      <p className="mt-2 truncate text-xs text-white/50">{event.title}</p>

      {selectedSeats.length === 0 ? (
        <p className="mt-4 text-sm text-white/55">
          Tap available seats to add them here.
        </p>
      ) : (
        <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto pr-1">
          {selectedSeats.map((s) => (
            <li
              key={s.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
            >
              <span className="font-semibold text-white">{s.id}</span>
              <span className="text-white/55 capitalize">{s.tier}</span>
              <span className="font-semibold text-white/90">₹{s.price}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-sm">
        <div className="flex justify-between text-white/65">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-white/65">
          <span>Convenience fee</span>
          <span>₹{fees}</span>
        </div>
        <div className="flex justify-between pt-2 text-base font-semibold text-white">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <button
        type="button"
        disabled={selectedSeats.length === 0}
        onClick={() => navigate('/checkout')}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f84464] py-3.5 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.99]"
      >
        Proceed
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}
