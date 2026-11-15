import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  collection, doc, onSnapshot, setDoc, deleteDoc, updateDoc, writeBatch, increment,
  query, orderBy, limit, where, documentId, addDoc, getDocs, type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import { seedProducts, type Product } from './data/products'

export interface CartItem { id: string; color: number; qty: number; checked: boolean }

export const ORDER_STATUSES = ['Yangi', 'Tasdiqlandi', 'Yig‘ilmoqda', 'Yo‘lda', 'Yetkazildi', 'Bekor qilindi'] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

export interface Order {
  id: string
  date: string
  total: number
  items: (CartItem & { title: string; price: number })[]
  status: OrderStatus
  address: string
  payment: string
  customer: string
  phone: string
}

export interface LogEntry { id?: string; t: string; who: 'admin' | 'boshliq'; text: string }
export type Sync = 'connecting' | 'online' | 'offline' | 'denied' | 'demo'

/** Namuna rejimi (VITE_DEMO=1): serversiz, hamma ma'lumot shu qurilmada. Artefakt ko'rinishi uchun. */
export const DEMO = import.meta.env.VITE_DEMO === '1'

interface State {
  products: Product[]
  cart: CartItem[]
  favs: string[]
  dark: boolean
  myOrderIds: string[]
  myOrders: Order[]
  orders: Order[]
  recent: string[]
  city: string
  toast: string | null
  adminPass: string
  bossPass: string
  log: LogEntry[]
  sync: Sync
  addToCart: (id: string, color?: number) => void
  setQty: (id: string, color: number, qty: number) => void
  toggleCheck: (id: string, color: number) => void
  checkAll: (v: boolean) => void
  removeChecked: () => void
  toggleFav: (id: string) => void
  toggleDark: () => void
  addRecent: (q: string) => void
  clearRecent: () => void
  setCity: (c: string) => void
  placeOrder: (o: Pick<Order, 'total' | 'address' | 'payment' | 'customer' | 'phone'>) => Promise<string | null>
  showToast: (t: string) => void
  // Admin / Boshliq
  saveProduct: (p: Product, who?: LogEntry['who']) => Promise<boolean>
  deleteProduct: (id: string, who?: LogEntry['who']) => Promise<void>
  setOrderStatus: (id: string, status: OrderStatus, who?: LogEntry['who']) => Promise<void>
  setPasswords: (admin: string, boss: string) => Promise<void>
  resetCatalog: () => Promise<void>
  clearLog: () => Promise<void>
}

let toastTimer: ReturnType<typeof setTimeout> | undefined

const systemDark = () => {
  try {
    const t = document.documentElement.dataset.theme
    return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches
  } catch {
    return false
  }
}

/** Firestore `undefined` qiymatlarni qabul qilmaydi — ularni olib tashlaymiz. */
const clean = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

/** Firestore ichma-ich massivlarni qo'llamaydi: specs [[k, v]] → [{k, v}] ko'rinishida saqlanadi. */
const toDb = (p: Product) => clean({ ...p, specs: p.specs.map(([k, v]) => ({ k, v })) })
const fromDb = (d: Record<string, unknown>, id: string): Product => {
  const raw = (d.specs ?? []) as unknown[]
  const specs = raw.map((x) => (Array.isArray(x) ? x : [(x as { k: string }).k, (x as { v: string }).v])) as [string, string][]
  return { ...(d as unknown as Product), specs, id }
}

const isDenied = (e: unknown) => (e as { code?: string })?.code === 'permission-denied'

