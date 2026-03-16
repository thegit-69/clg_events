import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoPeopleOutline,
  IoTimeOutline,
  IoArrowBack,
  IoShareSocialOutline,
} from 'react-icons/io5'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import useEventStore from '../store/eventStore'
import useAuthStore from '../store/authStore'
import { formatDateLong, formatDateTime } from '../utils/helpers'
import { registerForEvent, updateEvent as updateEventInFirestore } from '../services/eventService'
import toast from 'react-hot-toast'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { events, updateEvent } = useEventStore()
  const { user, isAuthenticated } = useAuthStore()
  const [registering, setRegistering] = useState(false)

  const event = events.find((e) => e.id === id)

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-dark-900 mb-4">Event not found</h2>
        <Button onClick={() => navigate('/events')}>Browse Events</Button>
      </div>
    )
  }

  const spotsLeft = event.maxParticipants - event.registeredCount
  const progress = (event.registeredCount / event.maxParticipants) * 100

  const handleRegister = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to register')
      return
    }
    setRegistering(true)
    try {
      await registerForEvent(event.id, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
      })
      const newCount = (event.registeredCount || 0) + 1
      // Update in Firestore (best effort)
      try {
        await updateEventInFirestore(event.id, { registeredCount: newCount })
      } catch (e) { /* non-critical */ }
      updateEvent(event.id, { registeredCount: newCount })
      toast.success(`Registered for ${event.title}!`)
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Registration failed. Please try again.')
    } finally {
      setRegistering(false)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={event.banner}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <IoArrowBack size={20} /> Back
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-dark-200 shadow-lg overflow-hidden"
        >
          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge>{event.mode}</Badge>
                  <Badge>{event.status}</Badge>
                </div>
                <h1 className="text-3xl font-bold text-dark-900">{event.title}</h1>
                <p className="text-dark-500 mt-1">
                  Organized by <span className="font-semibold text-dark-700">{event.organizer}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" icon={<IoShareSocialOutline />} onClick={handleShare}>
                  Share
                </Button>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <IoCalendarOutline className="text-primary-500 text-xl mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-dark-700">Date</p>
                    <p className="text-sm text-dark-500">
                      {formatDateLong(event.startDate)} — {formatDateLong(event.endDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IoTimeOutline className="text-primary-500 text-xl mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-dark-700">Time</p>
                    <p className="text-sm text-dark-500">{formatDateTime(event.startDate)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IoLocationOutline className="text-primary-500 text-xl mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-dark-700">Venue</p>
                    <p className="text-sm text-dark-500">{event.venue}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-3 mb-4">
                  <IoPeopleOutline className="text-primary-500 text-xl mt-0.5" />
                  <div className="w-full">
                    <p className="text-sm font-medium text-dark-700">Registrations</p>
                    <p className="text-sm text-dark-500 mb-2">
                      {event.registeredCount} / {event.maxParticipants} spots filled
                    </p>
                    <div className="w-full bg-dark-100 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-emerald-600 font-medium mt-1">
                      {spotsLeft} spots remaining
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">
                Themes
              </h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <Badge key={tag} color="gray">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-dark-900 mb-3">About this event</h3>
              <p className="text-dark-600 leading-relaxed">{event.description}</p>
            </div>

            {/* Register CTA */}
            <div className="border-t border-dark-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-dark-500">
                  Registration deadline: <span className="font-semibold text-dark-700">{formatDateTime(event.registrationDeadline)}</span>
                </p>
              </div>
              <Button size="lg" onClick={handleRegister} disabled={registering}>
                {registering ? 'Registering...' : 'Register Now'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="h-20" />
    </div>
  )
}
