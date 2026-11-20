import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AdminPanel, BossPanel } from './pages/Admin'
import { startSync, useStore } from './store'

/** Admin va Boshliq panellari — xaridorlar ilovasidan alohida sahifalar. */
function PanelShell({ role }: { role: 'admin' | 'boss' }) {
  const dark = useStore((s) => s.dark)
  const toast = useStore((s) => s.toast)
  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])
  useEffect(() => { startSync() }, [])
  return (
    <div className="bg-app relative mx-auto min-h-dvh max-w-[720px]">
      {role === 'boss' ? <BossPanel /> : <AdminPanel />}
      {toast && (
        <div className="animate-rise fixed inset-x-0 bottom-8 z-50 mx-auto w-fit rounded-2xl bg-[#15131f]/90 px-4 py-2.5 text-[13.5px] font-medium text-white shadow-xl backdrop-blur">
          {toast}
        </div>
      )}
    </div>
  )
}

export function mountPanel(role: 'admin' | 'boss') {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <PanelShell role={role} />
    </StrictMode>,
  )
}
