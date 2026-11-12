import { Link, useNavigate } from 'react-router-dom'
import { Bell, ChevronRight, MapPin, Search, ScanLine, Truck, Percent, ShieldCheck, Wrench, Flame, Sparkles, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { brands, categories, discount, products } from '../data/products'
import ProductCard, { ProductGrid } from '../components/ProductCard'
import ProductArt from '../components/ProductArt'
import { Countdown, Logo, Section } from '../components/ui'
import { useStore } from '../store'
import { som } from '../format'

const banners = [
  { title: 'Muddatli to‘lov 0%', sub: '24 oygacha ustamasiz. Pasport bilan 5 daqiqada', art: 'fridge', bg: 'linear-gradient(135deg,#0c3038 0%,#1f6977 55%,#2fb3c6 100%)', to: '/c/fridge' },
  { title: 'Black Friday −45%', sub: 'Televizorlar va smartfonlarga katta chegirmalar', art: 'tv', bg: 'linear-gradient(135deg,#1a0b0b 0%,#e5322f 100%)', to: '/c/tv' },
  { title: 'Qishga tayyormisiz?', sub: 'Isitgichlar va inverter konditsionerlar', art: 'ac', bg: 'linear-gradient(135deg,#ff8a00 0%,#e5322f 100%)', to: '/c/ac' },
  { title: 'O‘rnatish bepul', sub: 'Kir yuvish va idish yuvish mashinalariga', art: 'washer', bg: 'linear-gradient(135deg,#175663 0%,#00b86b 100%)', to: '/c/washer' },
] as const

const stories = [
  { t: 'Aksiyalar', c: '#e5322f', a: 'tv' },
  { t: 'Yangiliklar', c: '#1f6977', a: 'phone' },
  { t: 'Sharhlar', c: '#ff8a00', a: 'robot' },
  { t: 'Oshxona', c: '#00b86b', a: 'coffee' },
  { t: 'Iqlim', c: '#2fb3c6', a: 'ac' },
  { t: 'Sovg‘alar', c: '#8a5a3b', a: 'kettle' },
] as const

export default function Home() {
  const nav = useNavigate()
  const city = useStore((s) => s.city)
  const setCity = useStore((s) => s.setCity)
  const [chip, setChip] = useState('Hammasi')
  const deals = products.filter((p) => discount(p) >= 15).sort((a, b) => discount(b) - discount(a))
  const hits = [...products].sort((a, b) => b.orders - a.orders).slice(0, 8)
  const chips = ['Hammasi', 'Arzon narx', 'Yuqori reyting', 'Yangi', 'Original']
  const feed = (() => {
    const all = [...products]
    if (chip === 'Arzon narx') return all.sort((a, b) => a.price - b.price)
    if (chip === 'Yuqori reyting') return all.sort((a, b) => b.rating - a.rating)
    if (chip === 'Yangi') return all.filter((p) => p.badges?.includes('new'))
    if (chip === 'Original') return all.filter((p) => p.badges?.includes('original'))
    return all.sort((a, b) => (a.id > b.id ? 1 : -1)).sort((a, b) => (b.orders % 7) - (a.orders % 7))
  })()

  return (
    <div className="pb-28">
      {/* Header */}
      <div className="bg-card px-4 pt-3 pb-1">
        <div className="flex items-center justify-between">
          <Logo className="h-8" />
          <div className="flex items-center gap-1">
            <button
              onClick={() => { const list = ['Toshkent', 'Samarqand', 'Buxoro', 'Namangan', 'Andijon', 'Farg‘ona', 'Qarshi', 'Nukus']; setCity(list[(list.indexOf(city) + 1) % list.length]) }}
              className="flex items-center gap-1 rounded-full bg-chip px-3 py-1.5 text-[13px] font-medium"
            >
              <MapPin size={14} className="text-brand-600" /> {city} <ChevronDown size={14} />
            </button>
            <button className="relative grid size-10 place-items-center rounded-full active:bg-chip" aria-label="Bildirishnomalar">
              <Bell size={22} />
              <span className="absolute top-2 right-2.5 size-2 rounded-full bg-[#e5322f] ring-2 ring-[var(--card)]" />
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="sticky top-0 z-30 bg-card/90 px-4 pt-2 pb-3 backdrop-blur-xl">
        <button onClick={() => nav('/search')} className="flex h-11 w-full items-center gap-2.5 rounded-2xl border-2 border-brand-600 bg-card px-3 text-left text-[15px] text-muted">
          <Search size={20} className="text-brand-600" />
          <span className="flex-1">Mahsulot va brendlarni qidirish</span>
          <ScanLine size={20} />
        </button>
      </div>

      {/* Stories */}
      <div className="no-scrollbar flex gap-3 overflow-x-auto bg-card px-4 pb-4">
        {stories.map((s) => (
          <button key={s.t} className="flex w-[68px] shrink-0 flex-col items-center gap-1.5">
            <span className="rounded-[22px] p-[2.5px]" style={{ background: `linear-gradient(135deg, ${s.c}, #1f6977)` }}>
              <span className="grid size-[62px] place-items-center rounded-[20px] border-[3px] border-[var(--card)]" style={{ background: s.c + '22' }}>
                <ProductArt kind={s.a} className="size-12" />
              </span>
            </span>
            <span className="text-[11.5px] font-medium">{s.t}</span>
          </button>
        ))}
      </div>

      <BannerCarousel />

      {/* Perks */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-4">
        {[
          { i: Truck, t: '1 kunda yetkazish', c: 'text-ok' },
          { i: Percent, t: '0% muddatli to‘lov', c: 'text-accent-500' },
          { i: ShieldCheck, t: 'Rasmiy kafolat', c: 'text-brand-600' },
          { i: Wrench, t: 'Bepul o‘rnatish', c: 'text-[#e5322f]' },
        ].map(({ i: I, t, c }) => (
          <div key={t} className="flex shrink-0 items-center gap-2 rounded-2xl bg-card px-3 py-2.5 text-[13px] font-semibold">
            <I size={18} className={c} /> {t}
          </div>
        ))}
      </div>

      {/* Categories */}
      <Section title="Kategoriyalar" action={<Link to="/catalog" className="flex items-center text-sm font-semibold text-brand-600 dark:text-brand-200">Barchasi <ChevronRight size={16} /></Link>}>
        <div className="no-scrollbar grid auto-cols-[88px] grid-flow-col grid-rows-2 gap-2 overflow-x-auto px-4">
          {categories.map((c) => (
            <Link key={c.id} to={`/c/${c.id}`} className="flex flex-col items-center gap-1.5 active:scale-95 transition">
              <span className="grid size-[76px] place-items-center rounded-[22px]" style={{ background: c.tint }}>
                <ProductArt kind={c.art} className="size-14" />
              </span>
              <span className="line-clamp-2 text-center text-[11.5px] leading-tight font-medium">{c.name}</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Flash sale */}
      <section className="mx-2 mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#e5322f] to-[#ff8a00] pb-3">
        <div className="flex items-center justify-between px-4 pt-4 pb-3 text-white">
          <div>
            <div className="flex items-center gap-1.5 text-[19px] font-extrabold"><Flame size={22} className="fill-white" /> Kun chegirmalari</div>
            <div className="text-[12.5px] opacity-90">Faqat bugun — tugashiga:</div>
          </div>
          <Countdown />
        </div>
        <div className="no-scrollbar snap-x-m flex gap-2 overflow-x-auto px-2">
          {deals.map((p) => <ProductCard key={p.id} p={p} wide />)}
        </div>
      </section>

      <Section title={<span className="flex items-center gap-1.5">Eng ko‘p sotilgan <Sparkles size={18} className="text-accent-500" /></span>}>
        <div className="no-scrollbar snap-x-m flex gap-2 overflow-x-auto px-2">
          {hits.map((p) => <ProductCard key={p.id} p={p} wide />)}
        </div>
      </Section>

      {/* Installment promo */}
      <Link to="/installment" className="mx-2 mt-6 flex items-center gap-3 rounded-3xl bg-[#15131f] p-4 text-white dark:bg-brand-900">
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent-400 text-2xl font-black text-black">0%</div>
        <div className="flex-1">
          <div className="font-bold">Avangard Nasiya</div>
          <div className="text-[13px] opacity-75">Limit 50 000 000 so‘mgacha. Karta va kafilsiz.</div>
        </div>
        <ChevronRight className="opacity-60" />
      </Link>

      {/* Brands */}
      <Section title="Mashhur brendlar">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4">
          {brands.map((b) => (
            <Link key={b} to={`/search?q=${encodeURIComponent(b)}`} className="grid h-14 min-w-[104px] shrink-0 place-items-center rounded-2xl bg-card px-4 text-[15px] font-black tracking-tight">
              {b}
            </Link>
          ))}
        </div>
      </Section>

      {/* Feed */}
      <Section title="Siz uchun tavsiyalar">
        <div className="no-scrollbar sticky top-16 z-20 -mt-1 mb-3 flex gap-2 overflow-x-auto bg-app px-4 py-1">
          {chips.map((c) => (
            <button key={c} onClick={() => setChip(c)} className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition ${chip === c ? 'bg-brand-600 text-white' : 'bg-card'}`}>
              {c}
            </button>
          ))}
        </div>
        <ProductGrid items={feed} />
      </Section>

      <p className="mt-8 px-4 text-center text-xs text-muted">© {new Date().getFullYear()} Avangard. Maishiy texnika marketpleysi.<br />Eng arzon narx: {som(Math.min(...products.map((p) => p.price)))} dan</p>
    </div>
  )
}

function BannerCarousel() {
  const ref = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => {
      const el = ref.current
      if (!el) return
      const next = (Math.round(el.scrollLeft / el.clientWidth) + 1) % banners.length
      el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' })
    }, 4000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="relative mt-3">
      <div ref={ref} onScroll={(e) => setIdx(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))} className="no-scrollbar snap-x-m flex overflow-x-auto">
        {banners.map((b) => (
          <Link key={b.title} to={b.to} className="snap-start-a w-full shrink-0 px-3">
            <div className="relative flex h-[168px] overflow-hidden rounded-3xl p-5 text-white" style={{ background: b.bg }}>
              <div className="shimmer absolute inset-0 opacity-30" />
              <div className="relative z-10 flex max-w-[62%] flex-col">
                <h3 className="text-[22px] leading-tight font-extrabold">{b.title}</h3>
                <p className="mt-1.5 text-[13px] leading-snug opacity-90">{b.sub}</p>
                <span className="mt-auto w-fit rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-bold text-black">Xarid qilish</span>
              </div>
              <ProductArt kind={b.art} className="absolute -right-4 -bottom-3 size-[170px] drop-shadow-2xl" />
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-1.5">
        {banners.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-5 bg-brand-600' : 'w-1.5 bg-gray-300 dark:bg-gray-600'}`} />
        ))}
      </div>
    </div>
  )
}
