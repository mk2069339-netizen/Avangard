import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { changeOwnPassword, isDemo, staffSignIn, staffSignOut, useSession, ADMIN_EMAIL } from '../auth'
import {
  ChevronLeft, Delete, LogOut, Package, Phone, Plus, Search, ShieldCheck, Trash2, X, Eye, EyeOff,
  Crown, ImagePlus, Cloud, CloudOff, TrendingUp, ShoppingBag, Receipt, CircleCheck, AlertTriangle, KeyRound, RotateCcw, History, Boxes,
} from 'lucide-react'
import { categories, discount, type ArtKind, type Product } from '../data/products'
import { ORDER_STATUSES, orderNo, subscribeStaff, useStore, type Order, type OrderStatus } from '../store'
import { ProductImage } from '../components/ProductArt'
import { tintFor } from '../components/ProductCard'
import { Mark, PrimaryButton } from '../components/ui'
import { som } from '../format'


/** 5 marta ketma-ket bosishni sanaydi (har bosish orasida 1.5 soniyadan kam). */
export function useTapUnlock(times: number, onUnlock: () => void) {
  const n = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  return () => {
    n.current += 1
    clearTimeout(timer.current)
    if (n.current >= times) {
      n.current = 0
      onUnlock()
      return
    }
    timer.current = setTimeout(() => (n.current = 0), 1500)
  }
}

const statusColor: Record<OrderStatus, string> = {
  Yangi: 'bg-brand-600 text-white',
  Tasdiqlandi: 'bg-brand-100 text-brand-900',
  'Yig‘ilmoqda': 'bg-accent-400 text-black',
  'Yo‘lda': 'bg-[#2fb3c6] text-white',
  Yetkazildi: 'bg-ok text-white',
  'Bekor qilindi': 'bg-[#e5322f] text-white',
}

/* ---------- Kirish oynasi ---------- */
function Gate({ role }: { role: 'admin' | 'boss' }) {
  const setRole = useSession((s) => s.setRole)
  const ready = useSession((s) => s.ready)
  if (isDemo) return <PinGate role={role} onOk={() => setRole(role)} />
  if (!ready) return <div className="grid min-h-dvh place-items-center text-muted">Yuklanmoqda…</div>
  return <PasswordGate role={role} />
}

function PasswordGate({ role }: { role: 'admin' | 'boss' }) {
  const nav = useNavigate()
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const dark = role === 'boss'
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setErr('')
    const res = await staffSignIn(role, pw)
    setBusy(false)
    if (res) { setErr(res); setPw('') }
  }
  return (
    <div className={`flex min-h-dvh flex-col items-center px-6 pt-6 pb-10 ${dark ? 'bg-[#0f0d16] text-white' : 'bg-card'}`}>
      <button onClick={() => nav('/')} className="self-start grid size-10 place-items-center rounded-full active:bg-chip" aria-label="Orqaga"><ChevronLeft /></button>
      <div className={`mt-6 grid size-20 place-items-center rounded-3xl ${dark ? 'bg-accent-400 text-black' : 'bg-brand-600 text-white'}`}>
        {dark ? <Crown size={38} /> : <ShieldCheck size={38} />}
      </div>
      <h1 className="mt-5 text-2xl font-extrabold">{dark ? 'Boshliq paneli' : 'Admin paneli'}</h1>
      <p className={`mt-1 text-sm ${dark ? 'text-white/60' : 'text-muted'}`}>Parolingizni kiriting</p>
      <form onSubmit={submit} className={`mt-8 w-full max-w-[320px] ${err ? 'animate-[shake_.35s]' : ''}`}>
        <label className={`flex h-14 items-center gap-2 rounded-2xl px-4 ${dark ? 'bg-white/8' : 'bg-chip'} focus-within:ring-2 ${dark ? 'focus-within:ring-accent-400' : 'focus-within:ring-brand-600'}`}>
          <KeyRound size={20} className="opacity-60" />
          <input
            id={`pw-${role}`} type={show ? 'text' : 'password'} autoComplete="current-password" autoFocus
            value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Parol"
            className="h-full min-w-0 flex-1 bg-transparent text-[17px] outline-none placeholder:opacity-50"
          />
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Yashirish' : 'Ko‘rsatish'} className="opacity-60">{show ? <EyeOff size={20} /> : <Eye size={20} />}</button>
        </label>
        <p className="mt-3 min-h-5 text-center text-sm font-medium text-[#e5322f]">{err}</p>
        <button disabled={!pw || busy} className={`mt-3 h-13 w-full rounded-2xl py-3.5 text-[16px] font-bold transition active:scale-[.98] disabled:opacity-40 ${dark ? 'bg-accent-400 text-black' : 'bg-brand-600 text-white'}`}>
          {busy ? 'Tekshirilmoqda…' : 'Kirish'}
        </button>
      </form>
    </div>
  )
}

