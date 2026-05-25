import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiGetAllEvents, apiCreateEvent, apiUpdateEvent, apiDeleteEvent, apiGetMyBookings } from '../services/api'
import { Plus, Trash2, Calendar, MapPin, Star, Tag, Edit2, TrendingUp, Users, Ticket, DollarSign } from 'lucide-react'

export default function Admin() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    category: 'movies',
    genre: '',
    bannerImage: '',
    posterImage: '',
    rating: 0,
    date: '',
    venue: '',
    city: '',
    price: 0,
    language: '',
    duration: '',
    description: '',
    featured: false,
    cast: [{ name: '', role: '', image: '' }],
    showtimes: [{ date: '', times: '' }],
    seats: { premium: 80, gold: 120, silver: 200 }
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (user.email !== 'admin@spektra.com') {
      navigate('/')
      return
    }
    loadEvents()
  }, [user, navigate])

  async function loadEvents() {
    try {
      const response = await apiGetAllEvents()
      setEvents(response.data)
      
      // Load all bookings from localStorage
      const allBookings = JSON.parse(localStorage.getItem('ev_bookings') || '[]')
      setBookings(allBookings)
    } catch (err) {
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  function handleInputChange(e) {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  function handleNestedChange(field, index, key, value) {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [key]: value } : item
      )
    }))
  }

  function addCastMember() {
    setFormData(prev => ({
      ...prev,
      cast: [...prev.cast, { name: '', role: '', image: '' }]
    }))
  }

  function removeCastMember(index) {
    setFormData(prev => ({
      ...prev,
      cast: prev.cast.filter((_, i) => i !== index)
    }))
  }

  function addShowtime() {
    setFormData(prev => ({
      ...prev,
      showtimes: [...prev.showtimes, { date: '', times: '' }]
    }))
  }

  function removeShowtime(index) {
    setFormData(prev => ({
      ...prev,
      showtimes: prev.showtimes.filter((_, i) => i !== index)
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      // Process genre and showtimes
      const eventData = {
        ...formData,
        genre: formData.genre.split(',').map(g => g.trim()),
        showtimes: formData.showtimes.map(st => ({
          date: st.date,
          times: st.times.split(',').map(t => t.trim())
        })),
        cast: formData.cast.filter(c => c.name.trim() !== '')
      }

      if (editingEvent) {
        // Update existing event
        await apiUpdateEvent(editingEvent._id, eventData)
        setSuccess('Event updated successfully!')
      } else {
        // Create new event
        await apiCreateEvent(eventData)
        setSuccess('Event created successfully!')
      }
      
      setShowForm(false)
      setEditingEvent(null)
      loadEvents()
      
      // Reset form
      setFormData({
        title: '',
        category: 'movies',
        genre: '',
        bannerImage: '',
        posterImage: '',
        rating: 0,
        date: '',
        venue: '',
        city: '',
        price: 0,
        language: '',
        duration: '',
        description: '',
        featured: false,
        cast: [{ name: '', role: '', image: '' }],
        showtimes: [{ date: '', times: '' }],
        seats: { premium: 80, gold: 120, silver: 200 }
      })
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${editingEvent ? 'update' : 'create'} event`)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      await apiDeleteEvent(id)
      setSuccess('Event deleted successfully!')
      loadEvents()
    } catch (err) {
      setError('Failed to delete event')
    }
  }

  function handleEdit(event) {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      category: event.category,
      genre: event.genre.join(', '),
      bannerImage: event.bannerImage,
      posterImage: event.posterImage,
      rating: event.rating,
      date: event.date,
      venue: event.venue,
      city: event.city,
      price: event.price,
      language: event.language,
      duration: event.duration,
      description: event.description,
      featured: event.featured || false,
      cast: event.cast.length > 0 ? event.cast : [{ name: '', role: '', image: '' }],
      showtimes: event.showtimes.map(st => ({
        date: st.date,
        times: st.times.join(', ')
      })),
      seats: event.seats
    })
    setShowForm(true)
    setError('')
    setSuccess('')
  }

  function handleCancelEdit() {
    setShowForm(false)
    setEditingEvent(null)
    setFormData({
      title: '',
      category: 'movies',
      genre: '',
      bannerImage: '',
      posterImage: '',
      rating: 0,
      date: '',
      venue: '',
      city: '',
      price: 0,
      language: '',
      duration: '',
      description: '',
      featured: false,
      cast: [{ name: '', role: '', image: '' }],
      showtimes: [{ date: '', times: '' }],
      seats: { premium: 80, gold: 120, silver: 200 }
    })
    setError('')
    setSuccess('')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  // Calculate analytics
  const totalBookings = bookings.length
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.finalAmount || 0), 0)
  const totalTickets = bookings.reduce((sum, b) => sum + (b.seats || 0), 0)
  const avgBookingValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0

  // Category breakdown
  const categoryStats = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1
    return acc
  }, {})

  // City breakdown
  const cityStats = events.reduce((acc, event) => {
    acc[event.city] = (acc[event.city] || 0) + 1
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="mt-1 text-white/60">Manage events and bookings</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-2xl bg-[#f84464] px-6 py-3 font-semibold text-white transition hover:brightness-110"
          >
            <Plus size={20} />
            {showForm ? 'Cancel' : 'Add Event'}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-green-400">
            {success}
          </div>
        )}

        {/* Analytics Dashboard */}
        {!showForm && (
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Revenue */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#f84464]/20 to-[#1a1a2e]/60 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Total Revenue</p>
                  <p className="mt-2 text-3xl font-bold text-white">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl bg-[#f84464]/20 p-3">
                  <DollarSign className="h-8 w-8 text-[#f84464]" />
                </div>
              </div>
            </div>

            {/* Total Bookings */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/20 to-[#1a1a2e]/60 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Total Bookings</p>
                  <p className="mt-2 text-3xl font-bold text-white">{totalBookings}</p>
                </div>
                <div className="rounded-2xl bg-blue-500/20 p-3">
                  <Ticket className="h-8 w-8 text-blue-400" />
                </div>
              </div>
            </div>

            {/* Total Tickets */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-green-500/20 to-[#1a1a2e]/60 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Tickets Sold</p>
                  <p className="mt-2 text-3xl font-bold text-white">{totalTickets}</p>
                </div>
                <div className="rounded-2xl bg-green-500/20 p-3">
                  <Users className="h-8 w-8 text-green-400" />
                </div>
              </div>
            </div>

            {/* Avg Booking Value */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/20 to-[#1a1a2e]/60 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Avg Booking</p>
                  <p className="mt-2 text-3xl font-bold text-white">₹{avgBookingValue}</p>
                </div>
                <div className="rounded-2xl bg-purple-500/20 p-3">
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category & City Stats */}
        {!showForm && (
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            {/* Category Breakdown */}
            <div className="rounded-3xl border border-white/10 bg-[#1a1a2e]/60 p-6 backdrop-blur-xl">
              <h3 className="mb-4 text-lg font-semibold text-white">Events by Category</h3>
              <div className="space-y-3">
                {Object.entries(categoryStats).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="capitalize text-white/70">{category}</span>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-[#f84464]"
                          style={{ width: `${(count / events.length) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 text-right font-semibold text-white">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* City Breakdown */}
            <div className="rounded-3xl border border-white/10 bg-[#1a1a2e]/60 p-6 backdrop-blur-xl">
              <h3 className="mb-4 text-lg font-semibold text-white">Events by City</h3>
              <div className="space-y-3">
                {Object.entries(cityStats).map(([city, count]) => (
                  <div key={city} className="flex items-center justify-between">
                    <span className="text-white/70">{city}</span>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${(count / events.length) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 text-right font-semibold text-white">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Event Form */}
        {showForm && (
          <div className="mb-8 rounded-3xl border border-white/10 bg-[#1a1a2e]/60 p-8 backdrop-blur-xl">
            <h2 className="mb-6 text-2xl font-bold text-white">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#f84464]/45"
                  >
                    <option value="movies">Movies</option>
                    <option value="concerts">Concerts</option>
                    <option value="sports">Sports</option>
                    <option value="theatre">Theatre</option>
                    <option value="comedy">Comedy</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Genre (comma-separated) *</label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    placeholder="Action, Thriller, Drama"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Language *</label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Banner Image URL *</label>
                  <input
                    type="url"
                    name="bannerImage"
                    value={formData.bannerImage}
                    onChange={handleInputChange}
                    placeholder="https://picsum.photos/1920/600"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Poster Image URL *</label>
                  <input
                    type="url"
                    name="posterImage"
                    value={formData.posterImage}
                    onChange={handleInputChange}
                    placeholder="https://picsum.photos/400/600"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Rating (0-10) *</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="10"
                    step="0.1"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#f84464]/45"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#f84464]/45"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="2h 30m"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#f84464]/45"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Venue *</label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
                />
              </div>

              {/* Seats */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">Seat Capacity</label>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <input
                      type="number"
                      placeholder="Premium"
                      value={formData.seats.premium}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        seats: { ...prev.seats, premium: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Gold"
                      value={formData.seats.gold}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        seats: { ...prev.seats, gold: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Silver"
                      value={formData.seats.silver}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        seats: { ...prev.seats, silver: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
                    />
                  </div>
                </div>
              </div>

              {/* Cast */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-white/80">Cast Members</label>
                  <button
                    type="button"
                    onClick={addCastMember}
                    className="text-sm text-[#f84464] hover:underline"
                  >
                    + Add Cast
                  </button>
                </div>
                {formData.cast.map((member, index) => (
                  <div key={index} className="mb-2 grid gap-2 md:grid-cols-4">
                    <input
                      type="text"
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) => handleNestedChange('cast', index, 'name', e.target.value)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
                    />
                    <input
                      type="text"
                      placeholder="Role"
                      value={member.role}
                      onChange={(e) => handleNestedChange('cast', index, 'role', e.target.value)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
                    />
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={member.image}
                      onChange={(e) => handleNestedChange('cast', index, 'image', e.target.value)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
                    />
                    <button
                      type="button"
                      onClick={() => removeCastMember(index)}
                      className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/20"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Showtimes */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-white/80">Showtimes</label>
                  <button
                    type="button"
                    onClick={addShowtime}
                    className="text-sm text-[#f84464] hover:underline"
                  >
                    + Add Showtime
                  </button>
                </div>
                {formData.showtimes.map((showtime, index) => (
                  <div key={index} className="mb-2 grid gap-2 md:grid-cols-3">
                    <input
                      type="date"
                      value={showtime.date}
                      onChange={(e) => handleNestedChange('showtimes', index, 'date', e.target.value)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none transition focus:border-[#f84464]/45"
                    />
                    <input
                      type="text"
                      placeholder="Times (comma-separated): 10:00 AM, 2:00 PM"
                      value={showtime.times}
                      onChange={(e) => handleNestedChange('showtimes', index, 'times', e.target.value)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
                    />
                    <button
                      type="button"
                      onClick={() => removeShowtime(index)}
                      className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/20"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Featured */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="h-5 w-5 rounded border-white/10 bg-white/5 text-[#f84464] focus:ring-[#f84464]"
                />
                <label htmlFor="featured" className="text-sm font-medium text-white/80">
                  Mark as Featured Event
                </label>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-[#f84464] py-3 font-semibold text-white transition hover:brightness-110"
                >
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-2xl border border-white/10 bg-white/5 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events List */}
        <div className="rounded-3xl border border-white/10 bg-[#1a1a2e]/60 p-6 backdrop-blur-xl">
          <h2 className="mb-6 text-2xl font-bold text-white">All Events ({events.length})</h2>
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <img
                  src={event.posterImage}
                  alt={event.title}
                  className="h-24 w-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{event.title}</h3>
                  <div className="mt-1 flex flex-wrap gap-3 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <Tag size={14} />
                      {event.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={14} />
                      {event.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {event.city}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="rounded-xl border border-[#f84464]/20 bg-[#f84464]/10 p-3 text-[#f84464] transition hover:bg-[#f84464]/20"
                    title="Edit event"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-red-400 transition hover:bg-red-500/20"
                    title="Delete event"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
