import { Link } from 'react-router-dom'
import { Heart, Plus, Star, Check } from 'lucide-react'
import { useState } from 'react'
import { ProductImage } from './ProductArt'
import { discount, type Product } from '../data/products'
import { useStore } from '../store'
import { som } from '../format'
import { categories } from '../data/products'

const badgeMap = {
  hit: ['Xit', 'bg-[#e5322f] text-white'],
  new: ['Yangi', 'bg-brand-600 text-white'],
  sale: ['Aksiya', 'bg-accent-400 text-black'],
  fast: ['1 kunda', 'bg-ok text-white'],
  original: ['Original', 'bg-[#15131f] text-white'],
} as const

export function tintFor(cat: string) {
  return categories.find((c) => c.id === cat)?.tint ?? '#EEF0F5'
}

export default function ProductCard({ p, wide = false }: { p: Product; wide?: boolean }) {
  const fav = useStore((s) => s.favs.includes(p.id))
  const toggleFav = useStore((s) => s.toggleFav)
  const addToCart = useStore((s) => s.addToCart)
  const inCart = useStore((s) => s.cart.some((c) => c.id === p.id))
  const [pop, setPop] = useState(0)
  const d = discount(p)

  return (
    <Link to={`/p/${p.id}`} className={`group animate-rise flex flex-col overflow-hidden rounded-2xl bg-card ${wide ? 'w-[46vw] max-w-[200px] shrink-0 snap-start-a' : ''}`}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl" style={{ background: tintFor(p.cat) }}>
        <div className="absolute inset-0 dark:bg-black/25" />
        <ProductImage p={p} className="absolute inset-0 m-auto h-[82%] w-[82%] transition duration-500 group-active:scale-95" />
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
          {d > 0 && <span className="rounded-md bg-[#e5322f] px-1.5 py-0.5 text-[11px] font-bold text-white">−{d}%</span>}
          {p.badges?.slice(0, 1).filter((b) => b !== 'sale').map((b) => (
            <span key={b} className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${badgeMap[b][1]}`}>{badgeMap[b][0]}</span>
          ))}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); toggleFav(p.id); setPop((x) => x + 1) }}
          className="absolute top-1.5 right-1.5 grid size-9 place-items-center rounded-full"
          aria-label="Sevimli"
        >
          <Heart key={pop} size={21} className={`${pop ? 'animate-pop' : ''} drop-shadow ${fav ? 'fill-[#e5322f] text-[#e5322f]' : 'text-gray-500/80'}`} />
        </button>
      </div>
      <div className="flex flex-1 flex-col px-2 pt-2 pb-2.5">
        <div className="mb-1 flex items-baseline gap-1.5">
          <span className="text-[16px] leading-tight font-extrabold">{som(p.price)}</span>
        </div>
        {p.oldPrice && <span className="-mt-1 mb-1 text-[12px] text-muted line-through">{som(p.oldPrice)}</span>}
        <h3 className="line-clamp-2 text-[13px] leading-[1.3] text-ink/90">{p.title}</h3>
        <div className="mt-1 flex items-center gap-1 text-[12px] text-muted">
          <Star size={12} className="fill-accent-400 text-accent-400" />
          <span className="font-medium text-ink/80">{p.rating}</span>
          <span>({p.reviews.toLocaleString('ru-RU')} sharh)</span>
        </div>
        <div className="mt-auto pt-2">
          <button
            onClick={(e) => { e.preventDefault(); addToCart(p.id) }}
            className={`flex h-9 w-full items-center justify-center gap-1 rounded-xl text-[13px] font-semibold transition active:scale-95 ${inCart ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-200' : 'bg-brand-600 text-white'}`}
          >
            {inCart ? <><Check size={16} /> Savatda</> : <><Plus size={16} /> Savatga</>}
          </button>
        </div>
      </div>
    </Link>
  )
}

export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-3 px-2 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((p) => <ProductCard key={p.id} p={p} />)}
    </div>
  )
}