function PinGate({ role, onOk }: { role: 'admin' | 'boss'; onOk: () => void }) {
  const nav = useNavigate()
  const pass = useStore((s) => (role === 'admin' ? s.adminPass : s.bossPass))
  const [pin, setPin] = useState('')
  const [err, setErr] = useState(false)
  const len = pass.length
  const press = (d: string) => {
    if (err) setErr(false)
    const next = (pin + d).slice(0, len)
    setPin(next)
    if (next.length === len) {
      if (next === pass) setTimeout(onOk, 120)
      else setTimeout(() => { setErr(true); setPin('') }, 150)
    }
  }
  const dark = role === 'boss'
  return (
    <div className={`flex min-h-dvh flex-col items-center px-6 pt-6 pb-10 ${dark ? 'bg-[#0f0d16] text-white' : 'bg-card'}`}>
      <button onClick={() => nav('/')} className="self-start grid size-10 place-items-center rounded-full active:bg-chip" aria-label="Orqaga"><ChevronLeft /></button>
      <div className={`mt-6 grid size-20 place-items-center rounded-3xl ${dark ? 'bg-accent-400 text-black' : 'bg-brand-600 text-white'}`}>
        {dark ? <Crown size={38} /> : <ShieldCheck size={38} />}
      </div>
      <h1 className="mt-5 text-2xl font-extrabold">{dark ? 'Boshliq paneli' : 'Admin paneli'}</h1>
      <p className={`mt-1 text-sm ${dark ? 'text-white/60' : 'text-muted'}`}>Parolni kiriting</p>
      <div className={`mt-8 flex gap-4 ${err ? 'animate-[shake_.35s]' : ''}`}>
        {Array.from({ length: len }).map((_, i) => (
          <span key={i} className={`size-4 rounded-full transition ${err ? 'bg-[#e5322f]' : i < pin.length ? (dark ? 'bg-accent-400' : 'bg-brand-600') : dark ? 'bg-white/15' : 'bg-chip'}`} />
        ))}
      </div>
      <p className="mt-3 h-5 text-sm font-medium text-[#e5322f]">{err ? 'Parol noto‘g‘ri' : ''}</p>
      <div className="mt-6 grid w-full max-w-[300px] grid-cols-3 gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((k) =>
          k === '' ? <span key="e" /> : (
            <button
              key={k}
              onClick={() => (k === 'del' ? setPin(pin.slice(0, -1)) : press(k))}
              className={`grid h-16 place-items-center rounded-2xl text-2xl font-semibold transition active:scale-95 ${dark ? 'bg-white/8 active:bg-white/15' : 'bg-chip active:bg-brand-100'}`}
              aria-label={k === 'del' ? 'O‘chirish' : k}
            >
              {k === 'del' ? <Delete size={24} /> : k}
            </button>
          ),
        )}
      </div>
    </div>
  )
}

