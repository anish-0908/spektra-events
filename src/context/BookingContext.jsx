/* eslint-disable react-refresh/only-export-components -- Provider + hook in one module */
import { createContext, useContext, useMemo, useState } from 'react'

const BookingContext = createContext(null)

const DEFAULT_CITY = 'Mumbai'

export function BookingProvider({ children }) {
  const [city, setCity] = useState(DEFAULT_CITY)

  // booking flow state
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([]) // [{ id, row, number, tier, price }]

  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(null) // { code, discountAmount }

  const value = useMemo(
    () => ({
      city,
      setCity,

      selectedEventId,
      setSelectedEventId,
      selectedDate,
      setSelectedDate,
      selectedTime,
      setSelectedTime,
      selectedSeats,
      setSelectedSeats,

      promoCode,
      setPromoCode,
      promoApplied,
      setPromoApplied,

      resetBooking: () => {
        setSelectedEventId(null)
        setSelectedDate(null)
        setSelectedTime(null)
        setSelectedSeats([])
        setPromoCode('')
        setPromoApplied(null)
      },
    }),
    [
      city,
      selectedEventId,
      selectedDate,
      selectedTime,
      selectedSeats,
      promoCode,
      promoApplied,
    ],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}

