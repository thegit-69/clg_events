import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import { IoQrCodeOutline, IoScanOutline, IoCheckmarkCircle } from 'react-icons/io5'
import Button from '../components/ui/Button'
import useEventStore from '../store/eventStore'
import toast from 'react-hot-toast'

export default function Attendance() {
  const { id } = useParams()
  const { events } = useEventStore()
  const [mode, setMode] = useState('generate') // 'generate' | 'scan'
  const [scannedId, setScannedId] = useState('')
  const [attendees, setAttendees] = useState([
    { id: '1', name: 'Alice Johnson', email: 'alice@srm.edu.in', attended: true, time: '09:15 AM' },
    { id: '2', name: 'Bob Smith', email: 'bob@srm.edu.in', attended: true, time: '09:22 AM' },
    { id: '3', name: 'Charlie Brown', email: 'charlie@srm.edu.in', attended: false, time: null },
    { id: '4', name: 'Diana Prince', email: 'diana@srm.edu.in', attended: true, time: '09:30 AM' },
    { id: '5', name: 'Ethan Hunt', email: 'ethan@srm.edu.in', attended: false, time: null },
  ])

  const event = events.find((e) => e.id === id)
  const qrValue = `campusevents://attendance/${id}`
  const attendedCount = attendees.filter((a) => a.attended).length

  const handleManualMark = (attendeeId) => {
    setAttendees((prev) =>
      prev.map((a) =>
        a.id === attendeeId
          ? { ...a, attended: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          : a
      )
    )
    toast.success('Attendance marked!')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-900">Attendance Tracking</h1>
        <p className="text-dark-500 mt-1">
          {event?.title || 'Event'} — {attendedCount}/{attendees.length} attended
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-3 mb-8">
        <Button
          variant={mode === 'generate' ? 'primary' : 'outline'}
          icon={<IoQrCodeOutline />}
          onClick={() => setMode('generate')}
        >
          QR Code
        </Button>
        <Button
          variant={mode === 'scan' ? 'primary' : 'outline'}
          icon={<IoScanOutline />}
          onClick={() => setMode('scan')}
        >
          Scanner
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* QR Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-dark-200 p-8 text-center"
        >
          {mode === 'generate' ? (
            <>
              <h3 className="text-lg font-bold text-dark-900 mb-4">Event QR Code</h3>
              <p className="text-sm text-dark-500 mb-6">
                Participants scan this code to mark their attendance
              </p>
              <div className="inline-block p-6 bg-white border-2 border-dark-200 rounded-2xl">
                <QRCodeSVG
                  value={qrValue}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-xs text-dark-400 mt-4 font-mono">{qrValue}</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-dark-900 mb-4">Scan QR Code</h3>
              <p className="text-sm text-dark-500 mb-6">
                Point the camera at a participant's QR code
              </p>
              <div className="w-64 h-64 mx-auto bg-dark-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-dark-300">
                <div className="text-center">
                  <IoScanOutline className="text-4xl text-dark-400 mx-auto mb-2" />
                  <p className="text-sm text-dark-400">Camera preview</p>
                  <p className="text-xs text-dark-300 mt-1">
                    (Requires HTTPS in production)
                  </p>
                </div>
              </div>
              {/* Manual entry */}
              <div className="mt-6">
                <input
                  type="text"
                  value={scannedId}
                  onChange={(e) => setScannedId(e.target.value)}
                  placeholder="Or enter registration ID manually"
                  className="w-full px-4 py-3 border-2 border-dark-200 rounded-xl text-sm
                             focus:outline-none focus:border-primary-500"
                />
                <Button
                  className="mt-3"
                  size="sm"
                  onClick={() => {
                    if (scannedId) {
                      toast.success(`Attendance marked for ID: ${scannedId}`)
                      setScannedId('')
                    }
                  }}
                >
                  Mark Attendance
                </Button>
              </div>
            </>
          )}
        </motion.div>

        {/* Attendee List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-dark-200 overflow-hidden"
        >
          <div className="p-6 border-b border-dark-100">
            <h3 className="text-lg font-bold text-dark-900">Attendees</h3>
            <p className="text-sm text-dark-400">
              {attendedCount} of {attendees.length} checked in
            </p>
          </div>
          <div className="divide-y divide-dark-100">
            {attendees.map((attendee) => (
              <div
                key={attendee.id}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                      ${attendee.attended
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-dark-100 text-dark-400'
                      }`}
                  >
                    {attendee.attended ? (
                      <IoCheckmarkCircle />
                    ) : (
                      attendee.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-900">
                      {attendee.name}
                    </p>
                    <p className="text-xs text-dark-400">{attendee.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  {attendee.attended ? (
                    <span className="text-xs text-emerald-600 font-medium">
                      ✓ {attendee.time}
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleManualMark(attendee.id)}
                    >
                      Mark
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
