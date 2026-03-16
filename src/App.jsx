import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import DashboardLayout from './components/layout/DashboardLayout'
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Dashboard from './pages/Dashboard'
import ManageEvents from './pages/ManageEvents'
import CreateEvent from './pages/CreateEvent'
import Attendance from './pages/Attendance'
import Notifications from './pages/Notifications'
import MyTickets from './pages/MyTickets'
import NotFound from './pages/NotFound'
import useAuthStore from './store/authStore'
import useEventStore from './store/eventStore'
import { onAuthChange } from './services/authService'
import { fetchEvents } from './services/eventService'

function App() {
  const { setUser, setLoading } = useAuthStore()
  const { setEvents } = useEventStore()

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          role: 'organizer',
        })
      } else {
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [setUser, setLoading])

  // Load events from Firestore on mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const events = await fetchEvents()
        if (events.length > 0) {
          setEvents(events)
        }
        // If Firestore is empty, keep mock data as fallback
      } catch (error) {
        console.warn('Using mock data — Firestore fetch failed:', error.message)
      }
    }
    loadEvents()
  }, [setEvents])

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes with Navbar + Footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Dashboard routes with Sidebar */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="create" element={<CreateEvent />} />
          <Route path="events/:id/attendance" element={<Attendance />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
