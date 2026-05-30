<div align="center">

# 🎭 Spektra — EventVerse

### A modern, full-featured event booking platform built with React + Vite

[![React](https://img.shields.io/badge/React-19.2.6-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0.12-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3.0-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.38.0-FF0055?style=flat-square&logo=framer)](https://www.framer.com/motion)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**[Live Demo](https://spektra-events.vercel.app)** · **[GitHub](https://github.com/anish-0908/spektra-events)**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Pages & Routes](#-pages--routes)
- [Components](#-components)
- [State Management](#-state-management)
- [Data Layer](#-data-layer)
- [Admin Panel](#-admin-panel)
- [Review System](#-review-system)
- [Booking Flow](#-booking-flow)
- [Deployment](#-deployment-to-vercel)
- [Contributing](#-contributing)

---

## 🌟 Overview

**Spektra EventVerse** is a production-ready event booking web application that lets users discover, browse, and book tickets for movies, concerts, sports, theatre, and comedy events across major Indian cities. It features a real-time admin panel, an interactive seat selection map, a user review system, promo codes, and a beautiful animated UI — all running entirely in the browser with no backend required.

---

## ✨ Features

### 🎫 User Features

| Feature | Description |
|---|---|
| **City-Based Discovery** | Select your city (Mumbai, Delhi, Bengaluru, Hyderabad) and see only relevant events |
| **Category Browsing** | Browse Movies, Concerts, Sports, Theatre, Comedy with filters |
| **Advanced Filtering** | Filter by genre, language, rating, price range, and date |
| **Interactive Seat Map** | Visual seat picker with Premium, Gold, and Silver tiers |
| **Showtime Selector** | Pick date and time slots for any event |
| **Promo Codes** | Apply discount codes at checkout (`SPEKTRA10`, `EV50`) |
| **One-Click Booking** | Instant booking confirmation with animated ticket |
| **Booking History** | View all past bookings with full ticket details |
| **User Reviews** | Rate and review events with 5-star system |
| **Search** | Full-text search across titles, genres, venues, and cities |
| **Responsive Design** | Works perfectly on mobile, tablet, and desktop |

### 👨‍💼 Admin Features

| Feature | Description |
|---|---|
| **Analytics Dashboard** | Live stats — total revenue, bookings, tickets sold, average booking value |
| **Category Charts** | Visual bar chart of events by category |
| **City Distribution** | Visual bar chart of events by city |
| **Add Events** | Create events with full details — images, cast, showtimes, seat capacity |
| **Edit Events** | Update any event field inline |
| **Delete Events** | Remove events with confirmation |
| **Live Sync** | Admin-added events appear instantly on the user side without page refresh |

### 🎨 UI/UX Features

| Feature | Description |
|---|---|
| **Dark Theme** | Deep `#0a0a0a` background with `#f84464` accent throughout |
| **Page Transitions** | Smooth fade + blur animations between routes via Framer Motion |
| **3D Hero Carousel** | Perspective-based 3D card carousel on the homepage |
| **Confetti Animation** | 52-piece confetti burst on successful booking |
| **Skeleton Loaders** | Placeholder cards while content loads |
| **Glassmorphism Cards** | Frosted glass effect on panels and cards |

---

## 🛠 Tech Stack

### Core
| Package | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 19.2.6 | UI library |
| [Vite](https://vitejs.dev) | 8.0.12 | Build tool & dev server |
| [React Router DOM](https://reactrouter.com) | 7.15.0 | Client-side routing |
| [Tailwind CSS](https://tailwindcss.com) | 4.3.0 | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion) | 12.38.0 | Animations & transitions |
| [Lucide React](https://lucide.dev) | 1.14.0 | Icon library |
| [Axios](https://axios-http.com) | 1.16.1 | HTTP client (used in service layer) |

### Storage
- **localStorage** — All data (events, bookings, users, reviews) persisted in the browser. No backend or database required.

### Deployment
- **Vercel** — Zero-config deployment via `vercel.json`

---

## 📁 Project Structure

```
spektra-events/
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/                  # Local images (posters, banners)
│   │   └── A1.png, A2.jpg ...
│   │
│   ├── components/              # Reusable UI components
│   │   ├── Carousel3D.jsx       # 3D perspective carousel
│   │   ├── EventCard.jsx        # Event thumbnail card
│   │   ├── FilterSidebar.jsx    # Browse page filter panel
│   │   ├── Footer.jsx           # Site footer
│   │   ├── HeroCarousel.jsx     # Homepage hero banner carousel
│   │   ├── Navbar.jsx           # Top navigation bar
│   │   ├── ReviewSection.jsx    # User reviews + rating form
│   │   ├── SeatMap.jsx          # Interactive seat picker (movies/theatre)
│   │   ├── ShowtimeSelector.jsx # Date & time slot picker
│   │   ├── SkeletonCard.jsx     # Loading placeholder card
│   │   ├── SportsSeatMap.jsx    # Seat picker for sports events
│   │   ├── TicketCard.jsx       # Booking confirmation ticket
│   │   └── TicketSummary.jsx    # Compact ticket summary
│   │
│   ├── constants/
│   │   └── browseFilters.js     # Default filter state factory
│   │
│   ├── context/
│   │   ├── AuthContext.jsx      # User auth state (login/logout/register)
│   │   └── BookingContext.jsx   # Booking flow state (event, seats, city, promo)
│   │
│   ├── data/
│   │   └── mockData.js          # 21 pre-seeded events across all categories
│   │
│   ├── hooks/
│   │   └── useEvents.js         # Live hook — merges mock + admin events reactively
│   │
│   ├── pages/
│   │   ├── Admin.jsx            # Admin dashboard (analytics + event CRUD)
│   │   ├── Browse.jsx           # Category browse page with filters
│   │   ├── Checkout.jsx         # Booking confirmation + promo codes
│   │   ├── EventDetail.jsx      # Event detail, showtimes, cast, reviews
│   │   ├── Home.jsx             # Homepage with sections and carousel
│   │   ├── Login.jsx            # Login / Register page
│   │   ├── MyBookings.jsx       # User's booking history
│   │   ├── Search.jsx           # Full-text search results
│   │   └── SeatSelection.jsx    # Interactive seat map page
│   │
│   ├── services/
│   │   ├── api.js               # All data operations (localStorage CRUD + event emitter)
│   │   └── payment.js           # Payment service stubs
│   │
│   ├── utils/
│   │   └── seatPricing.js       # Seat category price calculator
│   │
│   ├── App.jsx                  # Root component — router + providers + layout
│   ├── App.css                  # Global overrides
│   ├── index.css                # Tailwind base + custom scrollbar styles
│   └── main.jsx                 # React DOM entry point
│
├── .env.example                 # Environment variable template
├── .gitignore
├── eslint.config.js
├── index.html                   # HTML entry point
├── package.json
├── vercel.json                  # Vercel deployment config (SPA rewrites)
└── vite.config.js               # Vite + Tailwind plugin config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org)
- **npm** v9 or higher (comes with Node.js)
- **Git** — [Download](https://git-scm.com)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/anish-0908/spektra-events.git

# 2. Navigate into the project
cd spektra-events

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build optimised production bundle to `/dist` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all source files |

> ⚠️ **Note:** There is no `npm start` script. Always use `npm run dev`.

---

## 🗺 Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | `Home.jsx` | Homepage with hero carousel, category tabs, and event sections |
| `/browse/:category` | `Browse.jsx` | Filtered event listing for a specific category |
| `/event/:id` | `EventDetail.jsx` | Full event detail — banner, cast, showtimes, reviews |
| `/book/:eventId` | `SeatSelection.jsx` | Interactive seat map for the selected event |
| `/checkout` | `Checkout.jsx` | Order summary, promo code, and booking confirmation |
| `/search` | `Search.jsx` | Full-text search with category tabs |
| `/login` | `Login.jsx` | Login and registration form |
| `/my-bookings` | `MyBookings.jsx` | Logged-in user's booking history |
| `/admin` | `Admin.jsx` | Admin-only dashboard (requires `admin@spektra.com`) |

---

## 🧩 Components

### `HeroCarousel`
3D perspective carousel on the homepage. Cycles through the top 5 highest-rated events every 4 seconds. Supports click-to-navigate between slides. Reactively updates when admin adds new events.

### `EventCard`
Compact card showing poster image, title, rating, city, and price. Links to the event detail page. Used in all listing views.

### `SeatMap`
Interactive SVG-style seat grid for movies and theatre. Seats are colour-coded by tier (Premium / Gold / Silver). Selected seats are highlighted in `#f84464`. Calculates total price in real time.

### `SportsSeatMap`
Stadium-style seat layout for sports events with zone-based pricing.

### `ShowtimeSelector`
Date + time picker that reads from the event's `showtimes` array. Stores selection in `BookingContext`.

### `ReviewSection`
Full review system component. Displays average star rating, all user reviews with helpful votes, and a form to submit a new review. Requires login to submit.

### `FilterSidebar`
Browse page sidebar with genre checkboxes, language checkboxes, rating slider, price range, and date filter. Has both desktop and mobile (drawer) variants.

### `TicketCard`
Animated booking confirmation card shown after a successful booking. Displays booking ID, event details, seat numbers, and amount paid with a confetti burst.

### `Navbar`
Responsive top navigation. Shows city selector, category links, search, login/logout, My Bookings, and Admin button (admin users only).

---

## 🔄 State Management

The app uses **React Context API** for global state — no Redux or Zustand needed.

### `AuthContext`
```
user          — current logged-in user object (name, email, role)
login()       — authenticates user, stores token in localStorage
logout()      — clears user and token
register()    — creates new user account
```

### `BookingContext`
```
city              — user's selected city (Mumbai / Delhi / Bengaluru / Hyderabad)
selectedEventId   — ID of the event being booked
selectedDate      — chosen showtime date
selectedTime      — chosen showtime slot
selectedSeats     — array of selected seat objects { id, price, category }
promoApplied      — active promo code object { code, discountAmount }
setCity()         — update city
setSelectedSeats()— update seat selection
resetBooking()    — clear all booking state after confirmation
```

### `useEvents` Hook
```js
// src/hooks/useEvents.js
const allEvents = useEvents()
```
Returns a live-updating merged array of mock events + admin-added events. Listens to the `ev_events_updated` custom DOM event so any component using this hook re-renders instantly when the admin adds, edits, or deletes an event — **no page refresh required**.

---

## 💾 Data Layer

All data is stored in **localStorage**. No backend or database is required.

### localStorage Keys

| Key | Type | Description |
|---|---|---|
| `ev_events` | `Event[]` | Admin-added events (mock events are merged at runtime) |
| `ev_bookings` | `Booking[]` | All confirmed bookings |
| `ev_users` | `{ [email]: User }` | Registered user accounts |
| `ev_token` | `string` | Current session token |
| `ev_reviews` | `Review[]` | All user-submitted reviews |

### Event Object Shape
```js
{
  id: "1",                        // string — unique ID
  title: "Avengers: End Game",
  category: "movies",             // movies | concerts | sports | theatre | comedy
  genre: ["Action", "Sci-Fi"],
  language: "English",
  duration: "3h 2m",
  rating: 9.2,                    // 0–10
  date: "2026-06-15",
  venue: "PVR Phoenix Palladium",
  city: "Mumbai",                 // Mumbai | Delhi | Bengaluru | Hyderabad
  price: 350,                     // base price in ₹
  posterImage: "https://...",
  bannerImage: "https://...",
  description: "...",
  featured: true,
  cast: [{ name, role, image }],
  showtimes: [{ date, times: ["10:00 AM", "1:30 PM"] }],
  seats: { premium: 80, gold: 120, silver: 200 }
}
```

### Booking Object Shape
```js
{
  bookingId: "EVT-2026-12345",
  eventTitle: "Avengers: End Game",
  eventDate: "2026-06-15",
  showtime: "7:00 PM",
  venue: "PVR Phoenix Palladium",
  city: "Mumbai",
  seats: 2,
  seatNumbers: ["A1", "A2"],
  category: "Premium",
  finalAmount: 840,
  paymentId: "pay_XXXXXXXX",
  paymentStatus: "paid",
  status: "confirmed",
  userEmail: "user@example.com",
  bookedAt: "2026-05-30T12:00:00.000Z"
}
```

### Review Object Shape
```js
{
  id: "rev_1748600000000",
  eventId: "1",
  eventTitle: "Avengers: End Game",
  userId: "user@example.com",
  userName: "John Doe",
  rating: 5,                      // 1–5 stars
  comment: "Amazing experience!",
  helpful: 3,
  createdAt: "2026-05-30T12:00:00.000Z"
}
```

---

## 👨‍💼 Admin Panel

### Access
```
URL:      /admin
Email:    admin@spektra.com
Password: admin123
```

> The admin button only appears in the navbar when logged in as `admin@spektra.com`.

### Analytics Dashboard

The top of the admin page shows four live metric cards:

| Card | What it shows |
|---|---|
| 💰 Total Revenue | Sum of `finalAmount` across all bookings |
| 🎟 Total Bookings | Count of all bookings in localStorage |
| 👥 Tickets Sold | Sum of `seats` across all bookings |
| 📈 Avg Booking Value | Revenue ÷ Bookings |

Below the cards are two bar charts:
- **Events by Category** — how many events exist per category
- **Events by City** — how many events exist per city

### Adding an Event

Click **Add Event** and fill in:

| Field | Required | Notes |
|---|---|---|
| Title | ✅ | Event name |
| Category | ✅ | movies / concerts / sports / theatre / comedy |
| Genre | ✅ | Comma-separated, e.g. `Action, Thriller` |
| Language | ✅ | e.g. `Hindi`, `English` |
| Banner Image URL | ✅ | Wide image (16:9 ratio recommended) |
| Poster Image URL | ✅ | Portrait image (2:3 ratio recommended) |
| Rating | ✅ | 0.0 – 10.0 |
| Price | ✅ | Base price in ₹ |
| Duration | ✅ | e.g. `2h 30m` |
| Date | ✅ | Event date |
| Venue | ✅ | Venue name |
| City | ✅ | Must match exactly: `Mumbai`, `Delhi`, `Bengaluru`, `Hyderabad` |
| Description | ✅ | Event description |
| Seat Capacity | — | Premium / Gold / Silver counts |
| Cast Members | — | Name, role, image URL |
| Showtimes | — | Date + comma-separated times |
| Featured | — | Checkbox to mark as featured |

> ✅ Once saved, the event **instantly appears** on the user-facing homepage, browse pages, search, and hero carousel — no page refresh needed.

---

## ⭐ Review System

Users can rate and review any event from the **Reviews** tab on the event detail page.

### How to Submit a Review
1. Navigate to any event → click **Reviews** tab
2. Click **Write Review** (must be logged in)
3. Select 1–5 stars using the interactive star picker
4. Write your comment
5. Click **Submit Review**

### Review Features
- ⭐ Average rating calculated from all reviews and displayed at the top
- 👍 **Helpful** button on each review (increments a counter)
- 📅 Review date shown on each card
- 👤 Reviewer's name shown
- 🔄 Event's rating in the card/detail view updates automatically after a review is submitted
- 🔒 Login required to submit — guests can read reviews freely

---

## 🎯 Booking Flow

```
1. Home / Browse / Search
        ↓
2. Event Detail Page
   → Select showtime date
   → Select time slot
   → Click "Book Now"
        ↓
3. Seat Selection Page
   → Click seats on the interactive map
   → See real-time price total
   → Click "Proceed to Checkout"
        ↓
4. Checkout Page
   → Review order summary
   → Apply promo code (optional)
   → Choose payment method (UPI / Card / Wallet)
   → Click "Confirm Booking"
        ↓
5. Success Screen
   → Confetti animation 🎉
   → Booking ticket displayed
   → Booking saved to localStorage
   → "Go Home" or "My Bookings"
```

### Promo Codes

| Code | Discount |
|---|---|
| `SPEKTRA10` | 10% off (max ₹300) |
| `EV50` | Flat ₹50 off |

---

## 🔐 Authentication

The app uses a **localStorage-based auth system** — no JWT or OAuth required.

### Login
- Any email + any password creates/logs in a user automatically
- Admin access is granted only to `admin@spektra.com`

### Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@spektra.com` | `admin123` |
| User | `test@user.com` | `anything` |
| User | `user@example.com` | `anything` |

---

## 🌆 Supported Cities

Events are filtered by the city selected in the navbar dropdown.

| City | Display Name |
|---|---|
| Mumbai | Mumbai |
| Delhi | Delhi |
| Bengaluru | Bengaluru |
| Hyderabad | Hyderabad |

> ⚠️ City matching is **case-sensitive**. When adding events via admin, use the exact spelling above.

---

## 🚀 Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/anish-0908/spektra-events)

### Manual Deploy

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Import `anish-0908/spektra-events`
4. Vercel auto-detects Vite — no settings to change
5. Click **Deploy**

The `vercel.json` file handles SPA routing automatically:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Update After Deployment

```bash
git add .
git commit -m "Your update message"
git push
# Vercel auto-deploys on every push to main ✅
```

---

## 🤝 Contributing

Contributions are welcome!

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes
# 4. Commit
git commit -m "feat: add your feature"

# 5. Push
git push origin feature/your-feature-name

# 6. Open a Pull Request on GitHub
```

### Commit Convention

| Prefix | Use for |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `style:` | UI/styling changes |
| `refactor:` | Code restructure |
| `docs:` | Documentation updates |

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

## 👨‍💻 Author

**Anish**
- GitHub: [@anish-0908](https://github.com/anish-0908)
- Repository: [spektra-events](https://github.com/anish-0908/spektra-events)

---

<div align="center">

Made with ❤️ using React + Vite + Tailwind CSS

⭐ Star this repo if you found it useful!

</div>
