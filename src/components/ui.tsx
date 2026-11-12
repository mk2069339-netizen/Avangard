import { Star, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import mark from '../assets/mark.png'

export function Logo({ className = 'h-7' }: { className?: string }) {
  return <img src={logo} alt="Avangard" className={`${className} w-auto select-none dark:brightness-[1.5]`} draggable={false} />
}
export function Mark({ className = 'h-8' }: { className?: string }) {
  return <img src={mark} alt="" className={`${className} w-auto select-none dark:brightness-[1.8]`} draggable={false} />
}

export function Stars({ value, size = 12 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= Math.round(value) ? 'fill-accent-400 text-accent-400' : 'text-gray-300 dark:text-gray-600'} />
      ))}
    </span>
  )
}

export function TopBar({ title, right, back = true }: { title?: React.ReactNode; right?: React.ReactNode; back?: boolean }) {
  const nav = useNavigate()
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-card/90 px-2 backdrop-blur-xl">
      {back && (
        <button onClick={() => (history.length > 1 ? nav(-1) : nav('/'))} className="grid size-10 place-items-center rounded-full active:bg-chip" aria-label="Orqaga">
          <ChevronLeft size={24} />
        </button>
      )}
      <div className={`min-w-0 flex-1 truncate text-[17px] font-bold ${back ? '' : 'pl-2'}`}>{title}</div>
      {right}
    </header>
  )
}

export function Countdown({ className = '' }: { className?: string }) {
  const end = () => { const d = new Date(); d.setHours(24, 0, 0, 0); return d.getTime() }
  const [left, setLeft] = useState(end() - Date.now())
  useEffect(() => { const t = setInterval(() => setLeft(end() - Date.now()), 1000); return () => clearInterval(t) }, [])
  const s = Math.max(0, Math.floor(left / 1000))
  const parts = [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, '0'))
  return (
    <span className={`inline-flex items-center gap-1 font-mono tabular-nums ${className}`}>
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="rounded-md bg-[#15131f] px-1.5 py-0.5 text-[13px] font-bold text-white dark:bg-white dark:text-black">{p}</span>
          {i < 2 && <span className="font-bold">:</span>}
        </span>
      ))}
    </span>
  )
}

export function Empty({ icon, title, text, action }: { icon: React.ReactNode; title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="animate-rise flex flex-col items-center px-8 pt-20 text-center">
      <div className="mb-5 grid size-24 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-200">{icon}</div>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-muted">{text}</p>
      {action && <div className="mt-6 w-full">{action}</div>}
    </div>
  )
}

export function PrimaryButton({ children, className = '', ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest} className={`h-12 w-full rounded-2xl bg-brand-600 px-5 text-[15px] font-semibold text-white shadow-lg shadow-brand-600/25 transition active:scale-[.98] active:bg-brand-700 disabled:opacity-40 ${className}`}>
      {children}
    </button>
  )
}

export function Section({ title, action, children }: { title: React.ReactNode; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="text-[19px] font-extrabold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}
