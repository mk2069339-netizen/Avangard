import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import { Catalog, CategoryPage, SearchPage } from './pages/Listing'
import { Favorites, Orders, Profile, Success } from './pages/Account'
import BottomNav from './components/BottomNav'
import { startSync, useStore } from './store'

function Shell() {
  const { pathname } = useLocation()
  const dark = useStore((s) => s.dark)
  const toast = useStore((s) => s.toast)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', dark ? '#18151f' : '#ffffff')
  }, [dark])
  useEffect(() => { startSync() }, [])
  useEffect(() => { if (!pathname.startsWith('/p/')) window.scrollTo(0, 0) }, [pathname])
  const hideNav = /^\/(p\/|checkout|success|search)/.test(pathname)

  return (
    <div className="bg-app relative mx-auto min-h-dvh max-w-[520px] shadow-[0_0_60px_rgba(0,0,0,.06)]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/c/:id" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/p/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success/:id" element={<Success />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="*" element={<Home />} />
      </Routes>
      {!hideNav && <BottomNav />}
      {toast && (
        <div className={`animate-rise fixed inset-x-0 z-50 mx-auto w-fit rounded-2xl bg-[#15131f]/90 px-4 py-2.5 text-[13.5px] font-medium text-white shadow-xl backdrop-blur ${hideNav ? 'bottom-24' : 'bottom-20'}`}>
          {toast}
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  )
}
