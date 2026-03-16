import { motion } from 'framer-motion'
import {
  IoCalendarOutline,
  IoPeopleOutline,
  IoTrendingUpOutline,
  IoCheckmarkCircleOutline,
} from 'react-icons/io5'
import StatsCard from '../components/ui/StatsCard'
import useEventStore from '../store/eventStore'

export default function Dashboard() {
  const { events } = useEventStore()

  const totalEvents = events.length
  const totalRegistrations = events.reduce((acc, e) => acc + e.registeredCount, 0)
  const openEvents = events.filter((e) => e.status === 'OPEN').length
  const upcomingEvents = events.filter((e) => e.status === 'UPCOMING').length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-900">Dashboard Overview</h1>
        <p className="text-dark-500 mt-1">Welcome back! Here's a summary of your events.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={<IoCalendarOutline />}
          label="Total Events"
          value={totalEvents}
          color="primary"
        />
        <StatsCard
          icon={<IoPeopleOutline />}
          label="Total Registrations"
          value={totalRegistrations}
          color="green"
        />
        <StatsCard
          icon={<IoTrendingUpOutline />}
          label="Open Events"
          value={openEvents}
          color="purple"
        />
        <StatsCard
          icon={<IoCheckmarkCircleOutline />}
          label="Upcoming"
          value={upcomingEvents}
          color="orange"
        />
      </div>

      {/* Recent Events Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-dark-200 overflow-hidden"
      >
        <div className="p-6 border-b border-dark-100">
          <h2 className="text-lg font-bold text-dark-900">Recent Events</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                  Registrations
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-dark-500 uppercase tracking-wider">
                  Mode
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {events.slice(0, 5).map((event) => (
                <tr key={event.id} className="hover:bg-dark-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-dark-900 text-sm">{event.title}</p>
                    <p className="text-xs text-dark-400">{event.organizer}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-dark-600">{event.type}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold
                        ${event.status === 'OPEN'
                          ? 'bg-emerald-50 text-emerald-600'
                          : event.status === 'UPCOMING'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-dark-100 text-dark-500'
                        }`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-dark-600">
                    {event.registeredCount} / {event.maxParticipants}
                  </td>
                  <td className="px-6 py-4 text-sm text-dark-600">{event.mode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
