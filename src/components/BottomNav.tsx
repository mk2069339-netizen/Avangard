import { NavLink } from 'react-router-dom'
import { House, LayoutGrid, ShoppingCart, Heart, User } from 'lucide-react'
import { useStore } from '../store'

const tabs = [
  { to: '/', label: 'Bosh sahifa', icon: House },
  { to: '/catalog', label: 'Katalog', icon: LayoutGrid },
  { to: '/cart', label: 'Savat', icon: ShoppingCart },
  { to: '/favorites', label: 'Saralangan', icon: Heart },
  { to: '/profile', label: 'Kabinet', icon: User },
]

export default function BottomNav() {
  const count = useStore((s) => s.cart.reduce((a, c) => a + c.qty, 0))
  const favs = useStore((s) => s.favs.length)
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[520px] border-t border-line bg-card/90 backdrop-blur-xl">
      <ul className="grid grid-cols-5">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink to={to} end={to === '/'} className={({ isActive }) => `flex flex-col items-center gap-0.5 pt-2 pb-1 text-[10.5px] font-medium transition ${isActive ? 'text-brand-600 dark:text-brand-200' : 'text-muted'}`}>
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <Icon size={24} strokeWidth={isActive ? 2.4 : 1.8} className={isActive && to === '/favorites' ? 'fill-current' : ''} />
                    {to === '/cart' && count > 0 && (
                      <span key={count} className="animate-pop absolute -top-1.5 -right-2.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#e5322f] px-1 text-[10px] font-bold text-white ring-2 ring-[var(--card)]">{count}</span>
                    )}
                    {to === '/favorites' && favs > 0 && !isActive && <span className="absolute -top-0.5 -right-1 size-2 rounded-full bg-[#e5322f]" />}
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