export const useStore = create<State>()(
  persist(
    (set, get) => {
      const fail = (e: unknown) => {
        console.error(e)
        if (isDenied(e)) set({ sync: 'denied' })
        get().showToast(isDenied(e) ? 'Serverga ruxsat yo‘q (Firestore qoidalari)' : 'Server bilan aloqa yo‘q, keyinroq urinib ko‘ring')
      }
      const addLog = (who: LogEntry['who'], text: string) =>
        DEMO ? set({ log: [{ t: new Date().toISOString(), who, text }, ...get().log].slice(0, 100) }) :
        addDoc(collection(db, 'logs'), { t: new Date().toISOString(), who, text }).catch(console.error)

      return {
        products: seedProducts,
        cart: [],
        favs: [],
        dark: systemDark(),
        myOrderIds: [],
        myOrders: [],
        orders: [],
        recent: ['muzlatgich', 'televizor 55', 'konditsioner'],
        city: 'Toshkent',
        toast: null,
        adminPass: '2019',
        bossPass: '1988',
        log: [],
        sync: DEMO ? 'demo' : 'connecting',
        addToCart: (id, color = 0) => {
          const cart = [...get().cart]
          const i = cart.findIndex((c) => c.id === id && c.color === color)
          if (i >= 0) cart[i] = { ...cart[i], qty: cart[i].qty + 1 }
          else cart.push({ id, color, qty: 1, checked: true })
          set({ cart })
          get().showToast('Savatga qo‘shildi')
        },
        setQty: (id, color, qty) =>
          set({ cart: get().cart.flatMap((c) => (c.id === id && c.color === color ? (qty <= 0 ? [] : [{ ...c, qty }]) : [c])) }),
        toggleCheck: (id, color) =>
          set({ cart: get().cart.map((c) => (c.id === id && c.color === color ? { ...c, checked: !c.checked } : c)) }),
        checkAll: (v) => set({ cart: get().cart.map((c) => ({ ...c, checked: v })) }),
        removeChecked: () => set({ cart: get().cart.filter((c) => !c.checked) }),
        toggleFav: (id) => {
          const has = get().favs.includes(id)
          set({ favs: has ? get().favs.filter((f) => f !== id) : [id, ...get().favs] })
          get().showToast(has ? 'Sevimlilardan olib tashlandi' : 'Sevimlilarga qo‘shildi')
        },
        toggleDark: () => set({ dark: !get().dark }),
        addRecent: (q) => {
          const t = q.trim().toLowerCase()
          if (!t) return
          set({ recent: [t, ...get().recent.filter((r) => r !== t)].slice(0, 8) })
        },
        clearRecent: () => set({ recent: [] }),
        setCity: (city) => set({ city }),

        placeOrder: async (o) => {
          const id = String(Math.floor(10_000_000 + Math.random() * 89_999_999))
          const products = get().products
          const items = get().cart.filter((c) => c.checked).flatMap((c) => {
            const p = products.find((x) => x.id === c.id)
            return p ? [{ ...c, title: p.title, price: p.price }] : []
          })
          const order: Order = { ...o, id, items, date: new Date().toISOString(), status: 'Yangi' }
          if (DEMO) {
            const sold = new Map<string, number>()
            items.forEach((i) => sold.set(i.id, (sold.get(i.id) ?? 0) + i.qty))
            set({
              orders: [order, ...get().orders],
              myOrders: [order, ...get().myOrders],
              cart: get().cart.filter((c) => !c.checked),
              products: products.map((p) => (sold.has(p.id) ? { ...p, stock: Math.max(0, p.stock - sold.get(p.id)!), orders: p.orders + sold.get(p.id)! } : p)),
            })
            return id
          }
          try {
            await setDoc(doc(db, 'orders', id), clean(order))
            // ombordagi qoldiq va sotuvlar sonini yangilash
            const sold = new Map<string, number>()
            items.forEach((i) => sold.set(i.id, (sold.get(i.id) ?? 0) + i.qty))
            const batch = writeBatch(db)
            sold.forEach((qty, pid) => batch.update(doc(db, 'products', pid), { stock: increment(-qty), orders: increment(qty) }))
            batch.commit().catch(console.error)
            set({ cart: get().cart.filter((c) => !c.checked), myOrderIds: [id, ...get().myOrderIds].slice(0, 30) })
            subscribeMyOrders()
            return id
          } catch (e) {
            fail(e)
            return null
          }
        },
        showToast: (t) => {
          clearTimeout(toastTimer)
          set({ toast: t })
          toastTimer = setTimeout(() => set({ toast: null }), 2200)
        },

        saveProduct: async (p, who = 'admin') => {
          const exists = get().products.some((x) => x.id === p.id)
          if (DEMO) {
            set({ products: exists ? get().products.map((x) => (x.id === p.id ? p : x)) : [p, ...get().products] })
            addLog(who, `${exists ? 'Tahrirlandi' : 'Qo‘shildi'}: ${p.title}`)
            get().showToast(exists ? 'Saqlandi' : 'Mahsulot qo‘shildi')
            return true
          }
          try {
            await setDoc(doc(db, 'products', p.id), toDb(p))
            addLog(who, `${exists ? 'Tahrirlandi' : 'Qo‘shildi'}: ${p.title}`)
            get().showToast(exists ? 'Saqlandi' : 'Mahsulot qo‘shildi')
            return true
          } catch (e) {
            fail(e)
            return false
          }
        },
        deleteProduct: async (id, who = 'admin') => {
          const p = get().products.find((x) => x.id === id)
          if (DEMO) {
            set({ products: get().products.filter((x) => x.id !== id), cart: get().cart.filter((c) => c.id !== id) })
            if (p) addLog(who, `O‘chirildi: ${p.title}`)
            get().showToast('Mahsulot o‘chirildi')
            return
          }
          try {
            await deleteDoc(doc(db, 'products', id))
            set({ cart: get().cart.filter((c) => c.id !== id) })
            if (p) addLog(who, `O‘chirildi: ${p.title}`)
            get().showToast('Mahsulot o‘chirildi')
          } catch (e) {
            fail(e)
          }
        },
        setOrderStatus: async (id, status, who = 'admin') => {
          if (DEMO) {
            const upd = (l: Order[]) => l.map((o) => (o.id === id ? { ...o, status } : o))
            set({ orders: upd(get().orders), myOrders: upd(get().myOrders) })
            addLog(who, `Buyurtma №${id} → ${status}`)
            return
          }
          try {
            await updateDoc(doc(db, 'orders', id), { status })
            addLog(who, `Buyurtma №${id} → ${status}`)
          } catch (e) {
            fail(e)
          }
        },
        setPasswords: async (adminPass, bossPass) => {
          if (DEMO) {
            set({ adminPass, bossPass })
            addLog('boshliq', 'Parollar o‘zgartirildi')
            get().showToast('Parollar yangilandi')
            return
          }
          try {
            await setDoc(doc(db, 'settings', 'main'), { adminPass, bossPass }, { merge: true })
            addLog('boshliq', 'Parollar o‘zgartirildi')
            get().showToast('Parollar yangilandi')
          } catch (e) {
            fail(e)
          }
        },
        resetCatalog: async () => {
          if (DEMO) {
            set({ products: seedProducts })
            addLog('boshliq', 'Katalog boshlang‘ich holatga qaytarildi')
            get().showToast('Katalog tiklandi')
            return
          }
          try {
            const snap = await getDocs(collection(db, 'products'))
            const batch = writeBatch(db)
            snap.forEach((d) => batch.delete(d.ref))
            seedProducts.forEach((p) => batch.set(doc(db, 'products', p.id), toDb(p)))
            await batch.commit()
            addLog('boshliq', 'Katalog boshlang‘ich holatga qaytarildi')
            get().showToast('Katalog tiklandi')
          } catch (e) {
            fail(e)
          }
        },
        clearLog: async () => {
          if (DEMO) { set({ log: [] }); return }
          try {
            const snap = await getDocs(collection(db, 'logs'))
            const batch = writeBatch(db)
            snap.forEach((d) => batch.delete(d.ref))
            await batch.commit()
          } catch (e) {
            fail(e)
          }
        },
      }
    },
    {
      name: 'avangard-store',
      version: 3,
      migrate: (old) => {
        const o = (old ?? {}) as Partial<State>
        return { cart: o.cart ?? [], favs: o.favs ?? [], dark: o.dark ?? false, recent: o.recent ?? [], city: o.city ?? 'Toshkent' } as unknown as State
      },
      // Mahsulotlar oflayn ko‘rinishi uchun keshlanadi; buyurtmalar va parollar faqat serverda
      partialize: (s) => ({
        products: s.products, cart: s.cart, favs: s.favs, dark: s.dark, myOrderIds: s.myOrderIds, recent: s.recent, city: s.city,
        ...(DEMO ? { orders: s.orders, myOrders: s.myOrders, log: s.log, adminPass: s.adminPass, bossPass: s.bossPass } : {}),
      }),
    },
  ),
)

