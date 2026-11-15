import { create } from 'zustand'
import {
  connectAuthEmulator, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updatePassword,
  EmailAuthProvider, reauthenticateWithCredential,
} from 'firebase/auth'
import { app } from './firebase'

/**
 * Xodimlar hisoblari. Ular Firebase Console → Authentication'da yaratiladi
 * va firestore.rules'dagi manzillar bilan bir xil bo'lishi kerak.
 */
export const ADMIN_EMAIL = 'admin@avangard.app'
export const BOSS_EMAIL = 'boshliq@avangard.app'

export type Role = 'admin' | 'boss' | null
const DEMO = import.meta.env.VITE_DEMO === '1'

const roleOf = (email: string | null | undefined): Role =>
  email === BOSS_EMAIL ? 'boss' : email === ADMIN_EMAIL ? 'admin' : null

export const useSession = create<{ ready: boolean; role: Role; setRole: (r: Role) => void }>((set) => ({
  ready: DEMO,
  role: null,
  setRole: (role) => set({ role }),
}))

const auth = DEMO ? null : getAuth(app)
if (auth && import.meta.env.VITE_FIRESTORE_EMULATOR) connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
if (auth) onAuthStateChanged(auth, (u) => useSession.setState({ ready: true, role: roleOf(u?.email) }))

export const isDemo = DEMO

/** Xodim sifatida kirish. Xato bo'lsa, o'zbekcha matn qaytaradi. */
export async function staffSignIn(role: 'admin' | 'boss', password: string): Promise<string | null> {
  if (!auth) return 'Namuna rejimida login yo‘q'
  try {
    await signInWithEmailAndPassword(auth, role === 'boss' ? BOSS_EMAIL : ADMIN_EMAIL, password)
    return null
  } catch (e) {
    return authError(e)
  }
}

export async function staffSignOut() {
  if (auth) await signOut(auth).catch(() => {})
  useSession.setState({ role: null })
}

/** Hozirgi xodimning o'z parolini almashtirish. */
export async function changeOwnPassword(current: string, next: string): Promise<string | null> {
  const u = auth?.currentUser
  if (!u?.email) return 'Avval tizimga kiring'
  try {
    await reauthenticateWithCredential(u, EmailAuthProvider.credential(u.email, current))
    await updatePassword(u, next)
    return null
  } catch (e) {
    return authError(e)
  }
}

function authError(e: unknown): string {
  const code = (e as { code?: string })?.code ?? ''
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-login-credentials')
    return 'Parol noto‘g‘ri'
  if (code === 'auth/too-many-requests') return 'Juda ko‘p urinish. Birozdan keyin qayta urinib ko‘ring'
  if (code === 'auth/network-request-failed') return 'Internet aloqasi yo‘q'
  if (code === 'auth/operation-not-allowed' || code === 'auth/configuration-not-found')
    return 'Firebase’da Email/Password kirish usuli yoqilmagan'
  if (code === 'auth/weak-password') return 'Yangi parol kamida 6 belgidan iborat bo‘lsin'
  if (code === 'auth/user-disabled') return 'Bu hisob o‘chirib qo‘yilgan'
  console.error(e)
  return 'Kirib bo‘lmadi. Qayta urinib ko‘ring'
}
