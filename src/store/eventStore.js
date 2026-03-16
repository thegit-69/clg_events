import { create } from 'zustand'
import { MOCK_EVENTS } from '../utils/mockData'

const useEventStore = create((set, get) => ({
  events: MOCK_EVENTS,
  filteredEvents: MOCK_EVENTS,
  selectedEvent: null,
  searchQuery: '',
  activeTab: 'all',
  activeFilter: 'all',

  setEvents: (events) => set({ events, filteredEvents: events }),

  setSelectedEvent: (event) => set({ selectedEvent: event }),

  setSearchQuery: (query) => {
    const { events, activeFilter } = get()
    const filtered = events.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.organizer.toLowerCase().includes(query.toLowerCase()) ||
        e.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      const matchesFilter =
        activeFilter === 'all' ||
        e.type.toLowerCase() === activeFilter.toLowerCase()
      return matchesSearch && matchesFilter
    })
    set({ searchQuery: query, filteredEvents: filtered })
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setActiveFilter: (filter) => {
    const { events, searchQuery } = get()
    const filtered = events.filter((e) => {
      const matchesFilter =
        filter === 'all' || e.type.toLowerCase() === filter.toLowerCase()
      const matchesSearch =
        !searchQuery ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.organizer.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    })
    set({ activeFilter: filter, filteredEvents: filtered })
  },

  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events],
      filteredEvents: [event, ...state.filteredEvents],
    })),

  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
      filteredEvents: state.filteredEvents.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),

  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
      filteredEvents: state.filteredEvents.filter((e) => e.id !== id),
    })),
}))

export default useEventStore