/* ---------------- Server bilan sinxronlash ---------------- */

let started = false
let seeding = false

/** Ilova ochilganda: mahsulotlar va sozlamalarni real vaqtda tinglash. */
export function startSync() {
  if (started || DEMO) return
  started = true
  onSnapshot(
    collection(db, 'products'),
    { includeMetadataChanges: true },
    async (snap) => {
      if (snap.empty && !snap.metadata.fromCache) {
        // Birinchi ishga tushirish: bo‘sh bazaga boshlang‘ich katalogni yozamiz
        if (seeding) return
        seeding = true
        try {
          const batch = writeBatch(db)
          seedProducts.forEach((p) => batch.set(doc(db, 'products', p.id), toDb(p)))
          await batch.commit()
        } catch (e) {
          console.error(e)
          seeding = false
        }
        return
      }
      if (snap.empty) return
      const products = snap.docs.map((d) => fromDb(d.data(), d.id))
      // yangi qo‘shilganlar oldinda
      products.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
      useStore.setState({ products, sync: snap.metadata.fromCache ? 'offline' : 'online' })
    },
    (e) => useStore.setState({ sync: isDenied(e) ? 'denied' : 'offline' }),
  )
  onSnapshot(
    doc(db, 'settings', 'main'),
    (d) => {
      const s = d.data() as { adminPass?: string; bossPass?: string } | undefined
      useStore.setState({ adminPass: s?.adminPass ?? '2019', bossPass: s?.bossPass ?? '1988' })
    },
    console.error,
  )
  subscribeMyOrders()
}

