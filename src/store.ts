import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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

export interface LogEntry { t: string; who: 'admin' | 'boshliq'; text: string }

interface State {
  products: Product[]
  cart: CartItem[]
  favs: string[]
  dark: boolean
  orders: Order[]
  recent: string[]
  city: string
  toast: string | null
  adminPass: string
  bossPass: string
  log: LogEntry[]
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
  placeOrder: (o: Pick<Order, 'total' | 'address' | 'payment' | 'customer' | 'phone'>) => string
  showToast: (t: string) => void
  // Admin
  saveProduct: (p: Product, who?: LogEntry['who']) => void
  deleteProduct: (id: string, who?: LogEntry['who']) => void
  setOrderStatus: (id: string, status: OrderStatus, who?: LogEntry['who']) => void
  // Boshliq
  setPasswords: (admin: string, boss: string) => void
  resetCatalog: () => void
  clearLog: () => void
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

export const useStore = create<State>()(
  persist(
    (set, get) => {
      const addLog = (who: LogEntry['who'], text: string) =>
        set({ log: [{ t: new Date().toISOString(), who, text }, ...get().log].slice(0, 200) })
      return {
        products: seedProducts,
        cart: [],
        favs: [],
        dark: systemDark(),
        orders: [],
        recent: ['muzlatgich', 'televizor 55', 'konditsioner'],
        city: 'Toshkent',
        toast: null,
        adminPass: '2019',
        bossPass: '1988',
        log: [],
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
        placeOrder: (o) => {
          const id = String(Math.floor(10_000_000 + Math.random() * 89_999_999))
          const products = get().products
          const items = get().cart.filter((c) => c.checked).flatMap((c) => {
            const p = products.find((x) => x.id === c.id)
            return p ? [{ ...c, title: p.title, price: p.price }] : []
          })
          // ombordagi qoldiqni kamaytirish
          const sold = new Map<string, number>()
          items.forEach((i) => sold.set(i.id, (sold.get(i.id) ?? 0) + i.qty))
          set({
            orders: [{ ...o, id, items, date: new Date().toISOString(), status: 'Yangi' }, ...get().orders],
            cart: get().cart.filter((c) => !c.checked),
            products: products.map((p) => (sold.has(p.id) ? { ...p, stock: Math.max(0, p.stock - sold.get(p.id)!), orders: p.orders + sold.get(p.id)! } : p)),
          })
          return id
        },
        showToast: (t) => {
          clearTimeout(toastTimer)
          set({ toast: t })
          toastTimer = setTimeout(() => set({ toast: null }), 1800)
        },
        saveProduct: (p, who = 'admin') => {
          const exists = get().products.some((x) => x.id === p.id)
          set({ products: exists ? get().products.map((x) => (x.id === p.id ? p : x)) : [p, ...get().products] })
          addLog(who, `${exists ? 'Tahrirlandi' : 'Qo‘shildi'}: ${p.title}`)
          get().showToast('Saqlandi')
        },
        deleteProduct: (id, who = 'admin') => {
          const p = get().products.find((x) => x.id === id)
          set({ products: get().products.filter((x) => x.id !== id), cart: get().cart.filter((c) => c.id !== id) })
          if (p) addLog(who, `O‘chirildi: ${p.title}`)
          get().showToast('Mahsulot o‘chirildi')
        },
        setOrderStatus: (id, status, who = 'admin') => {
          set({ orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)) })
          addLog(who, `Buyurtma №${id} → ${status}`)
        },
        setPasswords: (adminPass, bossPass) => {
          set({ adminPass, bossPass })
          addLog('boshliq', 'Parollar o‘zgartirildi')
          get().showToast('Parollar yangilandi')
        },
        resetCatalog: () => {
          set({ products: seedProducts })
          addLog('boshliq', 'Katalog boshlang‘ich holatga qaytarildi')
          get().showToast('Katalog tiklandi')
        },
        clearLog: () => set({ log: [] }),
      }
    },
    {
      name: 'avangard-store',
      version: 2,
      migrate: (old) => ({ ...(old as object), orders: [], products: seedProducts }) as unknown as State,
      partialize: ({ toast: _t, ...rest }) => rest,
    },
  ),
)

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
