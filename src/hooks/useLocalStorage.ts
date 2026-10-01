import { useState } from 'react'
export function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => { try { const r = localStorage.getItem(key); return r ? ({ ...(initial as object), ...JSON.parse(r) } as T) : initial } catch { return initial } })
  const set = (v: T) => { setValue(v); try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* ignore */ } }
  return [value, set]
}
