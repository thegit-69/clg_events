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
} from 'firebase/firestore'
import { db } from './firebase'

const EVENTS_COLLECTION = 'events'
const REGISTRATIONS_COLLECTION = 'registrations'

// Events
export const fetchEvents = async () => {
  const q = query(collection(db, EVENTS_COLLECTION), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
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

export const fetchRegistrations = async (eventId) => {
  const q = query(
    collection(db, REGISTRATIONS_COLLECTION),
    where('eventId', '==', eventId),
    orderBy('registeredAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const markAttendance = async (registrationId) => {
  const docRef = doc(db, REGISTRATIONS_COLLECTION, registrationId)
  await updateDoc(docRef, { attended: true, attendedAt: serverTimestamp() })
}
