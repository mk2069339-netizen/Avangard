import { Link, useNavigate, useParams } from 'react-router-dom'
import { Heart, Package, Moon, Sun, MapPin, Globe, Headphones, Info, ChevronRight, Gift, Bell, CircleCheck, ShieldCheck, Percent } from 'lucide-react'
import { ProductGrid } from '../components/ProductCard'
import { ProductImage } from '../components/ProductArt'
import { tintFor } from '../components/ProductCard'
import { Empty, Mark, PrimaryButton, TopBar } from '../components/ui'
import { orderNo, useStore } from '../store'
import { deliveryDate, som } from '../format'

export function Favorites() {
  const nav = useNavigate()
  const favs = useStore((s) => s.favs)
  const products = useStore((s) => s.products)
  const items = favs.map((id) => products.find((p) => p.id === id)!).filter(Boolean)
  return (
    <div className="pb-28">
      <TopBar title="Saralangan" back={false} />
      {items.length ? (
        <div className="pt-3"><ProductGrid items={items} /></div>
      ) : (
        <Empty icon={<Heart size={44} />} title="Sizga yoqqanini qo‘shing" text="Mahsulotdagi ♡ belgisini bosing — u shu yerda saqlanadi" action={<PrimaryButton onClick={() => nav('/')}>Bosh sahifaga</PrimaryButton>} />
      )}
    </div>
  )
}

