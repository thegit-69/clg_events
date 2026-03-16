import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  limit,
} from 'firebase/firestore'
import { db } from './firebase'

const EVENTS_COLLECTION = 'events'
const REGISTRATIONS_COLLECTION = 'registrations'

// Events
export const fetchEvents = async () => {
  try {
    const q = query(collection(db, EVENTS_COLLECTION), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    // Fallback if index isn't ready
    if (error.code === 'failed-precondition') {
      console.warn('Index missing — fetching events without order.')
      const snapshot = await getDocs(collection(db, EVENTS_COLLECTION))
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    }
    throw error
  }
}

export const fetchEventById = async (id) => {
  const docRef = doc(db, EVENTS_COLLECTION, id)
  const snapshot = await getDoc(docRef)
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() }
  }
  return null
}

export const createEvent = async (eventData) => {
  const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
    ...eventData,
    createdAt: serverTimestamp(),
    registeredCount: 0,
  })
  return docRef.id
}

export const updateEvent = async (id, updates) => {
  const docRef = doc(db, EVENTS_COLLECTION, id)
  await updateDoc(docRef, updates)
}

export const deleteEvent = async (id) => {
  await deleteDoc(doc(db, EVENTS_COLLECTION, id))
}

// Registrations
export const registerForEvent = async (eventId, userData) => {
  const docRef = await addDoc(collection(db, REGISTRATIONS_COLLECTION), {
    eventId,
    ...userData,
    registeredAt: serverTimestamp(),
    attended: false,
  })
  return docRef.id
}

export const checkUserAttendance = async (eventId, userId) => {
  try {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      where('eventId', '==', eventId),
      where('uid', '==', userId),
      limit(1)
    )
    const snapshot = await getDocs(q)
    if (snapshot.empty) return false
    return snapshot.docs[0].data().attended || false
  } catch (error) {
    console.error('Error checking attendance:', error)
    return false
  }
}

export const fetchRegistrations = async (eventId) => {
  try {
    // Try with ordering (requires composite index)
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      where('eventId', '==', eventId),
      orderBy('registeredAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    // Fallback without ordering if composite index doesn't exist yet
    if (error.code === 'failed-precondition') {
      console.warn('Composite index missing — fetching without order. Check Firestore console for index link.')
      const q = query(
        collection(db, REGISTRATIONS_COLLECTION),
        where('eventId', '==', eventId)
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    }
    throw error
  }
}

export const markAttendance = async (registrationId) => {
  const docRef = doc(db, REGISTRATIONS_COLLECTION, registrationId)
  await updateDoc(docRef, { attended: true, attendedAt: serverTimestamp() })
}

export const fetchUserRegistrations = async (uid) => {
  try {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      where('uid', '==', uid),
      orderBy('registeredAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (error) {
    if (error.code === 'failed-precondition') {
      const q = query(
        collection(db, REGISTRATIONS_COLLECTION),
        where('uid', '==', uid)
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    }
    throw error
  }
}
