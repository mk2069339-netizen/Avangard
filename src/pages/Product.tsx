import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Heart, Share2, Truck, ShieldCheck, RotateCcw, Store, ChevronRight, BadgeCheck, Minus, Plus, Star, MessageCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { discount, sampleReviews } from '../data/products'
import ProductArt from '../components/ProductArt'
import ProductCard, { tintFor } from '../components/ProductCard'
import { Section, Stars } from '../components/ui'
import { useStore } from '../store'
import { deliveryDate, som } from '../format'


export default function Product() {
  const { id = '' } = useParams()
  const nav = useNavigate()
  const products = useStore((s) => s.products)
  const p = products.find((x) => x.id === id)
  const [color, setColor] = useState(0)
  const [slide, setSlide] = useState(0)
  const [more, setMore] = useState(false)
  const fav = useStore((s) => s.favs.includes(id))
  const toggleFav = useStore((s) => s.toggleFav)
  const addToCart = useStore((s) => s.addToCart)
  const line = useStore((s) => s.cart.find((c) => c.id === id && c.color === color))
  const setQty = useStore((s) => s.setQty)
  const showToast = useStore((s) => s.showToast)
  const top = useRef<HTMLDivElement>(null)

  useEffect(() => { window.scrollTo(0, 0); setColor(0); setSlide(0) }, [id])

  if (!p) return <div className="p-10 text-center">Mahsulot topilmadi</div>
  const d = discount(p)
  const visible = products.filter((x) => !x.hidden)
  const similar = visible.filter((x) => x.cat === p.cat && x.id !== p.id).concat(visible.filter((x) => x.brand === p.brand && x.cat !== p.cat)).slice(0, 8)
  const views = ['old', 'yon', 'orqa']

  return (
    <div className="pb-40" ref={top}>
      {/* Gallery */}
      <div className="relative" style={{ background: tintFor(p.cat) }}>
        <div className="absolute inset-0 dark:bg-black/30" />
        <div onScroll={(e) => setSlide(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))} className="no-scrollbar snap-x-m relative flex aspect-square max-h-[460px] w-full overflow-x-auto">
          {views.map((v, i) => (
            <div key={v} className="snap-start-a grid w-full shrink-0 place-items-center">
              <ProductArt kind={p.art} color={p.colors[color].hex} className={`h-[78%] w-[78%] drop-shadow-xl transition ${i === 1 ? 'scale-x-[-1]' : ''} ${i === 2 ? 'scale-90 opacity-90' : ''}`} />
            </div>
          ))}
        </div>
        <div className="absolute top-0 inset-x-0 flex justify-between p-3">
          <button onClick={() => nav(-1)} className="grid size-10 place-items-center rounded-full bg-white/85 text-black shadow backdrop-blur" aria-label="Orqaga"><ChevronLeft /></button>
          <div className="flex gap-2">
            <button
              onClick={async () => { try { await navigator.share({ title: p.title, url: location.href }) } catch { try { await navigator.clipboard.writeText(location.href); showToast('Havola nusxalandi') } catch { showToast('Ulashib bo‘lmadi') } } }}
              className="grid size-10 place-items-center rounded-full bg-white/85 text-black shadow backdrop-blur" aria-label="Ulashish"
            ><Share2 size={19} /></button>
            <button onClick={() => toggleFav(p.id)} className="grid size-10 place-items-center rounded-full bg-white/85 shadow backdrop-blur" aria-label="Sevimli">
              <Heart size={20} className={fav ? 'fill-[#e5322f] text-[#e5322f] animate-pop' : 'text-black'} />
            </button>
          </div>
        </div>
        <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
          {views.map((_, i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-5 bg-brand-600' : 'w-1.5 bg-black/20'}`} />)}
        </div>
      </div>

      {/* Price block */}
      <div className="rounded-b-3xl bg-card px-4 pt-4 pb-5">
        <div className="flex items-end gap-2">
          <span className="text-[26px] leading-none font-extrabold">{som(p.price)}</span>
          {d > 0 && <span className="rounded-md bg-[#e5322f] px-1.5 py-0.5 text-xs font-bold text-white">−{d}%</span>}
        </div>
        {p.oldPrice && <div className="mt-1 text-sm text-muted line-through">{som(p.oldPrice)}</div>}
        <h1 className="mt-3 text-[17px] leading-snug font-semibold">{p.title}</h1>
        <div className="mt-2 flex items-center gap-3 text-[13px]">
          <span className="flex items-center gap-1"><Star size={15} className="fill-accent-400 text-accent-400" /><b>{p.rating}</b><span className="text-muted">· {p.reviews.toLocaleString('ru-RU')} sharh</span></span>
          <span className="text-muted">{p.orders.toLocaleString('ru-RU')}+ buyurtma</span>
        </div>

        {p.colors.length > 1 && (
          <div className="mt-4">
            <div className="mb-2 text-[13px]"><span className="text-muted">Rang:</span> <b>{p.colors[color].name}</b></div>
            <div className="flex gap-2">
              {p.colors.map((c, i) => (
                <button key={c.name} onClick={() => setColor(i)} className={`grid h-16 w-14 place-items-center rounded-xl border-2 transition ${i === color ? 'border-brand-600' : 'border-line'}`} style={{ background: tintFor(p.cat) }}>
                  <ProductArt kind={p.art} color={c.hex} className="size-11" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delivery */}
      <div className="mx-2 mt-2 divide-y divide-[var(--line)] rounded-3xl bg-card px-4">
        <Row icon={<Truck className="text-ok" size={20} />} title={`Yetkazib berish ${deliveryDate(1)}, bepul`} sub="Kuryer orqali yoki 120+ topshirish punktidan" />
        <Row icon={<ShieldCheck className="text-brand-600" size={20} />} title="Rasmiy kafolat 1–3 yil" sub="Servis markazlarida bepul ta‘mirlash" />
        <Row icon={<RotateCcw className="text-accent-500" size={20} />} title="10 kun ichida qaytarish" sub="Sababini so‘ramaymiz" />
        <Row icon={<Store className="text-[#e5322f]" size={20} />} title={<span className="flex items-center gap-1">Avangard rasmiy do‘koni <BadgeCheck size={16} className="text-brand-600" /></span>} sub={`Omborda ${p.stock} dona mavjud`} chevron />
      </div>

      {/* Description */}
      <div className="mx-2 mt-2 rounded-3xl bg-card p-4">
        <h2 className="text-[17px] font-bold">Mahsulot haqida</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-ink/80">{p.desc}</p>
        <h3 className="mt-4 mb-2 font-bold">Xususiyatlari</h3>
        <dl className="text-[14px]">
          {(more ? p.specs : p.specs.slice(0, 4)).concat([['Brend', p.brand]]).map(([k, v]) => (
            <div key={k} className="flex gap-2 py-1.5">
              <dt className="shrink-0 text-muted">{k}</dt>
              <span className="mb-1 flex-1 border-b border-dotted border-line" />
              <dd className="text-right font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        {p.specs.length > 4 && (
          <button onClick={() => setMore(!more)} className="mt-2 text-sm font-semibold text-brand-600 dark:text-brand-200">{more ? 'Yashirish' : 'Barcha xususiyatlar'}</button>
        )}
      </div>

      {/* Reviews */}
      <div className="mx-2 mt-2 rounded-3xl bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold">Sharhlar <span className="text-muted">{p.reviews.toLocaleString('ru-RU')}</span></h2>
          <MessageCircle size={20} className="text-muted" />
        </div>
        <div className="mt-3 flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-extrabold">{p.rating}</div>
            <Stars value={p.rating} size={14} />
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((s) => {
              const w = s === 5 ? 82 : s === 4 ? 12 : s === 3 ? 4 : 1
              return (
                <div key={s} className="flex items-center gap-2 text-xs text-muted">
                  <span className="w-2">{s}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-chip"><span className="block h-full rounded-full bg-accent-400" style={{ width: `${w}%` }} /></span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
          {sampleReviews.map((r) => (
            <div key={r.name} className="w-[260px] shrink-0 rounded-2xl bg-chip p-3">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{r.name[0]}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-[11px] text-muted">{r.date}</div>
                </div>
                <Stars value={r.rating} size={11} />
              </div>
              <p className="mt-2 line-clamp-3 text-[13px] leading-snug">{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      <Section title="O‘xshash mahsulotlar">
        <div className="no-scrollbar snap-x-m flex gap-2 overflow-x-auto px-2">
          {similar.map((x) => <ProductCard key={x.id} p={x} wide />)}
        </div>
      </Section>

      {/* Sticky buy bar */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[520px] border-t border-line bg-card/95 px-3 pt-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <div className="text-[15px] leading-tight font-extrabold whitespace-nowrap">{som(p.price)}</div>
            <div className="truncate text-xs text-ok">Ertaga bepul yetkazamiz</div>
          </div>
          {line ? (
            <div className="flex h-12 items-center gap-1 rounded-2xl bg-chip p-1">
              <button onClick={() => setQty(p.id, color, line.qty - 1)} className="grid size-10 place-items-center rounded-xl bg-card" aria-label="Kamaytirish"><Minus size={18} /></button>
              <span className="w-8 text-center font-bold">{line.qty}</span>
              <button onClick={() => setQty(p.id, color, line.qty + 1)} className="grid size-10 place-items-center rounded-xl bg-card" aria-label="Ko‘paytirish"><Plus size={18} /></button>
            </div>
          ) : (
            <button onClick={() => addToCart(p.id, color)} className="h-12 shrink-0 rounded-2xl bg-brand-50 px-3.5 text-[14px] font-bold text-brand-700 active:scale-95 transition dark:bg-brand-900/60 dark:text-brand-200">Savatga</button>
          )}
          <button onClick={() => { if (!line) addToCart(p.id, color); nav('/cart') }} className="h-12 shrink-0 rounded-2xl bg-brand-600 px-4 text-[14px] font-bold text-white shadow-lg shadow-brand-600/30 active:scale-95 transition">
            Sotib olish
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ icon, title, sub, chevron }: { icon: React.ReactNode; title: React.ReactNode; sub: string; chevron?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-chip">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold">{title}</div>
        <div className="text-[12.5px] text-muted">{sub}</div>
      </div>
      {chevron && <ChevronRight size={18} className="text-muted" />}
    </div>
  )
}
