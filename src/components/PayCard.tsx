import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { PAYMENT_CARD } from '../config'

/** To'lov kartasi: raqamni bir bosishda nusxalash. */
export default function PayCard({ note }: { note?: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_CARD.number.replace(/\s/g, ''))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // nusxalab bo'lmasa, raqam baribir belgilanadigan matn sifatida ko'rinadi
    }
  }
  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#15131f] to-brand-700 p-4 text-left text-white">
      <div className="flex items-center justify-between text-[12px] font-semibold tracking-wide opacity-80">
        <span>{PAYMENT_CARD.bank}</span>
        <span className="rounded-md bg-white/15 px-2 py-0.5">{PAYMENT_CARD.system}</span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="font-mono text-[17px] font-bold tracking-wide whitespace-nowrap tabular-nums select-all">{PAYMENT_CARD.number}</span>
        <button onClick={copy} className="flex shrink-0 items-center gap-1 rounded-xl bg-white px-2.5 py-2 text-[12.5px] font-bold text-black active:scale-95" aria-label="Karta raqamini nusxalash">
          {copied ? <><Check size={15} /> Nusxalandi</> : <><Copy size={15} /> Nusxalash</>}
        </button>
      </div>
      <div className="mt-2 text-[13px] opacity-85">{PAYMENT_CARD.holder}</div>
      {note && <div className="mt-3 rounded-xl bg-white/10 p-2.5 text-[12.5px] leading-snug">{note}</div>}
    </div>
  )
}
