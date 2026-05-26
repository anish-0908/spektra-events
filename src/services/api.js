import { events as mockEvents } from '../data/mockData.js'

// Helper to interact with LocalStorage
const getStorageItem = (key, defaultVal) => {
  const item = localStorage.getItem(key)
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultVal))
    return defaultVal
  }
  try {
    return JSON.parse(item)
  } catch (e) {
    return defaultVal
  }
}

const setStorageItem = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val))
}

// ── Initialize Local Databases ──
const initDB = () => {
  getStorageItem('ev_events', mockEvents)
  getStorageItem('ev_bookings', [])
  getStorageItem('ev_users', {
    'admin@spektra.com': { name: 'Admin Spektra', email: 'admin@spektra.com', role: 'admin' },
    'admin@eventverse.in': { name: 'Admin EventVerse', email: 'admin@eventverse.in', role: 'admin' },
    'user@example.com': { name: 'John Doe', email: 'user@example.com', role: 'user' }
  })
}
initDB()

// ── Auth ─────────────────────────────────────────────────
export const apiLogin = async (email, password) => {
  const users = getStorageItem('ev_users', {})
  const emailLower = email.toLowerCase()
  
  // Create user dynamically if they don't exist for effortless testing
  if (!users[emailLower]) {
    users[emailLower] = {
      name: emailLower.split('@')[0],
      email: emailLower,
      role: emailLower === 'admin@spektra.com' || emailLower === 'admin@eventverse.in' ? 'admin' : 'user'
    }
    setStorageItem('ev_users', users)
  }
  
  const user = users[emailLower]
  // Override role to admin if it's the admin emails
  if (emailLower === 'admin@spektra.com' || emailLower === 'admin@eventverse.in') {
    user.role = 'admin'
  }
  
  localStorage.setItem('ev_token', `ev_token_${emailLower}`)
  
  return {
    data: {
      token: `ev_token_${emailLower}`,
      user
    }
  }
}

export const apiRegister = async (name, email, password) => {
  const users = getStorageItem('ev_users', {})
  const emailLower = email.toLowerCase()
  
  users[emailLower] = {
    name,
    email: emailLower,
    role: emailLower === 'admin@spektra.com' || emailLower === 'admin@eventverse.in' ? 'admin' : 'user'
  }
  setStorageItem('ev_users', users)
  
  localStorage.setItem('ev_token', `ev_token_${emailLower}`)
  
  return {
    data: {
      token: `ev_token_${emailLower}`,
      user: users[emailLower]
    }
  }
}

export const apiGetMe = async () => {
  const token = localStorage.getItem('ev_token')
  if (!token || !token.startsWith('ev_token_')) {
    throw new Error('Not authenticated')
  }
  const email = token.replace('ev_token_', '')
  const users = getStorageItem('ev_users', {})
  const user = users[email]
  if (!user) {
    throw new Error('User not found')
  }
  return {
    data: {
      user
    }
  }
}

// ── Events ───────────────────────────────────────────────
export const apiGetAllEvents = async (params = {}) => {
  const events = getStorageItem('ev_events', mockEvents)
  return { data: events }
}

export const apiGetFeaturedEvents = async () => {
  const events = getStorageItem('ev_events', mockEvents)
  const featured = events.filter(e => e.featured || e.rating >= 8.5)
  return { data: featured }
}

export const apiGetEventById = async (id) => {
  const events = getStorageItem('ev_events', mockEvents)
  const event = events.find(e => String(e.id) === String(id) || String(e._id) === String(id))
  if (!event) throw new Error('Event not found')
  return { data: event }
}

export const apiSearchEvents = async (q) => {
  const events = getStorageItem('ev_events', mockEvents)
  const query = String(q || '').toLowerCase()
  const filtered = events.filter(e => 
    String(e.title).toLowerCase().includes(query) ||
    String(e.genre).toLowerCase().includes(query) ||
    String(e.city).toLowerCase().includes(query) ||
    String(e.category).toLowerCase().includes(query)
  )
  return { data: filtered }
}

