import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getProduct } from './data/products'

export interface CartItem { id: string; color: number; qty: number; checked: boolean }
export interface Order { id: string; date: string; total: number; items: CartItem[]; months: number; status: string; address: string }

interface State {
  cart: CartItem[]
  favs: string[]
  dark: boolean
  orders: Order[]
  recent: string[]
  city: string
  toast: string | null
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
  placeOrder: (o: Omit<Order, 'id' | 'date' | 'status' | 'items'>) => string
  showToast: (t: string) => void
}

let toastTimer: ReturnType<typeof setTimeout> | undefined

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      favs: [],
      dark: (() => { try { const t = document.documentElement.dataset.theme; return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches } catch { return false } })(),
      orders: [],
      recent: ['muzlatgich', 'televizor 55', 'konditsioner'],
      city: 'Toshkent',
      toast: null,
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
        const items = get().cart.filter((c) => c.checked)
        set({
          orders: [{ ...o, id, items, date: new Date().toISOString(), status: 'Qabul qilindi' }, ...get().orders],
          cart: get().cart.filter((c) => !c.checked),
        })
        return id
      },
      showToast: (t) => {
        clearTimeout(toastTimer)
        set({ toast: t })
        toastTimer = setTimeout(() => set({ toast: null }), 1800)
      },
    }),
    {
      name: 'avangard-store',
      partialize: ({ toast: _t, ...rest }) => rest,
    },
  ),
)

export const cartLines = (cart: CartItem[]) =>
  cart.map((c) => ({ ...c, p: getProduct(c.id)! })).filter((x) => x.p)

export const cartTotals = (cart: CartItem[]) => {
  const lines = cartLines(cart).filter((l) => l.checked)
  const sum = lines.reduce((s, l) => s + l.p.price * l.qty, 0)
  const old = lines.reduce((s, l) => s + (l.p.oldPrice ?? l.p.price) * l.qty, 0)
  const count = lines.reduce((s, l) => s + l.qty, 0)
  return { sum, old, saved: old - sum, count }
}
