import { Link } from 'react-router-dom'
import { CheckCircle, Calendar, Clock, MapPin, Ticket as TicketIcon } from 'lucide-react'

export default function TicketCard({ ticket }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      {/* Success Badge */}
      <div className="flex items-center justify-center gap-2 text-emerald-400">
        <CheckCircle className="h-16 w-16" />
        <div>
          <h2 className="text-2xl font-bold">Payment Successful!</h2>
          <p className="text-sm text-white/60">Your booking is confirmed</p>
        </div>
      </div>

      {/* Ticket Card */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-white/25 bg-gradient-to-br from-[#1a1a2e] to-black p-8 shadow-[0_0_60px_rgba(248,68,100,0.18)]">
        {/* Glow Effect */}
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#f84464]/20 blur-3xl" />
        
        <div className="relative space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/75">
                <TicketIcon className="h-3.5 w-3.5 text-[#f84464]" />
                Spektra Ticket
              </div>
              <h3 className="mt-3 text-2xl font-bold text-white">{ticket.eventTitle}</h3>
              <p className="mt-1 text-sm text-white/60 capitalize">{ticket.category}</p>
            </div>
            
            {/* QR Code Placeholder */}
            <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl border border-dashed border-white/25 bg-black/40">
              <div className="text-center px-1">
                <div className="text-[9px] font-mono text-white/40 leading-tight">BOOKING ID</div>
                <div className="text-[10px] font-mono font-bold text-[#f84464] leading-tight break-all">{ticket.bookingId}</div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-white/20" />

          {/* Details */}
          <div className="grid gap-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-white/65">
                <Calendar className="h-4 w-4" />
                Date
              </span>
              <span className="font-semibold text-white">{ticket.eventDate}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-white/65">
                <Clock className="h-4 w-4" />
                Time
              </span>
              <span className="font-semibold text-white">{ticket.showtime}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-white/65">
                <MapPin className="h-4 w-4" />
                Venue
              </span>
              <span className="font-semibold text-white text-right">{ticket.venue}, {ticket.city}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/65">Seats</span>
              <span className="font-semibold text-white">
                {Array.isArray(ticket.seatNumbers) 
                  ? ticket.seatNumbers.map(s => s.id || s).join(', ')
                  : ticket.seats}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-dashed border-white/20 pt-4">
              <span className="text-white/65">Total Paid</span>
              <span className="text-2xl font-bold text-[#f84464]">₹{ticket.finalAmount}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-white/45">Payment ID</span>
              <span className="font-mono text-white/60">{ticket.paymentId}</span>
            </div>
          </div>

          {/* Payment Verified Badge */}
          <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">Payment Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link
          to="/"
          className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.99]"
        >
          Go Home
        </Link>
        <Link
          to="/my-bookings"
          className="flex-1 rounded-2xl bg-[#f84464] px-6 py-3 text-center text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.99]"
        >
          My Bookings
        </Link>
      </div>
    </div>
  )
}
