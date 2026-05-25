import { Link } from 'react-router-dom'

function SvgInstagram({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function SvgYoutube({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M23.5 6.2c-.3-1.1-1.2-2-2.3-2.3C19.4 3 12 3 12 3s-7.4 0-9.2.4C1.7 4.2.8 5.1.5 6.2 0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1.1 1.2 2 2.3 2.3 1.8.4 9.2.4 9.2.4s7.4 0 9.2-.4c1.1-.3 2-1.2 2.3-2.3.5-2 .5-5.8.5-5.8s0-3.8-.5-5.8zM9.5 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  )
}

function SvgX({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function SvgLinkedin({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const footerLinks = [
  { label: 'Browse Movies', to: '/browse/movies' },
  { label: 'Browse Concerts', to: '/browse/concerts' },
  { label: 'Browse Sports', to: '/browse/sports' },
  { label: 'Search', to: '/search' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="w-full px-4 py-10 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-lg font-semibold tracking-tight">Spektra</div>
            <div className="mt-1 text-sm text-white/55">
              EventVerse — premium event discovery & booking (mock).
            </div>
            <div className="mt-4 flex items-center gap-2 text-white/65">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
                aria-label="Instagram"
              >
                <SvgInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
                aria-label="YouTube"
              >
                <SvgYoutube className="h-4 w-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
                aria-label="X"
              >
                <SvgX className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
                aria-label="LinkedIn"
              >
                <SvgLinkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {footerLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

