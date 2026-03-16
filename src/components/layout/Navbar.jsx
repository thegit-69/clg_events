import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5'
import { HiOutlineAcademicCap } from 'react-icons/hi2'
import Button from '../ui/Button'
import useAuthStore from '../../store/authStore'
import AuthModal from '../AuthModal'
import { NAV_LINKS } from '../../utils/constants'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const [authModal, setAuthModal] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const location = useLocation()

  return (
    <>
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-dark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <HiOutlineAcademicCap className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-dark-900">
                CampusEvents
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200
                    ${location.pathname === link.path
                      ? 'text-primary-500'
                      : 'text-dark-500 hover:text-dark-900'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-8 h-8 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm">
                        {user?.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                    <button
                      onClick={logout}
                      className="text-sm text-dark-500 hover:text-dark-700"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setAuthModal(true)}
                  >
                    Join CampusEvents
                  </Button>
                  <button
                    onClick={() => setAuthModal(true)}
                    className="text-sm font-medium text-dark-600 hover:text-dark-900"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-dark-600"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? (
                <IoCloseOutline size={24} />
              ) : (
                <IoMenuOutline size={24} />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenu && (
            <div className="md:hidden py-4 border-t border-dark-100">
              <div className="flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenu(false)}
                    className="text-sm font-medium text-dark-600 hover:text-dark-900 py-2"
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenu(false)}
                      className="text-sm font-medium text-primary-500 py-2"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setMobileMenu(false)
                      }}
                      className="text-sm text-dark-500 text-left py-2"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      setAuthModal(true)
                      setMobileMenu(false)
                    }}
                  >
                    Join CampusEvents
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal isOpen={authModal} onClose={() => setAuthModal(false)} />
    </>
  )
}
