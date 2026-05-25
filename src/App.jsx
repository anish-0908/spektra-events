import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Browse from './pages/Browse.jsx'
import EventDetail from './pages/EventDetail.jsx'
import SeatSelection from './pages/SeatSelection.jsx'
import Checkout from './pages/Checkout.jsx'
import Search from './pages/Search.jsx'
import Login from './pages/Login.jsx'
import MyBookings from './pages/MyBookings.jsx'
import Admin from './pages/Admin.jsx'
import { BookingProvider } from './context/BookingContext.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

function AnimatedRoutes() {
  const location = useLocation()
  const { user } = useAuth()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname + location.search}
        initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="min-h-[calc(100svh-80px)]"
      >
        <Routes location={location}>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/browse/:category" element={<Browse />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/book/:eventId" element={<SeatSelection />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/search" element={<Search />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <BrowserRouter>
          <div className="min-h-svh bg-[#0a0a0a] text-white selection:bg-[#f84464]/35 overflow-x-hidden">
            <Navbar />
            <main className="w-full px-4 pb-16 pt-6 sm:px-8 lg:px-12">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </BookingProvider>
    </AuthProvider>
  )
}
