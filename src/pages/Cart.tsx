import { Link, useNavigate } from 'react-router-dom'
import { Check, Minus, Plus, ShoppingCart, Trash2, Truck, Heart } from 'lucide-react'
import { cartLines, cartTotals, useStore } from '../store'
import { ProductImage } from '../components/ProductArt'
import { tintFor } from '../components/ProductCard'
import { Empty, PrimaryButton, Section, TopBar } from '../components/ui'
import ProductCard from '../components/ProductCard'
import { som } from '../format'

export default function Cart() {
  const nav = useNavigate()
  const cart = useStore((s) => s.cart)
  const { setQty, toggleCheck, checkAll, removeChecked, toggleFav } = useStore()
  const favs = useStore((s) => s.favs)
  const products = useStore((s) => s.products)
  const lines = cartLines(cart, products)
  const t = cartTotals(cart, products)
  const allChecked = lines.length > 0 && lines.every((l) => l.checked)

  if (!lines.length)
    return (
      <div className="pb-28">
        <TopBar title="Savat" back={false} />
        <Empty
          icon={<ShoppingCart size={44} />}
          title="Savatingiz hozircha bo‘sh"
          text="Bosh sahifadagi to‘plamlardan boshlang yoki kerakli mahsulotni qidiruv orqali toping"
          action={<PrimaryButton onClick={() => nav('/')}>Xaridni boshlash</PrimaryButton>}
        />
        <Section title="Sizga yoqishi mumkin">
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-2">
            {products.slice(0, 8).map((p) => <ProductCard key={p.id} p={p} wide />)}
          </div>
        </Section>
      </div>
    )

  return (
    <div className="pb-48">
      <TopBar title={<>Savat <span className="text-muted font-medium">· {lines.reduce((a, l) => a + l.qty, 0)}</span></>} back={false} />

      <div className="mx-2 mt-2 flex items-center gap-2 rounded-2xl bg-ok/10 px-4 py-3 text-[13px] font-medium text-ok">
        <Truck size={18} /> Yetkazib berish vaqti operator bilan kelishiladi
      </div>

      <div className="mx-2 mt-2 flex items-center justify-between rounded-2xl bg-card px-4 py-3">
        <button onClick={() => checkAll(!allChecked)} className="flex items-center gap-2.5 text-[14px] font-medium">
          <Box on={allChecked} /> Hammasini tanlash
        </button>
        <button onClick={removeChecked} disabled={!lines.some((l) => l.checked)} className="flex items-center gap-1 text-[13px] font-semibold text-[#e5322f] disabled:opacity-30">
          <Trash2 size={16} /> O‘chirish
        </button>
      </div>

      <div className="mx-2 mt-2 divide-y divide-[var(--line)] rounded-3xl bg-card">
        {lines.map((l) => (
          <div key={l.id + l.color} className="flex gap-3 p-3">
            <button onClick={() => toggleCheck(l.id, l.color)} className="self-center"><Box on={l.checked} /></button>
            <Link to={`/p/${l.id}`} className="grid size-[92px] shrink-0 place-items-center rounded-2xl" style={{ background: tintFor(l.p.cat) }}>
              <ProductImage p={l.p} color={l.color} className="size-20" />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="text-[16px] font-extrabold">{som(l.p.price * l.qty)}</div>
              {l.p.oldPrice && <div className="text-xs text-muted line-through">{som(l.p.oldPrice * l.qty)}</div>}
              <Link to={`/p/${l.id}`} className="mt-0.5 line-clamp-2 text-[13px] leading-snug">{l.p.title}</Link>
              <div className="text-xs text-muted">Rang: {l.p.colors[l.color]?.name}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1 rounded-xl bg-chip p-0.5">
                  <button onClick={() => setQty(l.id, l.color, l.qty - 1)} className="grid size-8 place-items-center rounded-lg active:bg-card" aria-label="Kamaytirish">{l.qty === 1 ? <Trash2 size={15} /> : <Minus size={16} />}</button>
                  <span className="w-6 text-center text-sm font-bold">{l.qty}</span>
                  <button onClick={() => setQty(l.id, l.color, l.qty + 1)} className="grid size-8 place-items-center rounded-lg active:bg-card" aria-label="Ko‘paytirish"><Plus size={16} /></button>
                </div>
                <button onClick={() => toggleFav(l.id)} className="grid size-9 place-items-center" aria-label="Sevimli">
                  <Heart size={19} className={favs.includes(l.id) ? 'fill-[#e5322f] text-[#e5322f]' : 'text-muted'} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-2 mt-2 rounded-3xl bg-card p-4 text-[14px]">
        <h3 className="mb-2 text-[17px] font-bold">Buyurtmangiz</h3>
        <Line k={`Mahsulotlar (${t.count})`} v={som(t.old)} />
        {t.saved > 0 && <Line k="Chegirma" v={<span className="text-[#e5322f]">−{som(t.saved)}</span>} />}
        <Line k="Yetkazib berish" v={<span className="text-muted">Kelishiladi</span>} />
        <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
          <span className="font-bold">Jami</span>
          <span className="text-[19px] font-extrabold">{som(t.sum)}</span>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-[62px] z-30 mx-auto max-w-[520px] border-t border-line bg-card/95 px-3 py-3 backdrop-blur-xl">
        <PrimaryButton disabled={!t.count} onClick={() => nav('/checkout')} className="flex items-center justify-between">
          <span>Rasmiylashtirish</span>
          <span>{som(t.sum)}</span>
        </PrimaryButton>
      </div>
    </div>
  )
}

export function Box({ on }: { on: boolean }) {
  return (
    <span className={`grid size-[22px] place-items-center rounded-md border-2 transition ${on ? 'border-brand-600 bg-brand-600 text-white' : 'border-gray-300 dark:border-gray-600'}`}>
      {on && <Check size={14} strokeWidth={3} />}
    </span>
  )
}

function Line({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-muted">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  )
}