export const apiCreateEvent = async (data) => {
  const events = getStorageItem('ev_events', mockEvents)
  const newEvent = {
    ...data,
    id: 'evt_' + Date.now(),
    _id: 'evt_' + Date.now()
  }
  events.unshift(newEvent)
  setStorageItem('ev_events', events)
  window.dispatchEvent(new Event('ev_events_updated'))
  return { data: newEvent }
}

export const apiUpdateEvent = async (id, data) => {
  const events = getStorageItem('ev_events', mockEvents)
  const idx = events.findIndex(e => String(e.id) === String(id) || String(e._id) === String(id))
  if (idx === -1) throw new Error('Event not found')
  events[idx] = { ...events[idx], ...data }
  setStorageItem('ev_events', events)
  window.dispatchEvent(new Event('ev_events_updated'))
  return { data: events[idx] }
}

export const apiDeleteEvent = async (id) => {
  const events = getStorageItem('ev_events', mockEvents)
  const filtered = events.filter(e => String(e.id) !== String(id) && String(e._id) !== String(id))
  setStorageItem('ev_events', filtered)
  window.dispatchEvent(new Event('ev_events_updated'))
  return { data: { success: true } }
}

// ── Bookings ─────────────────────────────────────────────
export const apiCreateBooking = async (data) => {
  const bookings = getStorageItem('ev_bookings', [])
  const token = localStorage.getItem('ev_token') || 'ev_token_user@example.com'
  const userEmail = token.replace('ev_token_', '')
  
  const newBooking = {
    ...data,
    _id: 'bkg_' + Date.now(),
    bookingId: 'EV-BK-' + Math.floor(100000 + Math.random() * 900000),
    userEmail,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  }
  bookings.unshift(newBooking)
  setStorageItem('ev_bookings', bookings)
  return { data: { success: true, booking: newBooking } }
}

export const apiGetMyBookings = async () => {
  const bookings = getStorageItem('ev_bookings', [])
  const token = localStorage.getItem('ev_token') || 'ev_token_user@example.com'
  const userEmail = token.replace('ev_token_', '')
  
  // Filter bookings for current logged-in user
  const myBookings = bookings.filter(b => b.userEmail === userEmail)
  return { data: { data: myBookings } }
}

export const apiCancelBooking = async (id) => {
  const bookings = getStorageItem('ev_bookings', [])
  const idx = bookings.findIndex(b => String(b._id) === String(id) || String(b.bookingId) === String(id))
  if (idx === -1) throw new Error('Booking not found')
  
  bookings[idx].status = 'cancelled'
  setStorageItem('ev_bookings', bookings)
  return { data: { success: true } }
}

// ── Payments (Razorpay Simulator) ──────────────────────────
export const apiCreateOrder = async (amount) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    data: {
      success: true,
      data: {
        id: 'order_' + Math.random().toString(36).substring(2, 15).toUpperCase(),
        amount: amount * 100,
        currency: 'INR'
      }
    }
  }
}

export const apiVerifyAndBook = async (data) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const bookings = getStorageItem('ev_bookings', [])
  const token = localStorage.getItem('ev_token') || 'ev_token_user@example.com'
  const userEmail = token.replace('ev_token_', '')
  
  const year = new Date().getFullYear()
  const random = Math.floor(10000 + Math.random() * 90000)
  const bookingId = `EVT-${year}-${random}`
  const paymentId = data.razorpay_payment_id || 'pay_' + Math.random().toString(36).substring(2, 15).toUpperCase()
  
  const ticket = {
    bookingId,
    eventTitle: data.eventTitle,
    eventDate: data.eventDate,
    showtime: data.showtime,
    venue: data.venue,
    city: data.city,
    seats: data.seats,
    seatNumbers: data.seatNumbers,
    category: data.category,
    finalAmount: data.finalAmount,
    paymentId: paymentId,
    bookedAt: new Date().toISOString(),
    userEmail,
    status: 'confirmed',
    paymentStatus: 'paid',
    _id: 'bkg_' + Date.now()
  }
  
  bookings.unshift(ticket)
  setStorageItem('ev_bookings', bookings)
  
  return {
    data: {
      success: true,
      ticket
    }
  }
}

// Default mock Axios instance
const mockAxios = {
  create: () => mockAxios,
  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} }
  },
  defaults: { headers: { common: {} } }
}
export default mockAxios
