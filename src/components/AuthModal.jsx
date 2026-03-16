import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import Modal from './ui/Modal'
import Button from './ui/Button'
import useAuthStore from '../store/authStore'
import { signInWithGoogle } from '../services/authService'
import toast from 'react-hot-toast'

export default function AuthModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(true)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuthStore()

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const user = await signInWithGoogle()
      setUser({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: 'organizer',
      })
      toast.success('Signed in successfully!')
      onClose()
    } catch (error) {
      toast.error(error.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    // Email auth can be added later; for now prompt Google
    toast('Please use Google sign-in for now', { icon: 'ℹ️' })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-3xl font-bold text-dark-900 mb-1">
        {isSignUp ? 'Sign up' : 'Sign in'}
      </h2>
      <p className="text-sm text-dark-500 mb-6">
        {isSignUp ? (
          <>
            Already have an account?{' '}
            <button
              onClick={() => setIsSignUp(false)}
              className="text-primary-500 font-semibold hover:underline"
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            Don&apos;t have an account?{' '}
            <button
              onClick={() => setIsSignUp(true)}
              className="text-primary-500 font-semibold hover:underline"
            >
              Sign up
            </button>
          </>
        )}
      </p>

      {/* Email Form */}
      <form onSubmit={handleEmailSubmit} className="mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-3 border-2 border-dark-200 rounded-xl text-dark-700
                     placeholder-dark-400 focus:outline-none focus:border-primary-500
                     transition-colors duration-200"
        />
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-5">
        <div className="flex-1 h-px bg-dark-200" />
        <span className="text-xs font-semibold text-dark-400 uppercase">Or</span>
        <div className="flex-1 h-px bg-dark-200" />
      </div>

      {/* Social Auth */}
      <div className="space-y-3">
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3
                     border-2 border-dark-200 rounded-xl text-dark-700 font-medium
                     hover:bg-dark-50 transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FcGoogle size={20} />
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>
      </div>

      <p className="text-xs text-dark-400 text-center mt-6">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </Modal>
  )
}