export function Profile() {
  const { dark, toggleDark, myOrders: orders, city, favs } = useStore()
  const rows = [
    { i: Package, t: 'Buyurtmalarim', s: orders.length ? `${orders.length} ta` : '', to: '/orders' },
    { i: Heart, t: 'Saralangan', s: favs.length ? `${favs.length}` : '', to: '/favorites' },
    { i: MapPin, t: 'Shahar', s: city, to: '/' },
    { i: Bell, t: 'Bildirishnomalar', s: '', to: '/profile' },
    { i: Globe, t: 'Til', s: 'O‘zbekcha', to: '/profile' },
    { i: Headphones, t: 'Qo‘llab‑quvvatlash', s: '24/7', to: '/profile' },
    { i: Info, t: 'Ilova haqida', s: 'v1.0', to: '/profile' },
  ]
  return (
    <div className="pb-28">
      <div className="bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 px-4 pt-6 pb-16 text-white">
        <div className="flex items-center gap-3">
          <div className="grid size-16 place-items-center rounded-full bg-white p-2"><Mark className="h-9" /></div>
          <div>
            <div className="text-xl font-extrabold">Mehmon</div>
            <div className="text-sm opacity-80">Kirish yoki ro‘yxatdan o‘tish</div>
          </div>
        </div>
      </div>
      <div className="-mt-10 mx-2 grid grid-cols-3 gap-2">
        {[
          { i: Gift, t: 'Saralangan', v: String(favs.length) },
          { i: Percent, t: 'Buyurtmalar', v: String(orders.length) },
          { i: ShieldCheck, t: 'Kafolatlar', v: String(orders.length) },
        ].map(({ i: I, t, v }) => (
          <div key={t} className="rounded-2xl bg-card p-3 shadow-sm">
            <I size={20} className="text-brand-600 dark:text-brand-200" />
            <div className="mt-2 text-[16px] font-extrabold">{v}</div>
            <div className="text-[12px] text-muted">{t}</div>
          </div>
        ))}
      </div>

      <div className="mx-2 mt-2 rounded-3xl bg-card">
        <button onClick={toggleDark} className="flex w-full items-center gap-3 px-4 py-3.5">
          <span className="grid size-9 place-items-center rounded-xl bg-chip">{dark ? <Moon size={18} /> : <Sun size={18} />}</span>
          <span className="flex-1 text-left text-[15px] font-medium">Tungi rejim</span>
          <span className={`relative h-7 w-12 rounded-full transition ${dark ? 'bg-brand-600' : 'bg-gray-300'}`}>
            <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${dark ? 'left-6' : 'left-1'}`} />
          </span>
        </button>
      </div>

      <div className="mx-2 mt-2 divide-y divide-[var(--line)] rounded-3xl bg-card">
        {rows.map(({ i: I, t, s, to }) => (
          <Link key={t} to={to} className="flex items-center gap-3 px-4 py-3.5">
            <span className="grid size-9 place-items-center rounded-xl bg-chip"><I size={18} /></span>
            <span className="flex-1 text-[15px] font-medium">{t}</span>
            <span className="text-[13px] text-muted">{s}</span>
            <ChevronRight size={18} className="text-muted" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export function Orders() {
  const nav = useNavigate()
  const orders = useStore((s) => s.myOrders)
  const products = useStore((s) => s.products)
  return (
    <div className="pb-28">
      <TopBar title="Buyurtmalarim" />
      {!orders.length ? (
        <Empty icon={<Package size={44} />} title="Buyurtmalar yo‘q" text="Birinchi xaridingizni hoziroq qiling" action={<PrimaryButton onClick={() => nav('/')}>Xaridni boshlash</PrimaryButton>} />
      ) : (
        <div className="space-y-2 px-2 pt-2">
          {orders.map((o) => (
            <div key={o.id} className="rounded-3xl bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="font-bold">№ {orderNo(o.id)}</div>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">{o.status}</span>
              </div>
              <div className="mt-1 text-[13px] text-muted">{new Date(o.date).toLocaleDateString('ru-RU')} · {o.address}</div>
              <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
                {o.items.map((it) => {
                  const p = products.find((x) => x.id === it.id)
                  return p ? (
                    <Link key={it.id + it.color} to={`/p/${p.id}`} className="grid size-14 shrink-0 place-items-center rounded-xl" style={{ background: tintFor(p.cat) }}>
                      <ProductImage p={p} color={it.color} className="size-12" />
                    </Link>
                  ) : null
                })}
              </div>
              <Steps status={o.status} />
              <div className="mt-3 flex justify-between border-t border-line pt-3 text-[14px]">
                <span className="text-muted">{o.payment} · Jami</span>
                <b>{som(o.total)}</b>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Steps({ status }: { status: string }) {
  const s = ['Qabul qilindi', 'Yig‘ilmoqda', 'Yo‘lda', 'Yetkazildi']
  if (status === 'Bekor qilindi') return <div className="mt-4 rounded-xl bg-[#e5322f]/10 px-3 py-2 text-[13px] font-semibold text-[#e5322f]">Buyurtma bekor qilindi</div>
  const done = ({ Yangi: 0, Tasdiqlandi: 0, 'Yig‘ilmoqda': 1, 'Yo‘lda': 2, Yetkazildi: 3 } as Record<string, number>)[status] ?? 0
  return (
    <div className="mt-4">
      <div className="flex gap-1">
        {s.map((t, i) => <span key={t} className={`h-1.5 flex-1 rounded-full ${i <= done ? 'bg-brand-600' : 'bg-chip'}`} />)}
      </div>
      <div className="mt-1.5 flex">
        {s.map((t, i) => <span key={t} className={`flex-1 text-[10.5px] ${i <= done ? 'font-semibold text-ink' : 'text-muted'}`}>{t}</span>)}
      </div>
    </div>
  )
}

export function Success() {
  const { id } = useParams()
  const nav = useNavigate()
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="animate-pop grid size-24 place-items-center rounded-full bg-ok text-white shadow-xl shadow-ok/30"><CircleCheck size={52} /></div>
      <h1 className="mt-6 text-2xl font-extrabold">Buyurtma qabul qilindi!</h1>
      <p className="mt-2 text-muted">№ {orderNo(id ?? '')} · Operator tez orada qo‘ng‘iroq qilib, yetkazib berish vaqtini kelishib oladi.</p>
      <div className="mt-8 w-full max-w-sm space-y-2">
        <PrimaryButton onClick={() => nav('/orders', { replace: true })}>Buyurtmani kuzatish</PrimaryButton>
        <button onClick={() => nav('/', { replace: true })} className="h-12 w-full rounded-2xl bg-chip font-semibold">Xaridni davom ettirish</button>
      </div>
    </div>
  )
}
