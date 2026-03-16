import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoTrashOutline, IoCreateOutline, IoQrCodeOutline } from 'react-icons/io5'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import useEventStore from '../store/eventStore'
import { formatDate } from '../utils/helpers'
import { deleteEvent as deleteEventFromFirestore } from '../services/eventService'
import toast from 'react-hot-toast'

export default function ManageEvents() {
  const navigate = useNavigate()
  const { events, deleteEvent } = useEventStore()

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      try {
        await deleteEventFromFirestore(id)
      } catch (e) { /* non-critical if Firestore fails */ }
      deleteEvent(id)
      toast.success('Event deleted')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">My Events</h1>
          <p className="text-dark-500 mt-1">Manage all your created events</p>
        </div>
        <Button onClick={() => navigate('/dashboard/create')}>
          + Create Event
        </Button>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white border border-dark-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4"
          >
            {/* Thumbnail */}
            <div className="w-full md:w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={event.banner}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-dark-900 text-sm">{event.title}</h3>
              <p className="text-xs text-dark-400 mt-0.5">
                {event.type} • {formatDate(event.startDate)}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge>{event.status}</Badge>
                <Badge>{event.mode}</Badge>
                <span className="text-xs text-dark-400">
                  {event.registeredCount} registered
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                icon={<IoQrCodeOutline />}
                onClick={() => navigate(`/dashboard/events/${event.id}/attendance`)}
              >
                QR
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<IoCreateOutline />}
                onClick={() => navigate(`/events/${event.id}`)}
              >
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<IoTrashOutline />}
                className="text-red-500 hover:bg-red-50"
                onClick={() => handleDelete(event.id, event.title)}
              />
            </div>
          </motion.div>
        ))}

        {events.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dark-200">
            <p className="text-dark-400 text-lg mb-4">No events yet</p>
            <Button onClick={() => navigate('/dashboard/create')}>
              Create your first event
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
