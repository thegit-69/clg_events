import { useRef, useState, useEffect } from 'react'
import { IoDownloadOutline, IoLockClosed, IoPrintOutline } from 'react-icons/io5'
import html2pdf from 'html2pdf.js'
import Button from './Button'
import { checkUserAttendance } from '../../services/eventService'

export default function CertificateDownload({ studentName, eventName, userId, eventId, eventDate }) {
    const certificateRef = useRef(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [attended, setAttended] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkStatus = async () => {
            if (!userId || !eventId) {
                setLoading(false)
                return
            }
            try {
                const hasAttended = await checkUserAttendance(eventId, userId)
                setAttended(hasAttended)
            } catch (error) {
                console.error('Failed to verify attendance:', error)
            } finally {
                setLoading(false)
            }
        }
        checkStatus()
    }, [userId, eventId])

    const handleDownload = async () => {
        if (!certificateRef.current) return
        setIsGenerating(true)

        const element = certificateRef.current
        const opt = {
            margin: 0,
            filename: `${studentName.replace(/\s+/g, '_')}_${eventName.replace(/\s+/g, '_')}_Certificate.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
        }

        try {
            await html2pdf().set(opt).from(element).save()
        } catch (error) {
            console.error('Certificate generation failed:', error)
        } finally {
            setIsGenerating(false)
        }
    }

    if (loading) {
        return (
            <div className="bg-dark-50 border border-dark-100 rounded-xl p-6 flex flex-col items-center justify-center h-24 animate-pulse">
                <div className="h-4 w-32 bg-dark-200 rounded mb-2"></div>
                <div className="h-3 w-24 bg-dark-200 rounded"></div>
            </div>
        )
    }

    // If user hasn't attended, show locked state
    if (!attended) {
        return (
            <div className="bg-dark-100 border border-dark-200 rounded-xl p-6 flex flex-col items-center text-center opacity-75">
                <div className="w-12 h-12 bg-dark-200 rounded-full flex items-center justify-center mb-3">
                    <IoLockClosed className="text-2xl text-dark-400" />
                </div>
                <h3 className="text-lg font-bold text-dark-800">Certificate Locked</h3>
                <p className="text-sm text-dark-500 mt-1 max-w-[250px]">
                    You must attend the event "{eventName}" to unlock your certificate of participation.
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                            <IoPrintOutline className="text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-dark-900">Download Certificate</h3>
                            <p className="text-sm text-dark-500">
                                Your official certificate of participation is ready.
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="w-full md:w-auto shadow-lg shadow-primary-500/20"
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-2">Generating...</span>
                        ) : (
                            <>
                                <IoDownloadOutline className="text-lg" />
                                Download PDF
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Hidden Certificate Template */}
            <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                <div
                    ref={certificateRef}
                    className="w-[1123px] h-[794px] bg-white p-12 text-dark-900 relative"
                    style={{ fontFamily: "'Times New Roman', serif" }}
                >
                    {/* Decorative Border */}
                    <div className="h-full w-full border-8 border-double border-primary-800 p-8 relative">
                        {/* Corner Ornaments */}
                        <div className="absolute top-2 left-2 w-16 h-16 border-t-4 border-l-4 border-primary-600"></div>
                        <div className="absolute top-2 right-2 w-16 h-16 border-t-4 border-r-4 border-primary-600"></div>
                        <div className="absolute bottom-2 left-2 w-16 h-16 border-b-4 border-l-4 border-primary-600"></div>
                        <div className="absolute bottom-2 right-2 w-16 h-16 border-b-4 border-r-4 border-primary-600"></div>

                        <div className="h-full flex flex-col items-center justify-between text-center pt-12 pb-24">

                            {/* Header */}
                            <div className="space-y-4">
                                <div className="text-primary-800 opacity-80 uppercase tracking-[0.2em] font-bold">
                                    College Event Management System
                                </div>
                                <h1 className="text-6xl font-bold text-dark-900 uppercase tracking-wider text-primary-900" style={{ fontFamily: 'serif' }}>
                                    Certificate
                                </h1>
                                <h2 className="text-2xl italic text-dark-600 font-serif">
                                    of Participation
                                </h2>
                            </div>

                            {/* Main Content */}
                            <div className="space-y-6 my-8 w-full max-w-4xl">
                                <p className="text-xl text-dark-600">This is to certify that</p>

                                <div className="text-5xl font-bold text-primary-700 py-4 border-b-2 border-dark-200 mx-auto w-3/4 font-serif italic">
                                    {studentName || 'Student Name'}
                                </div>

                                <p className="text-xl text-dark-600 mt-6">
                                    has successfully participated in the event
                                </p>

                                <div className="text-3xl font-bold text-dark-800 mt-2">
                                    {eventName || 'Event Name'}
                                </div>

                                <p className="text-lg text-dark-500 mt-4">
                                    Held on {eventDate ? new Date(eventDate).toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : new Date().toLocaleDateString(undefined, {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>

                            {/* Footer / Signatures */}
                            <div className="flex justify-between w-full px-20 mt-12">
                                <div className="text-center">
                                    <div className="w-64 border-b border-dark-800 mb-2"></div>
                                    <p className="font-bold text-dark-800">Event Coordinator</p>
                                    <p className="text-sm text-dark-500">Signature</p>
                                </div>

                                <div className="flex flex-col items-center justify-center">
                                    {/* Optional Seal / Badge */}
                                    <div className="w-24 h-24 rounded-full border-4 border-primary-200 flex items-center justify-center bg-primary-50 text-primary-800 font-bold shadow-inner">
                                        SEAL
                                    </div>
                                </div>

                                <div className="text-center">
                                    <div className="w-64 border-b border-dark-800 mb-2"></div>
                                    <p className="font-bold text-dark-800">Principal / Authority</p>
                                    <p className="text-sm text-dark-500">Signature</p>
                                </div>
                            </div>

                            {/* ID or Ref Code */}
                            <div className="absolute bottom-8 left-0 w-full text-center">
                                <p className="text-xs text-dark-300 font-mono">
                                    Certificate ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
