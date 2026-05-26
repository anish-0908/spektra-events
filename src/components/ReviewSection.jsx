import { useState, useEffect } from 'react'
import { Star, ThumbsUp, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ReviewSection({ eventId, eventTitle }) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Load reviews from localStorage
  useEffect(() => {
    loadReviews()
  }, [eventId])

  function loadReviews() {
    const allReviews = JSON.parse(localStorage.getItem('ev_reviews') || '[]')
    const eventReviews = allReviews.filter(r => r.eventId === eventId)
    setReviews(eventReviews)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!user) {
      alert('Please login to submit a review')
      return
    }
    if (rating === 0) {
      alert('Please select a rating')
      return
    }

    setSubmitting(true)

    try {
      const newReview = {
        id: 'rev_' + Date.now(),
        eventId,
        eventTitle,
        userId: user.email,
        userName: user.name,
        rating,
        comment: comment.trim(),
        helpful: 0,
        createdAt: new Date().toISOString(),
      }

      // Save to localStorage
      const allReviews = JSON.parse(localStorage.getItem('ev_reviews') || '[]')
      allReviews.unshift(newReview)
      localStorage.setItem('ev_reviews', JSON.stringify(allReviews))

      // Update average rating in events
      updateEventRating(eventId, allReviews.filter(r => r.eventId === eventId))

      // Reset form
      setRating(0)
      setComment('')
      setShowForm(false)
      loadReviews()
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  function updateEventRating(eventId, eventReviews) {
    const events = JSON.parse(localStorage.getItem('ev_events') || '[]')
    const eventIndex = events.findIndex(e => e.id === eventId || e._id === eventId)
    
    if (eventIndex !== -1 && eventReviews.length > 0) {
      const avgRating = eventReviews.reduce((sum, r) => sum + r.rating, 0) / eventReviews.length
      events[eventIndex].rating = parseFloat(avgRating.toFixed(1))
      events[eventIndex].reviewCount = eventReviews.length
      localStorage.setItem('ev_events', JSON.stringify(events))
    }
  }

  function handleHelpful(reviewId) {
    const allReviews = JSON.parse(localStorage.getItem('ev_reviews') || '[]')
    const reviewIndex = allReviews.findIndex(r => r.id === reviewId)
    
    if (reviewIndex !== -1) {
      allReviews[reviewIndex].helpful = (allReviews[reviewIndex].helpful || 0) + 1
      localStorage.setItem('ev_reviews', JSON.stringify(allReviews))
      loadReviews()
    }
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Reviews & Ratings</h2>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 fill-[#f84464] text-[#f84464]" />
              <span className="text-2xl font-bold text-white">{avgRating}</span>
              <span className="text-white/60">({reviews.length} reviews)</span>
            </div>
          </div>
        </div>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-2xl bg-[#f84464] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            {showForm ? 'Cancel' : 'Write Review'}
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-[#1a1a2e]/60 p-6 backdrop-blur-xl">
          <h3 className="mb-4 text-lg font-semibold text-white">Write Your Review</h3>
          
          {/* Star Rating */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-white/80">Your Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? 'fill-[#f84464] text-[#f84464]'
                        : 'text-white/30'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-white/80">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows="4"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35 outline-none transition focus:border-[#f84464]/45"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="w-full rounded-2xl bg-[#f84464] py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#1a1a2e]/60 p-8 text-center backdrop-blur-xl">
            <p className="text-white/60">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-3xl border border-white/10 bg-[#1a1a2e]/60 p-6 backdrop-blur-xl"
            >
              {/* Review Header */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f84464]/20">
                    <User className="h-5 w-5 text-[#f84464]" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{review.userName}</p>
                    <p className="text-xs text-white/50">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? 'fill-[#f84464] text-[#f84464]'
                          : 'text-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <p className="mb-4 text-white/80">{review.comment}</p>

              {/* Helpful Button */}
              <button
                onClick={() => handleHelpful(review.id)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10"
              >
                <ThumbsUp className="h-4 w-4" />
                Helpful ({review.helpful || 0})
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
