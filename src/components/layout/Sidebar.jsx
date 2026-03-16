import { NavLink } from 'react-router-dom'
import {
  IoGridOutline,
  IoCalendarOutline,
  IoAddCircleOutline,
  IoNotificationsOutline,
  IoSettingsOutline,
} from 'react-icons/io5'
import { HiOutlineAcademicCap } from 'react-icons/hi2'

const sidebarLinks = [
  { label: 'Overview', path: '/dashboard', icon: <IoGridOutline />, end: true },
  { label: 'My Events', path: '/dashboard/events', icon: <IoCalendarOutline /> },
  { label: 'Create Event', path: '/dashboard/create', icon: <IoAddCircleOutline /> },
  { label: 'Notifications', path: '/dashboard/notifications', icon: <IoNotificationsOutline /> },
  { label: 'Settings', path: '/dashboard/settings', icon: <IoSettingsOutline /> },
]

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-dark-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <HiOutlineAcademicCap className="text-white text-lg" />
          </div>
          <span className="text-lg font-bold">CampusEvents</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {sidebarLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
                    ? 'bg-primary-500 text-white'
                    : 'text-dark-400 hover:text-white hover:bg-dark-800'
                  }`
                }
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-700">
        <p className="text-xs text-dark-500 text-center">
          Organizer Dashboard
        </p>
      </div>
    </aside>
  )
}
