import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
type Toast = (text: string, kind?: 'ok' | 'err') => void
const Ctx = createContext<Toast>(() => {})
export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<{ text: string; kind: 'ok' | 'err' } | null>(null)
  const toast = useCallback<Toast>((text, kind = 'ok') => { setMsg({ text, kind }); setTimeout(() => setMsg(null), 2600) }, [])
  return (<Ctx.Provider value={toast}>{children}
    {msg && <div role="status" className={`fixed bottom-5 right-5 z-50 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${msg.kind === 'ok' ? 'bg-navy' : 'bg-red-600'}`}>{msg.text}</div>}
  </Ctx.Provider>)
}
export const useToast = () => useContext(Ctx)
