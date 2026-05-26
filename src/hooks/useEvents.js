import { useState, useEffect } from 'react'
import { events as mockEvents } from '../data/mockData.js'

/**
 * Returns a live-updating merged list of mock events + admin-added events.
 * Listens to the custom 'ev_events_updated' event so any page that calls
 * apiCreateEvent / apiUpdateEvent / apiDeleteEvent will trigger a re-render
 * across ALL components using this hook.
 */
export function useEvents() {
  const [allEvents, setAllEvents] = useState(() => getMergedEvents())

  useEffect(() => {
    function refresh() {
      setAllEvents(getMergedEvents())
    }

    // Listen for admin changes
    window.addEventListener('ev_events_updated', refresh)
    // Also poll storage events (cross-tab support)
    window.addEventListener('storage', refresh)

    return () => {
      window.removeEventListener('ev_events_updated', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return allEvents
}

function getMergedEvents() {
  try {
    const stored = JSON.parse(localStorage.getItem('ev_events') || '[]')
    // Separate admin-added events (id starts with 'evt_') from mock events
    const adminEvents = stored.filter(e => String(e.id).startsWith('evt_'))
    // Merge: admin events first (newest), then mock events
    return [...adminEvents, ...mockEvents]
  } catch {
    return mockEvents
  }
}