let myOrdersUnsub: Unsubscribe | undefined
/** Mijozning o‘z buyurtmalari (shu qurilmadan berilganlar) holatini kuzatish. */
export function subscribeMyOrders() {
  if (DEMO) return
  myOrdersUnsub?.()
  const ids = useStore.getState().myOrderIds.slice(0, 30)
  if (!ids.length) return
  myOrdersUnsub = onSnapshot(
    query(collection(db, 'orders'), where(documentId(), 'in', ids)),
    (snap) => useStore.setState({ myOrders: snap.docs.map((d) => d.data() as Order).sort((a, b) => b.date.localeCompare(a.date)) }),
    console.error,
  )
}

/** Admin/Boshliq paneli ochiq turganda: barcha buyurtmalar va jurnal. */
export function subscribeStaff(): () => void {
  if (DEMO) return () => {}
  const u1 = onSnapshot(
    query(collection(db, 'orders'), orderBy('date', 'desc'), limit(500)),
    (snap) => useStore.setState({ orders: snap.docs.map((d) => d.data() as Order) }),
    (e) => isDenied(e) && useStore.setState({ sync: 'denied' }),
  )
  const u2 = onSnapshot(
    query(collection(db, 'logs'), orderBy('t', 'desc'), limit(100)),
    (snap) => useStore.setState({ log: snap.docs.map((d) => ({ ...(d.data() as LogEntry), id: d.id })) }),
    console.error,
  )
  return () => { u1(); u2() }
}

export const cartLines = (cart: CartItem[], products: Product[]) =>
  cart.flatMap((c) => {
    const p = products.find((x) => x.id === c.id)
    return p ? [{ ...c, p }] : []
  })

export const cartTotals = (cart: CartItem[], products: Product[]) => {
  const lines = cartLines(cart, products).filter((l) => l.checked)
  const sum = lines.reduce((s, l) => s + l.p.price * l.qty, 0)
  const old = lines.reduce((s, l) => s + (l.p.oldPrice ?? l.p.price) * l.qty, 0)
  const count = lines.reduce((s, l) => s + l.qty, 0)
  return { sum, old, saved: old - sum, count }
}