/* ======================= ADMIN PANELI ======================= */
export function AdminPanel() {
  const nav = useNavigate()
  const role = useSession((s) => s.role)
  const boss = role === 'boss'
  const [tab, setTab] = useState<'orders' | 'products'>('orders')
  const tapIcon = useTapUnlock(5, () => nav('/boss'))
  const orders = useStore((s) => s.orders)
  const fresh = orders.filter((o) => o.status === 'Yangi').length
  const unlocked = role === 'admin' || boss
  useEffect(() => (unlocked ? subscribeStaff() : undefined), [unlocked])

  if (!unlocked) return <Gate role="admin" />

  return (
    <div className="min-h-dvh pb-10">
      <header className="sticky top-0 z-30 border-b border-line bg-card/95 backdrop-blur-xl">
        <div className="flex h-14 items-center gap-2 px-2">
          <button onClick={() => nav('/')} className="grid size-10 place-items-center rounded-full active:bg-chip" aria-label="Do‘konga qaytish"><ChevronLeft /></button>
          {/* Admin belgisi: 5 marta bosilsa Boshliq paneli ochiladi */}
          <button onClick={tapIcon} className="grid size-9 place-items-center rounded-xl bg-brand-600 text-white select-none" aria-label="Admin">
            <ShieldCheck size={20} />
          </button>
          <div className="flex-1 leading-tight">
            <div className="text-[16px] font-bold">Admin paneli</div>
            <SyncBadge />
          </div>
          <button onClick={async () => { await staffSignOut(); nav('/') }} className="flex items-center gap-1 rounded-full bg-chip px-3 py-1.5 text-[13px] font-semibold" aria-label="Chiqish">
            <LogOut size={15} /> Chiqish
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1 px-3 pb-2.5">
          {([['orders', 'Buyurtmalar', fresh], ['products', 'Mahsulotlar', 0]] as const).map(([k, l, n]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-[14px] font-semibold transition ${tab === k ? 'bg-brand-600 text-white' : 'bg-chip'}`}>
              {l} {n > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#e5322f] px-1 text-[11px] text-white">{n}</span>}
            </button>
          ))}
        </div>
      </header>
      {tab === 'orders' ? <OrdersAdmin /> : <ProductsAdmin who={boss ? 'boshliq' : 'admin'} />}
    </div>
  )
}

function OrdersAdmin({ who = 'admin' as 'admin' | 'boshliq' }) {
  const orders = useStore((s) => s.orders)
  const setOrderStatus = useStore((s) => s.setOrderStatus)
  const [filter, setFilter] = useState<OrderStatus | 'Hammasi'>('Hammasi')
  const list = filter === 'Hammasi' ? orders : orders.filter((o) => o.status === filter)
  return (
    <div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 py-3">
        {(['Hammasi', ...ORDER_STATUSES] as const).map((s) => {
          const n = s === 'Hammasi' ? orders.length : orders.filter((o) => o.status === s).length
          return (
            <button key={s} onClick={() => setFilter(s)} className={`shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold ${filter === s ? 'bg-ink text-card' : 'bg-card'}`}>
              {s} <span className="opacity-60">{n}</span>
            </button>
          )
        })}
      </div>
      {!list.length ? (
        <div className="px-8 pt-16 text-center">
          <Package size={44} className="mx-auto text-muted" />
          <p className="mt-3 font-semibold">Buyurtmalar yo‘q</p>
          <p className="mt-1 text-sm text-muted">Mijozlar buyurtma berganda shu yerda paydo bo‘ladi</p>
        </div>
      ) : (
        <div className="space-y-2 px-2">
          {list.map((o) => <OrderCard key={o.id} o={o} onStatus={(s) => setOrderStatus(o.id, s, who)} />)}
        </div>
      )}
    </div>
  )
}

function OrderCard({ o, onStatus }: { o: Order; onStatus: (s: OrderStatus) => void }) {
  return (
    <div className="rounded-3xl bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-bold">№ {orderNo(o.id)}</div>
          <div className="text-[12px] text-muted">{new Date(o.date).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })}</div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusColor[o.status]}`}>{o.status}</span>
      </div>
      <div className="mt-3 space-y-1 rounded-2xl bg-chip p-3 text-[13px]">
        <div className="font-semibold">{o.customer || '—'}</div>
        <div className="flex items-center gap-1.5 text-muted"><Phone size={13} /> <span className="select-all">{o.phone || '—'}</span></div>
        <div className="text-muted">{o.address}</div>
      </div>
      <ul className="mt-3 space-y-1 text-[13px]">
        {o.items.map((i) => (
          <li key={i.id + i.color} className="flex justify-between gap-2">
            <span className="line-clamp-1">{i.title} <span className="text-muted">× {i.qty}</span></span>
            <span className="shrink-0 font-medium">{som(i.price * i.qty)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex justify-between border-t border-line pt-2 text-[14px]">
        <span className="text-muted">{o.payment}</span>
        <b>{som(o.total)}</b>
      </div>
      <div className="no-scrollbar -mx-4 mt-3 flex gap-1.5 overflow-x-auto px-4">
        {ORDER_STATUSES.map((s) => (
          <button key={s} onClick={() => onStatus(s)} disabled={s === o.status} className={`shrink-0 rounded-xl px-3 py-2 text-[12.5px] font-semibold transition ${s === o.status ? statusColor[s] : 'bg-chip active:scale-95'}`}>
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

function ProductsAdmin({ who }: { who: 'admin' | 'boshliq' }) {
  const products = useStore((s) => s.products)
  const saveProduct = useStore((s) => s.saveProduct)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [edit, setEdit] = useState<Product | null>(null)
  const list = products.filter((p) => (cat === 'all' || p.cat === cat) && p.title.toLowerCase().includes(q.toLowerCase()))

  const blank = (): Product => ({
    id: 'p' + Date.now().toString(36), createdAt: Date.now(), title: '', brand: '', cat: 'fridge', price: 0, art: 'fridge',
    rating: 5, reviews: 0, orders: 0, colors: [{ name: 'Oq', hex: '#F7F7F9' }], specs: [], desc: '', stock: 10, badges: ['new'],
  })

  return (
    <div>
      <div className="flex gap-2 px-3 pt-3">
        <label className="flex h-11 flex-1 items-center gap-2 rounded-2xl bg-card px-3">
          <Search size={18} className="text-muted" />
          <input id="admin-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Mahsulot qidirish" className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none" />
        </label>
        <button onClick={() => setEdit(blank())} className="flex h-11 items-center gap-1 rounded-2xl bg-brand-600 px-4 text-[14px] font-semibold text-white"><Plus size={18} /> Yangi</button>
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 py-3">
        {[{ id: 'all', name: 'Hammasi' }, ...categories].map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)} className={`shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold ${cat === c.id ? 'bg-ink text-card' : 'bg-card'}`}>{c.name}</button>
        ))}
      </div>
      <div className="mx-2 divide-y divide-[var(--line)] rounded-3xl bg-card">
        {list.map((p) => (
          <button key={p.id} onClick={() => setEdit(p)} className={`flex w-full items-center gap-3 p-3 text-left ${p.hidden ? 'opacity-50' : ''}`}>
            <span className="grid size-14 shrink-0 place-items-center rounded-xl" style={{ background: tintFor(p.cat) }}>
              <ProductImage p={p} className="size-12" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="line-clamp-1 text-[14px] font-medium">{p.title || 'Nomsiz'}</span>
              <span className="block text-[14px] font-bold">{som(p.price)} {discount(p) > 0 && <span className="text-xs font-semibold text-[#e5322f]">−{discount(p)}%</span>}</span>
              <span className={`text-[12px] ${p.stock <= 5 ? 'font-semibold text-[#e5322f]' : 'text-muted'}`}>Omborda: {p.stock} dona{p.hidden ? ' · yashirin' : ''}</span>
            </span>
          </button>
        ))}
      </div>
      {edit && <ProductEditor initial={edit} onClose={() => setEdit(null)} onSave={async (p) => { if (await saveProduct(p, who)) setEdit(null) }} who={who} />}
    </div>
  )
}

const artFor: Record<string, ArtKind> = {
  fridge: 'fridge', washer: 'washer', tv: 'tv', ac: 'ac', vacuum: 'vacuum', kitchen: 'microwave', stove: 'stove',
  small: 'kettle', phone: 'phone', laptop: 'laptop', climate: 'heater', dish: 'dishwasher',
}

function ProductEditor({ initial, onClose, onSave, who }: { initial: Product; onClose: () => void; onSave: (p: Product) => Promise<void>; who: 'admin' | 'boshliq' }) {
  const deleteProduct = useStore((s) => s.deleteProduct)
  const isNew = !useStore.getState().products.some((x) => x.id === initial.id)
  const [p, setP] = useState<Product>(initial)
  const [confirmDel, setConfirmDel] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imgErr, setImgErr] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const up = (patch: Partial<Product>) => setP({ ...p, ...patch })
  const valid = p.title.trim().length > 2 && p.price > 0 && (!p.oldPrice || p.oldPrice > p.price)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div className="animate-sheet pb-safe max-h-[92dvh] w-full max-w-[520px] overflow-y-auto rounded-t-3xl bg-card px-4 pt-2" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold">{isNew ? 'Yangi mahsulot' : 'Mahsulotni tahrirlash'}</h3>
          <button onClick={onClose} className="grid size-9 place-items-center rounded-full bg-chip" aria-label="Yopish"><X size={18} /></button>
        </div>

        <div className="relative mb-1 grid h-40 place-items-center rounded-2xl" style={{ background: tintFor(p.cat) }}>
          <ProductImage p={p} className="size-32" />
          <div className="absolute right-2 bottom-2 flex gap-1.5">
            {p.image && <button onClick={() => up({ image: undefined })} className="flex h-9 items-center gap-1 rounded-xl bg-white/90 px-3 text-[13px] font-semibold text-[#e5322f] shadow"><Trash2 size={15} /> Rasm</button>}
            <button onClick={() => fileRef.current?.click()} className="flex h-9 items-center gap-1 rounded-xl bg-white/90 px-3 text-[13px] font-semibold text-black shadow"><ImagePlus size={16} /> {p.image ? 'Almashtirish' : 'Rasm yuklash'}</button>
          </div>
          <input
            ref={fileRef} id="pe-image" type="file" accept="image/*" className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0]
              e.target.value = ''
              if (!f) return
              setImgErr('')
              try { up({ image: await compressImage(f) }) } catch { setImgErr('Rasmni o‘qib bo‘lmadi, boshqa fayl tanlang') }
            }}
          />
        </div>
        <p className="mb-3 text-[11.5px] text-muted">{imgErr ? <span className="text-[#e5322f]">{imgErr}</span> : 'Rasm yuklanmasa, kategoriya illyustratsiyasi ko‘rsatiladi'}</p>

        <F label="Nomi"><input id="pe-title" value={p.title} onChange={(e) => up({ title: e.target.value })} placeholder="Masalan: Muzlatgich Artel 350 L" className={inp} /></F>
        <div className="grid grid-cols-2 gap-2">
          <F label="Brend"><input id="pe-brand" value={p.brand} onChange={(e) => up({ brand: e.target.value })} placeholder="Artel" className={inp} /></F>
          <F label="Kategoriya">
            <select id="pe-cat" value={p.cat} onChange={(e) => up({ cat: e.target.value, art: artFor[e.target.value] ?? p.art })} className={inp}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </F>
          <F label="Narx, $"><input id="pe-price" type="number" step="0.01" min="0" inputMode="decimal" value={p.price || ''} onChange={(e) => up({ price: Math.max(0, +e.target.value || 0) })} placeholder="0" className={inp} /></F>
          <F label="Eski narx (chegirma)"><input id="pe-old" type="number" step="0.01" min="0" inputMode="decimal" value={p.oldPrice || ''} onChange={(e) => up({ oldPrice: +e.target.value || undefined })} placeholder="ixtiyoriy" className={inp} /></F>
          <F label="Omborda, dona"><input id="pe-stock" inputMode="numeric" value={p.stock} onChange={(e) => up({ stock: +e.target.value.replace(/\D/g, '') })} className={inp} /></F>
          <F label="Chegirma">
            <div className={`${inp} flex items-center font-semibold ${discount(p) > 0 ? 'text-[#e5322f]' : 'text-muted'}`}>{discount(p) > 0 ? `−${discount(p)}%` : 'yo‘q'}</div>
          </F>
        </div>
        {p.oldPrice !== undefined && p.oldPrice > 0 && p.oldPrice <= p.price && <p className="-mt-1 mb-2 text-[12px] text-[#e5322f]">Eski narx joriy narxdan katta bo‘lishi kerak</p>}
        <F label="Tavsif"><textarea id="pe-desc" value={p.desc} onChange={(e) => up({ desc: e.target.value })} rows={3} className={`${inp} h-auto py-2.5`} /></F>

        <button onClick={() => up({ hidden: !p.hidden })} className="mb-3 flex w-full items-center gap-3 rounded-2xl bg-chip px-3 py-3 text-left">
          {p.hidden ? <EyeOff size={20} /> : <Eye size={20} />}
          <span className="flex-1 text-[14px] font-medium">{p.hidden ? 'Do‘konda yashirin' : 'Do‘konda ko‘rinadi'}</span>
          <span className={`relative h-7 w-12 rounded-full transition ${!p.hidden ? 'bg-brand-600' : 'bg-gray-300'}`}>
            <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${!p.hidden ? 'left-6' : 'left-1'}`} />
          </span>
        </button>

        <div className="flex gap-2 pb-4">
          {!isNew && (
            confirmDel ? (
              <button onClick={() => { deleteProduct(p.id, who); onClose() }} className="h-12 flex-1 rounded-2xl bg-[#e5322f] font-semibold text-white">Ha, o‘chirish</button>
            ) : (
              <button onClick={() => setConfirmDel(true)} className="grid size-12 place-items-center rounded-2xl bg-[#e5322f]/10 text-[#e5322f]" aria-label="O‘chirish"><Trash2 size={20} /></button>
            )
          )}
          {!confirmDel && <PrimaryButton disabled={!valid || saving} onClick={async () => { setSaving(true); await onSave({ ...p, title: p.title.trim(), brand: p.brand.trim() || 'Avangard' }); setSaving(false) }} className="flex-1">{saving ? 'Saqlanmoqda…' : isNew ? 'Qo‘shish' : 'Saqlash'}</PrimaryButton>}
          {confirmDel && <button onClick={() => setConfirmDel(false)} className="h-12 flex-1 rounded-2xl bg-chip font-semibold">Bekor</button>}
        </div>
      </div>
    </div>
  )
}

/** Rasmni 800px gacha kichraytirib, JPEG (≈100 KB) data URL qiladi — Firestore hujjatiga sig‘ishi uchun. */
function compressImage(file: File, max = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * k)
      c.height = Math.round(img.height * k)
      const ctx = c.getContext('2d')!
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, c.width, c.height)
      ctx.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      let q = 0.82
      let out = c.toDataURL('image/jpeg', q)
      while (out.length > 700_000 && q > 0.4) { q -= 0.1; out = c.toDataURL('image/jpeg', q) }
      resolve(out)
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('bad image')) }
    img.src = url
  })
}

function SyncBadge({ light }: { light?: boolean }) {
  const sync = useStore((s) => s.sync)
  const map = {
    online: ['Server bilan ulangan', 'bg-ok'],
    connecting: ['Serverga ulanmoqda…', 'bg-accent-400'],
    offline: ['Oflayn — o‘zgarishlar keyin yuboriladi', 'bg-accent-400'],
    denied: ['Serverga ruxsat yo‘q — qoidalarni sozlang', 'bg-[#e5322f]'],
    demo: ['Namuna rejimi — ma’lumotlar shu qurilmada', 'bg-accent-400'],
  } as const
  const [t, c] = map[sync]
  return (
    <div className={`flex items-center gap-1.5 text-[11.5px] ${light ? 'text-white/75' : 'text-muted'}`}>
      {sync === 'online' ? <Cloud size={12} /> : <CloudOff size={12} />}
      <span className={`size-1.5 rounded-full ${c}`} /> {t}
    </div>
  )
}

const inp = 'h-11 w-full rounded-xl bg-chip px-3 text-[15px] outline-none focus:ring-2 focus:ring-brand-600'
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-2 block">
      <span className="mb-1 block text-[12px] font-medium text-muted">{label}</span>
      {children}
    </label>
  )
}

/* ======================= BOSHLIQ PANELI ======================= */
export function BossPanel() {
  const nav = useNavigate()
  const boss = useSession((s) => s.role) === 'boss'
  const [tab, setTab] = useState<'stats' | 'orders' | 'products' | 'settings'>('stats')
  useEffect(() => (boss ? subscribeStaff() : undefined), [boss])
  if (!boss) return <Gate role="boss" />

  return (
    <div className="min-h-dvh pb-10">
      <header className="bg-gradient-to-br from-[#0f0d16] via-brand-900 to-brand-700 px-3 pt-2 pb-4 text-white">
        <div className="flex h-12 items-center gap-2">
          <button onClick={() => nav('/admin')} className="grid size-10 place-items-center rounded-full active:bg-white/10" aria-label="Orqaga"><ChevronLeft /></button>
          <span className="grid size-9 place-items-center rounded-xl bg-accent-400 text-black"><Crown size={20} /></span>
          <div className="flex-1 leading-tight">
            <div className="text-[16px] font-bold">Boshliq paneli</div>
            <SyncBadge light />
          </div>
          <button onClick={async () => { await staffSignOut(); nav('/') }} className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-[13px] font-semibold"><LogOut size={15} /> Chiqish</button>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-1 rounded-2xl bg-white/10 p-1">
          {([['stats', 'Hisobot'], ['orders', 'Buyurtma'], ['products', 'Mahsulot'], ['settings', 'Sozlama']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`rounded-xl py-2 text-[12.5px] font-semibold transition ${tab === k ? 'bg-white text-black' : 'text-white/80'}`}>{l}</button>
          ))}
        </div>
      </header>
      {tab === 'stats' && <BossStats />}
      {tab === 'orders' && <OrdersAdmin who="boshliq" />}
      {tab === 'products' && <ProductsAdmin who="boshliq" />}
      {tab === 'settings' && <BossSettings />}
    </div>
  )
}

function BossStats() {
  const orders = useStore((s) => s.orders)
  const products = useStore((s) => s.products)
  const s = useMemo(() => {
    const valid = orders.filter((o) => o.status !== 'Bekor qilindi')
    const revenue = valid.reduce((a, o) => a + o.total, 0)
    const delivered = orders.filter((o) => o.status === 'Yetkazildi')
    const today = new Date().toDateString()
    const todayRev = valid.filter((o) => new Date(o.date).toDateString() === today).reduce((a, o) => a + o.total, 0)
    const byProduct = new Map<string, { title: string; qty: number; sum: number }>()
    const byCat = new Map<string, number>()
    valid.forEach((o) => o.items.forEach((i) => {
      const cur = byProduct.get(i.id) ?? { title: i.title, qty: 0, sum: 0 }
      byProduct.set(i.id, { ...cur, qty: cur.qty + i.qty, sum: cur.sum + i.price * i.qty })
      const cat = products.find((p) => p.id === i.id)?.cat ?? '—'
      byCat.set(cat, (byCat.get(cat) ?? 0) + i.price * i.qty)
    }))
    const top = [...byProduct.values()].sort((a, b) => b.sum - a.sum).slice(0, 5)
    const cats = [...byCat.entries()].sort((a, b) => b[1] - a[1]).map(([id, v]) => ({ name: categories.find((c) => c.id === id)?.name ?? id, v }))
    const stockValue = products.reduce((a, p) => a + p.price * p.stock, 0)
    const low = products.filter((p) => p.stock <= 5).sort((a, b) => a.stock - b.stock)
    const statuses = ORDER_STATUSES.map((st) => ({ st, n: orders.filter((o) => o.status === st).length }))
    return { revenue, todayRev, count: valid.length, avg: valid.length ? revenue / valid.length : 0, delivered: delivered.length, top, cats, stockValue, low, statuses }
  }, [orders, products])

  const maxCat = Math.max(1, ...s.cats.map((c) => c.v))
  const maxTop = Math.max(1, ...s.top.map((t) => t.sum))

  return (
    <div className="px-2 pt-3">
      <div className="grid grid-cols-2 gap-2">
        <Tile icon={<TrendingUp size={18} />} label="Jami tushum" value={som(s.revenue)} accent />
        <Tile icon={<Receipt size={18} />} label="Bugungi tushum" value={som(s.todayRev)} />
        <Tile icon={<ShoppingBag size={18} />} label="Buyurtmalar" value={String(s.count)} sub={`${s.delivered} ta yetkazildi`} />
        <Tile icon={<CircleCheck size={18} />} label="O‘rtacha chek" value={som(s.avg)} />
      </div>

      <Card title="Buyurtmalar holati">
        <div className="grid grid-cols-3 gap-2">
          {s.statuses.map(({ st, n }) => (
            <div key={st} className="rounded-2xl bg-chip p-2.5">
              <div className="text-[20px] font-extrabold tabular-nums">{n}</div>
              <div className="flex items-center gap-1 text-[11.5px] text-muted"><span className={`size-2 rounded-full ${statusColor[st].split(' ')[0]}`} />{st}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Eng ko‘p sotilgan mahsulotlar">
        {s.top.length ? s.top.map((t) => (
          <div key={t.title} className="py-1.5">
            <div className="flex justify-between gap-2 text-[13px]"><span className="line-clamp-1">{t.title} <span className="text-muted">× {t.qty}</span></span><b className="shrink-0 tabular-nums">{som(t.sum)}</b></div>
            <div className="mt-1 h-2 rounded-full bg-chip"><div className="h-full rounded-full bg-brand-600" style={{ width: `${(t.sum / maxTop) * 100}%` }} /></div>
          </div>
        )) : <Muted>Hali sotuvlar yo‘q</Muted>}
      </Card>

      <Card title="Kategoriyalar bo‘yicha tushum">
        {s.cats.length ? s.cats.map((c) => (
          <div key={c.name} className="py-1.5">
            <div className="flex justify-between text-[13px]"><span>{c.name}</span><b className="tabular-nums">{som(c.v)}</b></div>
            <div className="mt-1 h-2 rounded-full bg-chip"><div className="h-full rounded-full bg-accent-500" style={{ width: `${(c.v / maxCat) * 100}%` }} /></div>
          </div>
        )) : <Muted>Hali sotuvlar yo‘q</Muted>}
      </Card>

      <Card title="Ombor">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-chip p-3"><Boxes size={18} className="text-brand-600 dark:text-brand-200" /><div className="mt-1 text-[15px] font-extrabold">{som(s.stockValue)}</div><div className="text-[12px] text-muted">Ombor qiymati</div></div>
          <div className="rounded-2xl bg-chip p-3"><Package size={18} className="text-brand-600 dark:text-brand-200" /><div className="mt-1 text-[15px] font-extrabold">{products.length} ta</div><div className="text-[12px] text-muted">Mahsulot turi</div></div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold"><AlertTriangle size={16} className="text-[#e5322f]" /> Kam qolganlar (5 dona va kam)</div>
        {s.low.length ? s.low.map((p) => (
          <div key={p.id} className="flex justify-between gap-2 py-1.5 text-[13px]"><span className="line-clamp-1">{p.title}</span><b className="shrink-0 text-[#e5322f]">{p.stock} dona</b></div>
        )) : <Muted>Hamma mahsulot yetarli</Muted>}
      </Card>
      <p className="px-4 pt-3 text-center text-[11.5px] text-muted">Hisobot serverdagi barcha buyurtmalar asosida (oxirgi 500 ta).</p>
    </div>
  )
}

function OwnPassword() {
  const [cur, setCur] = useState('')
  const [next, setNext] = useState('')
  const [next2, setNext2] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const ok = cur.length > 0 && next.length >= 6 && next === next2
  return (
    <Card title={<span className="flex items-center gap-2"><KeyRound size={18} /> Parolni o‘zgartirish</span>}>
      <F label="Hozirgi parol"><input id="op-cur" type="password" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} className={inp} /></F>
      <F label="Yangi parol (kamida 6 belgi)"><input id="op-new" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className={inp} /></F>
      <F label="Yangi parolni takrorlang"><input id="op-new2" type="password" autoComplete="new-password" value={next2} onChange={(e) => setNext2(e.target.value)} className={inp} /></F>
      {next2 && next !== next2 && <p className="mb-2 text-[12px] text-[#e5322f]">Parollar bir xil emas</p>}
      {msg && <p className={`mb-2 text-[13px] font-medium ${msg.ok ? 'text-ok' : 'text-[#e5322f]'}`}>{msg.t}</p>}
      <PrimaryButton disabled={!ok || busy} onClick={async () => {
        setBusy(true); setMsg(null)
        const err = await changeOwnPassword(cur, next)
        setBusy(false)
        if (err) setMsg({ ok: false, t: err })
        else { setMsg({ ok: true, t: 'Parol o‘zgartirildi' }); setCur(''); setNext(''); setNext2('') }
      }}>{busy ? 'Saqlanmoqda…' : 'Parolni saqlash'}</PrimaryButton>
      <p className="mt-3 text-[12px] text-muted">Bu Boshliq hisobining paroli. Admin parolini ({ADMIN_EMAIL}) Firebase Console → Authentication bo‘limida almashtirasiz.</p>
    </Card>
  )
}

function BossSettings() {
  const { adminPass, bossPass, setPasswords, resetCatalog, log, clearLog } = useStore()
  const [a, setA] = useState(adminPass)
  const [b, setB] = useState(bossPass)
  const [show, setShow] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const ok = /^\d{4,8}$/.test(a) && /^\d{4,8}$/.test(b) && a !== b
  return (
    <div className="px-2 pt-3">
      {!isDemo ? <OwnPassword /> : <Card title={<span className="flex items-center gap-2"><KeyRound size={18} /> Parollar</span>}>
        <F label="Admin paneli paroli"><input id="bs-admin" type={show ? 'text' : 'password'} inputMode="numeric" value={a} onChange={(e) => setA(e.target.value.replace(/\D/g, '').slice(0, 8))} className={inp} /></F>
        <F label="Boshliq paneli paroli"><input id="bs-boss" type={show ? 'text' : 'password'} inputMode="numeric" value={b} onChange={(e) => setB(e.target.value.replace(/\D/g, '').slice(0, 8))} className={inp} /></F>
        <button onClick={() => setShow(!show)} className="mb-3 flex items-center gap-1.5 text-[13px] font-semibold text-brand-600 dark:text-brand-200">{show ? <EyeOff size={15} /> : <Eye size={15} />} {show ? 'Yashirish' : 'Ko‘rsatish'}</button>
        {!ok && <p className="mb-2 text-[12px] text-[#e5322f]">Parollar 4–8 raqamdan iborat va bir-biridan farqli bo‘lsin</p>}
        <PrimaryButton disabled={!ok || (a === adminPass && b === bossPass)} onClick={() => setPasswords(a, b)}>Parollarni saqlash</PrimaryButton>
      </Card>}

      <Card title={<span className="flex items-center gap-2"><RotateCcw size={18} /> Katalog</span>}>
        <p className="mb-3 text-[13px] text-muted">Barcha narx, qoldiq va mahsulot o‘zgarishlarini bekor qilib, boshlang‘ich katalogni tiklaydi.</p>
        {confirmReset ? (
          <div className="flex gap-2">
            <button onClick={() => setConfirmReset(false)} className="h-12 flex-1 rounded-2xl bg-chip font-semibold">Bekor</button>
            <button onClick={() => { resetCatalog(); setConfirmReset(false) }} className="h-12 flex-1 rounded-2xl bg-[#e5322f] font-semibold text-white">Ha, tiklash</button>
          </div>
        ) : (
          <button onClick={() => setConfirmReset(true)} className="h-12 w-full rounded-2xl bg-[#e5322f]/10 font-semibold text-[#e5322f]">Katalogni tiklash</button>
        )}
        <Link to="/admin" className="mt-2 grid h-12 place-items-center rounded-2xl bg-chip font-semibold">Mahsulotlarni tahrirlash</Link>
      </Card>

      <Card title={<span className="flex w-full items-center justify-between"><span className="flex items-center gap-2"><History size={18} /> Xodimlar harakatlari</span>{log.length > 0 && <button onClick={clearLog} className="text-[12px] font-medium text-muted">Tozalash</button>}</span>}>
        {log.length ? log.slice(0, 50).map((l, i) => (
          <div key={i} className="flex gap-2 border-b border-line py-2 text-[13px] last:border-0">
            <span className={`h-fit shrink-0 rounded-md px-1.5 py-0.5 text-[10.5px] font-bold ${l.who === 'boshliq' ? 'bg-accent-400 text-black' : 'bg-brand-600 text-white'}`}>{l.who}</span>
            <span className="flex-1">{l.text}</span>
            <span className="shrink-0 text-[11px] text-muted tabular-nums">{new Date(l.t).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })}</span>
          </div>
        )) : <Muted>Hali harakatlar yo‘q</Muted>}
      </Card>
      <div className="mt-6 flex justify-center opacity-60"><Mark className="h-8" /></div>
    </div>
  )
}

function Tile({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-3xl p-3.5 ${accent ? 'bg-brand-600 text-white' : 'bg-card'}`}>
      <span className={accent ? 'opacity-80' : 'text-brand-600 dark:text-brand-200'}>{icon}</span>
      <div className="mt-2 text-[16px] leading-tight font-extrabold tabular-nums">{value}</div>
      <div className={`text-[12px] ${accent ? 'opacity-80' : 'text-muted'}`}>{label}</div>
      {sub && <div className={`text-[11px] ${accent ? 'opacity-70' : 'text-muted'}`}>{sub}</div>}
    </div>
  )
}
function Card({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-2 rounded-3xl bg-card p-4">
      <h2 className="mb-3 text-[16px] font-bold">{title}</h2>
      {children}
    </section>
  )
}
function Muted({ children }: { children: React.ReactNode }) {
  return <p className="py-2 text-[13px] text-muted">{children}</p>
}
