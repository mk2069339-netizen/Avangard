import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpDown, ChevronRight, Clock, Search as SearchIcon, SlidersHorizontal, X, Mic, Check } from 'lucide-react'
import { brandsOf, categories, discount, type Product } from '../data/products'
import { CatThumb } from './Home'
import { ProductGrid } from '../components/ProductCard'
import { Empty, PrimaryButton, TopBar } from '../components/ui'
import { useStore } from '../store'

/* ---------- Catalog ---------- */
export function Catalog() {
  const nav = useNavigate()
  const products = useStore((s) => s.products).filter((p) => !p.hidden)
  return (
    <div className="pb-28">
      <TopBar title="Katalog" back={false} />
      <div className="px-4 pt-3">
        <button onClick={() => nav('/search')} className="flex h-11 w-full items-center gap-2 rounded-2xl bg-chip px-3 text-[15px] text-muted">
          <SearchIcon size={19} /> Mahsulot qidirish
        </button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 px-2 sm:grid-cols-3">
        {categories.filter((c) => products.some((p) => p.cat === c.id)).map((c, i) => {
          const n = products.filter((p) => p.cat === c.id).length
          return (
            <Link key={c.id} to={`/c/${c.id}`} className="animate-rise relative flex h-[120px] overflow-hidden rounded-3xl p-3 transition active:scale-[.97]" style={{ background: c.tint, animationDelay: `${i * 30}ms` }}>
              <div className="relative z-10 text-[14px] leading-tight font-bold text-[#15131f]">
                {c.name}
                <div className="mt-1 text-[11.5px] font-medium text-black/50">{n} mahsulot</div>
              </div>
              <span className="absolute -right-2 -bottom-2 size-[84px] overflow-hidden rounded-2xl shadow-lg"><CatThumb cat={c} products={products} className="size-full" /></span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- Sort & filter ---------- */
const sorts = [
  ['pop', 'Ommabop'],
  ['cheap', 'Arzonroq'],
  ['exp', 'Qimmatroq'],
  ['rating', 'Yuqori reyting'],
  ['disc', 'Chegirma bo‘yicha'],
] as const
type SortKey = (typeof sorts)[number][0]

function useFiltered(base: Product[]) {
  const [sort, setSort] = useState<SortKey>('pop')
  const [sel, setSel] = useState<string[]>([])
  const [max, setMax] = useState<number>(0)
  const [onlySale, setOnlySale] = useState(false)
  const items = useMemo(() => {
    let r = base.filter((p) => (!sel.length || sel.includes(p.brand)) && (!max || p.price <= max) && (!onlySale || discount(p) > 0))
    r = [...r].sort((a, b) =>
      sort === 'cheap' ? a.price - b.price : sort === 'exp' ? b.price - a.price : sort === 'rating' ? b.rating - a.rating : sort === 'disc' ? discount(b) - discount(a) : b.orders - a.orders,
    )
    return r
  }, [base, sort, sel, max, onlySale])
  return { items, sort, setSort, sel, setSel, max, setMax, onlySale, setOnlySale }
}

function Toolbar({ f, base }: { f: ReturnType<typeof useFiltered>; base: Product[] }) {
  const [sheet, setSheet] = useState<null | 'sort' | 'filter'>(null)
  const bs = brandsOf(base)
  const active = f.sel.length + (f.max ? 1 : 0) + (f.onlySale ? 1 : 0)
  const priceSteps = [0, 1_000_000, 3_000_000, 5_000_000, 10_000_000]
  return (
    <>
      <div className="no-scrollbar sticky top-14 z-20 flex gap-2 overflow-x-auto bg-app px-3 py-2.5">
        <button onClick={() => setSheet('filter')} className="flex shrink-0 items-center gap-1.5 rounded-full bg-card px-3.5 py-2 text-[13px] font-semibold">
          <SlidersHorizontal size={15} /> Filtrlar {active > 0 && <span className="grid size-5 place-items-center rounded-full bg-brand-600 text-[11px] text-white">{active}</span>}
        </button>
        <button onClick={() => setSheet('sort')} className="flex shrink-0 items-center gap-1.5 rounded-full bg-card px-3.5 py-2 text-[13px] font-semibold">
          <ArrowUpDown size={15} /> {sorts.find((s) => s[0] === f.sort)![1]}
        </button>
        <button onClick={() => f.setOnlySale(!f.onlySale)} className={`shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold ${f.onlySale ? 'bg-[#e5322f] text-white' : 'bg-card'}`}>Chegirmali</button>
        {bs.map((b) => (
          <button key={b} onClick={() => f.setSel(f.sel.includes(b) ? f.sel.filter((x) => x !== b) : [...f.sel, b])} className={`shrink-0 rounded-full px-3.5 py-2 text-[13px] font-semibold ${f.sel.includes(b) ? 'bg-brand-600 text-white' : 'bg-card'}`}>{b}</button>
        ))}
      </div>

      {sheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setSheet(null)}>
          <div className="animate-sheet pb-safe w-full max-w-[520px] rounded-t-3xl bg-card px-4 pt-2" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-bold">{sheet === 'sort' ? 'Saralash' : 'Filtrlar'}</h3>
              <button onClick={() => setSheet(null)} className="grid size-9 place-items-center rounded-full bg-chip" aria-label="Yopish"><X size={18} /></button>
            </div>
            {sheet === 'sort' ? (
              <div className="pb-3">
                {sorts.map(([k, l]) => (
                  <button key={k} onClick={() => { f.setSort(k); setSheet(null) }} className="flex w-full items-center justify-between py-3.5 text-[15px]">
                    {l} {f.sort === k && <Check size={20} className="text-brand-600" />}
                  </button>
                ))}
              </div>
            ) : (
              <div className="pb-3">
                <div className="mt-2 mb-2 text-sm font-semibold">Narx, gacha</div>
                <div className="flex flex-wrap gap-2">
                  {priceSteps.map((s) => (
                    <button key={s} onClick={() => f.setMax(s)} className={`rounded-full px-3.5 py-2 text-[13px] font-semibold ${f.max === s ? 'bg-brand-600 text-white' : 'bg-chip'}`}>
                      {s ? `${(s / 1e6).toLocaleString('ru-RU')} mln` : 'Istalgan'}
                    </button>
                  ))}
                </div>
                <div className="mt-4 mb-2 text-sm font-semibold">Brend</div>
                <div className="flex flex-wrap gap-2">
                  {bs.map((b) => (
                    <button key={b} onClick={() => f.setSel(f.sel.includes(b) ? f.sel.filter((x) => x !== b) : [...f.sel, b])} className={`rounded-full px-3.5 py-2 text-[13px] font-semibold ${f.sel.includes(b) ? 'bg-brand-600 text-white' : 'bg-chip'}`}>{b}</button>
                  ))}
                </div>
                <div className="mt-5 flex gap-2">
                  <button onClick={() => { f.setSel([]); f.setMax(0); f.setOnlySale(false) }} className="h-12 flex-1 rounded-2xl bg-chip font-semibold">Tozalash</button>
                  <PrimaryButton className="flex-[2]" onClick={() => setSheet(null)}>{f.items.length} ta mahsulotni ko‘rsatish</PrimaryButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

/* ---------- Category ---------- */
export function CategoryPage() {
  const { id = '' } = useParams()
  const cat = categories.find((c) => c.id === id)
  const all = useStore((s) => s.products)
  const base = useMemo(() => all.filter((p) => p.cat === id && !p.hidden), [all, id])
  const f = useFiltered(base)
  return (
    <div className="pb-28">
      <TopBar title={cat?.name ?? 'Kategoriya'} />
      <Toolbar f={f} base={base} />
      <div className="px-4 pb-2 text-[13px] text-muted">{f.items.length} ta mahsulot</div>
      {f.items.length ? <ProductGrid items={f.items} /> : <Empty icon={<SearchIcon size={40} />} title="Hech narsa topilmadi" text="Filtrlarni o‘zgartirib ko‘ring" />}
    </div>
  )
}

/* ---------- Search ---------- */
export function SearchPage() {
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [text, setText] = useState(q)
  const { recent, addRecent, clearRecent } = useStore()
  const products = useStore((s) => s.products).filter((p) => !p.hidden)
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => { if (!q) input.current?.focus() }, [q])

  const norm = (s: string) => s.toLowerCase().replace(/[‘’'`ʻ]/g, '')
  const results = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean)
    if (!words.length) return []
    return products.filter((p) => {
      const hay = norm(`${p.title} ${p.brand} ${categories.find((c) => c.id === p.cat)?.name}`)
      return words.every((w) => hay.includes(w))
    })
  }, [q, products])
  const f = useFiltered(results)
  const suggestions = text.trim()
    ? products.filter((p) => norm(p.title).includes(norm(text.trim()))).slice(0, 6)
    : []

  const go = (s: string) => { addRecent(s); setText(s); setParams({ q: s }, { replace: true }); input.current?.blur() }

  return (
    <div className="pb-28">
      <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-line bg-card/95 px-3 py-2.5 backdrop-blur-xl">
        <form onSubmit={(e) => { e.preventDefault(); go(text) }} className="flex h-11 flex-1 items-center gap-2 rounded-2xl border-2 border-brand-600 px-3">
          <SearchIcon size={19} className="text-brand-600" />
          <input ref={input} value={text} onChange={(e) => setText(e.target.value)} enterKeyHint="search" placeholder="Masalan: muzlatgich Samsung" className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted" />
          {text ? <button type="button" onClick={() => { setText(''); setParams({}); input.current?.focus() }} aria-label="Tozalash"><X size={18} className="text-muted" /></button> : <Mic size={18} className="text-muted" />}
        </form>
        <button onClick={() => nav(-1)} className="text-[14px] font-semibold text-brand-600 dark:text-brand-200">Bekor</button>
      </div>

      {q && text === q ? (
        <>
          <div className="px-4 pt-3 text-[13px] text-muted">«{q}» bo‘yicha {results.length} ta natija</div>
          {results.length ? (<><Toolbar f={f} base={results} /><ProductGrid items={f.items} /></>) : (
            <Empty icon={<SearchIcon size={40} />} title="Hech narsa topilmadi" text="Boshqa so‘z bilan qidirib ko‘ring yoki katalogga o‘ting" />
          )}
        </>
      ) : suggestions.length ? (
        <div className="bg-card">
          {suggestions.map((p) => (
            <button key={p.id} onClick={() => go(p.title)} className="flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left text-[14px]">
              <SearchIcon size={16} className="text-muted" /> <span className="flex-1 truncate">{p.title}</span> <ChevronRight size={16} className="text-muted" />
            </button>
          ))}
        </div>
      ) : (
        <div className="px-4 pt-4">
          {recent.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Oldingi qidiruvlar</h3>
                <button onClick={clearRecent} className="text-sm text-muted">Tozalash</button>
              </div>
              <div className="mt-2">
                {recent.map((r) => (
                  <button key={r} onClick={() => go(r)} className="flex w-full items-center gap-3 py-2.5 text-[15px]"><Clock size={17} className="text-muted" /> {r}</button>
                ))}
              </div>
            </>
          )}
          <h3 className="mt-5 font-bold">Ommabop</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Avangard', 'Ziffler', 'Inverter', 'Changyutgich', 'Kir yuvish', 'Kuler', 'Printer', 'Noutbuk'].map((t) => (
              <button key={t} onClick={() => go(t)} className="rounded-full bg-card px-3.5 py-2 text-[13px] font-medium">{t}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
