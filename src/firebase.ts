import { initializeApp } from 'firebase/app'
import { initializeFirestore, persistentLocalCache, memoryLocalCache, connectFirestoreEmulator, type Firestore } from 'firebase/firestore'

// Firebase veb-konfiguratsiyasi. Bu kalitlar maxfiy emas — ular brauzerga baribir yuboriladi.
// Ma'lumotlar xavfsizligi Firebase Console'dagi Firestore qoidalari (firestore.rules) bilan boshqariladi.
const firebaseConfig = {
  apiKey: 'AIzaSyC4y6T-nRGINs7-Cj5BPuSyxtLq79UBX24',
  authDomain: 'avangard-447ad.firebaseapp.com',
  projectId: 'avangard-447ad',
  storageBucket: 'avangard-447ad.firebasestorage.app',
  messagingSenderId: '555285519277',
  appId: '1:555285519277:web:f614b86380cde196f59f24',
  measurementId: 'G-XYCZV7HQCS',
}

export const app = initializeApp(firebaseConfig)

let firestore: Firestore
try {
  // Oflayn ishlash uchun ma'lumotlar qurilmada keshlanadi
  firestore = initializeFirestore(app, { localCache: persistentLocalCache() })
} catch {
  firestore = initializeFirestore(app, { localCache: memoryLocalCache() })
}
export const db = firestore

// Faqat sinov uchun: VITE_FIRESTORE_EMULATOR=1 bo'lsa mahalliy emulyatorga ulanadi
if (import.meta.env.VITE_FIRESTORE_EMULATOR) connectFirestoreEmulator(db, '127.0.0.1', 8080)

// Analitika faqat qo'llab-quvvatlanadigan brauzerlarda yoqiladi
import('firebase/analytics')
  .then(({ isSupported, getAnalytics }) => isSupported().then((ok) => ok && getAnalytics(app)))
  .catch(() => {})
