import { useMemo, useState } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ChevronDown,
  Menu,
  Search as SearchIcon,
  User,
  X,
} from 'lucide-react'
import { useBooking } from '../context/BookingContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const navItems = [
  { label: 'Movies', to: '/browse/movies' },
  { label: 'Concerts', to: '/browse/concerts' },
  { label: 'Sports', to: '/browse/sports' },
  { label: 'Theatre', to: '/browse/theatre' },
  { label: 'Comedy', to: '/browse/comedy' },
]

const authNavItems = [
  { label: 'My Bookings', to: '/my-bookings' },
]

function NavPill({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'rounded-full px-3 py-2 text-sm font-medium transition',
          isActive
            ? 'bg-white/10 text-white'
            : 'text-white/70 hover:bg-white/5 hover:text-white',
        ].join(' ')
      }
    >
      {children}
    </NavLink>
  )
}

const CITIES = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Pune', 'Ahmedabad']

export default function Navbar() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { city, setCity } = useBooking()
  const { user, logout } = useAuth()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  const prettyCity = useMemo(() => city ?? 'Select city', [city])

  function onSubmit(e) {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-2xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8 lg:px-12">

        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3"
        >
          {/* Icon */}
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-[#f84464]/30 bg-white/[0.03] shadow-[0_0_25px_rgba(248,68,100,0.15)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_35px_rgba(248,68,100,0.35)]">

            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f84464]/20 via-transparent to-transparent" />

            {/* SVG Icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10"
            >
              <path
                d="M7 6.5C7 5.12 8.12 4 9.5 4H14.5C15.88 4 17 5.12 17 6.5V8C17 8.55 17.45 9 18 9H20V15H18C17.45 15 17 15.45 17 16V17.5C17 18.88 15.88 20 14.5 20H9.5C8.12 20 7 18.88 7 17.5V16C7 15.45 6.55 15 6 15H4V9H6C6.55 9 7 8.55 7 8V6.5Z"
                stroke="#f84464"
                strokeWidth="1.8"
              />

              <path
                d="M10 9.5L15 12L10 14.5V9.5Z"
                fill="#f84464"
              />
            </svg>

            {/* Animated Pulse */}
            <div className="absolute h-16 w-16 rounded-full bg-[#f84464]/10 blur-2xl transition-all duration-500 group-hover:scale-125" />
          </div>

          {/* Text */}
          <div className="leading-none">
            <h1 className="text-[1.15rem] font-black uppercase tracking-[0.28em] text-white transition-all duration-300 group-hover:text-[#f84464]">
              SPEKTRA
            </h1>


          </div>
        </Link>


        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((i) => (
            <NavPill key={i.to} to={i.to}>
              {i.label}
            </NavPill>
          ))}
        </div>

        <form onSubmit={onSubmit} className="hidden flex-1 items-center md:flex">
          <div className="relative left-2 w-full max-w-10">
            <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, concerts, sports…"
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
            />
          </div>
        </form>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => setCityOpen((s) => !s)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 active:scale-[0.99]"
            >
              <span className="max-w-[9rem] truncate">{prettyCity}</span>
              <ChevronDown className="h-4 w-4 text-white/60" />
            </button>

            {cityOpen ? (
              <div
                className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b12]/95 p-1 shadow-2xl"
                onMouseLeave={() => setCityOpen(false)}
              >
                {CITIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCity(c)
                      setCityOpen(false)
                    }}
                    className={[
                      'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition',
                      c === city
                        ? 'bg-[#f84464]/15 text-white'
                        : 'text-white/75 hover:bg-white/5 hover:text-white',
                    ].join(' ')}
                  >
                    <span>{c}</span>
                    {c === city ? (
                      <span className="text-[11px] text-[#f84464]">Selected</span>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              {user.email === 'admin@spektra.com' && (
                <Link
                  to="/admin"
                  className="rounded-full border border-[#f84464]/30 bg-[#f84464]/10 px-3 py-2 text-sm font-medium text-[#f84464] transition hover:bg-[#f84464]/20"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/my-bookings"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                My Bookings
              </Link>
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[#f84464]/20 text-xs font-semibold text-[#f84464] ring-1 ring-[#f84464]/30" title={user.name || user.email}>
                {(user.name || user.email)?.[0]?.toUpperCase()}
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full bg-[#f84464] px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.99]"
            >
              <User className="h-4 w-4" />
              Sign In
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="ml-auto inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 transition hover:bg-white/10 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen ? (
        <div className="md:hidden">
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
          <div className="fixed right-0 top-0 z-50 h-full w-[86%] max-w-sm border-l border-white/10 bg-[#0a0a0a] p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Menu</div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/80"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-4">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/35 outline-none focus:border-[#f84464]/45"
                />
              </div>
            </form>

            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-white/45">
                City
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {CITIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className={[
                      'rounded-2xl border px-3 py-2 text-sm transition',
                      c === city
                        ? 'border-[#f84464]/40 bg-[#f84464]/15 text-white'
                        : 'border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white',
                    ].join(' ')}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-2">
              {navItems.map((i) => (
                <Link
                  key={i.to}
                  to={i.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10"
                >
                  {i.label}
                </Link>
              ))}
              {user && user.email === 'admin@spektra.com' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl border border-[#f84464]/30 bg-[#f84464]/10 px-4 py-3 text-sm font-semibold text-[#f84464] transition hover:bg-[#f84464]/15"
                >
                  ⚙️ Admin Panel
                </Link>
              )}
              {user && (
                <Link
                  to="/my-bookings"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl border border-[#f84464]/30 bg-[#f84464]/10 px-4 py-3 text-sm font-semibold text-[#f84464] transition hover:bg-[#f84464]/15"
                >
                  🎟 My Bookings
                </Link>
              )}
            </div>

            {user ? (
              <button
                type="button"
                onClick={logout}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f84464] px-4 py-3 text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.99]"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f84464] px-4 py-3 text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.99]"
              >
                <User className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}

