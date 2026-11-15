import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { CreditCard, MapPin, Store, Truck, Banknote, CircleCheck, Smartphone } from 'lucide-react'
import PayCard from '../components/PayCard'
import { cartLines, cartTotals, useStore } from '../store'
import { PrimaryButton, TopBar } from '../components/ui'
import { ProductImage } from '../components/ProductArt'
import { tintFor } from '../components/ProductCard'
import { som } from '../format'

export default function Checkout() {
  const nav = useNavigate()
  const cart = useStore((s) => s.cart)
  const city = useStore((s) => s.city)
  const placeOrder = useStore((s) => s.placeOrder)
  const products = useStore((s) => s.products)
  const t = cartTotals(cart, products)
  const lines = cartLines(cart, products).filter((l) => l.checked)
  const [mode, setMode] = useState<'courier' | 'pickup'>('courier')
  const [pay, setPay] = useState<'transfer' | 'card' | 'cash'>('transfer')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('+998 ')
  const [addr, setAddr] = useState('')
  const valid = name.trim().length > 1 && phone.replace(/\D/g, '').length >= 12 && (mode === 'pickup' || addr.trim().length > 3)

  const [sending, setSending] = useState(false)
  const submit = async () => {
    setSending(true)
    const id = await placeOrder({
      total: t.sum,
      payment: pay === 'transfer' ? 'Kartaga o‘tkazma (Click/Payme)' : pay === 'card' ? 'Karta orqali (terminal)' : 'Qabul qilganda naqd',
      customer: name.trim(),
      phone: phone.trim(),
      address: mode === 'pickup' ? `${city}, Avangard topshirish punkti` : `${city}, ${addr}`,
    })
    setSending(false)
    if (id) nav(`/success/${id}`, { replace: true, state: { transfer: pay === 'transfer', total: t.sum } })
  }

  if (!lines.length) return <div className="p-10 text-center">Savat bo‘sh</div>

  return (
    <div className="pb-32">
      <TopBar title="Rasmiylashtirish" />

      <Card title="Qabul qilish usuli">
        <div className="grid grid-cols-2 gap-1 rounded-2xl bg-chip p-1">
          {([['courier', 'Kuryer', Truck], ['pickup', 'Topshirish punkti', Store]] as const).map(([k, l, I]) => (
            <button key={k} onClick={() => setMode(k)} className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-semibold transition ${mode === k ? 'bg-card shadow-sm' : 'text-muted'}`}>
              <I size={16} /> {l}
            </button>
          ))}
        </div>
        {mode === 'courier' ? (
          <Field icon={<MapPin size={18} />} placeholder={`${city}, ko‘cha, uy, xonadon`} value={addr} onChange={setAddr} />
        ) : (
          <div className="mt-3 rounded-2xl border border-line p-3 text-[13px]">
            <div className="font-semibold">Avangard — {city} markaziy punkt</div>
            <div className="text-muted">Operator manzil va vaqtni aytadi</div>
          </div>
        )}
        <div className="mt-3 flex items-center gap-2 text-[13px] text-ok"><CircleCheck size={16} /> Buyurtmadan keyin operator qo‘ng‘iroq qiladi</div>
      </Card>

      <Card title="Qabul qiluvchi">
        <Field placeholder="Ism va familiya" value={name} onChange={setName} />
        <Field placeholder="+998 __ ___ __ __" value={phone} onChange={(v) => setPhone(v.startsWith('+998') ? v : '+998 ')} type="tel" />
      </Card>

      <Card title="To‘lov usuli">
        {([
          ['transfer', 'Click / Payme orqali', 'Kartaga o‘tkazma', Smartphone],
          ['card', 'Karta orqali', 'Qabul qilganda terminal orqali', CreditCard],
          ['cash', 'Qabul qilganda', 'Naqd yoki terminal', Banknote],
        ] as const).map(([k, l, s, I]) => (
          <button key={k} onClick={() => setPay(k)} className={`mb-2 flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${pay === k ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-900/30' : 'border-line'}`}>
            <span className="grid size-10 place-items-center rounded-xl bg-chip"><I size={20} /></span>
            <span className="flex-1">
              <span className="block text-[14px] font-semibold">{l}</span>
              <span className="block text-[12.5px] text-muted">{s}</span>
            </span>
            <span className={`size-5 rounded-full border-2 ${pay === k ? 'border-[6px] border-brand-600' : 'border-gray-300'}`} />
          </button>
        ))}
        {pay === 'transfer' && <PayCard note={<>Buyurtma bergach, shu kartaga Click yoki Payme orqali <b>{som(t.sum)}</b> ga teng summani so‘mda o‘tkazing. Aniq summani operator tasdiqlaydi.</>} />}
      </Card>

      <Card title={`Mahsulotlar · ${t.count}`}>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {lines.map((l) => (
            <div key={l.id + l.color} className="relative grid size-16 shrink-0 place-items-center rounded-xl" style={{ background: tintFor(l.p.cat) }}>
              <ProductImage p={l.p} color={l.color} className="size-14" />
              {l.qty > 1 && <span className="absolute -top-1 -right-1 rounded-full bg-[#15131f] px-1.5 text-[10px] font-bold text-white">×{l.qty}</span>}
            </div>
          ))}
        </div>
        {t.saved > 0 && <div className="mt-3 flex justify-between text-[14px]"><span className="text-muted">Tejadingiz</span><span className="font-semibold text-[#e5322f]">{som(t.saved)}</span></div>}
      </Card>

      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[520px] border-t border-line bg-card/95 px-3 pt-3 backdrop-blur-xl">
        <PrimaryButton disabled={!valid || sending} onClick={submit}>
          {sending ? 'Yuborilmoqda…' : <>Buyurtma berish · {som(t.sum)}</>}
        </PrimaryButton>
        {!valid && <p className="mt-1.5 text-center text-[11.5px] text-muted">Ism, telefon{mode === 'courier' ? ' va manzil' : ''}ni kiriting</p>}
      </div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-2 mt-2 rounded-3xl bg-card p-4">
      <h2 className="mb-3 text-[16px] font-bold">{title}</h2>
      {children}
    </section>
  )
}

function Field({ icon, placeholder, value, onChange, type = 'text' }: { icon?: React.ReactNode; placeholder: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="mt-3 flex h-12 items-center gap-2 rounded-2xl bg-chip px-3 focus-within:ring-2 focus-within:ring-brand-600">
      {icon && <span className="text-muted">{icon}</span>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-full flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted" />
    </label>
  )
}
