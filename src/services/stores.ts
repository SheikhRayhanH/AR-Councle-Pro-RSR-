import type { Application, University } from '../types'
import { APPLICATIONS, UNIVERSITIES } from '../data/mock'
// Generic in-memory store. Replace with real API calls later.
function makeStore<T extends { id: string }>(seed: T[]) {
  let db = [...seed]
  const wait = <V>(v: V, ms = 300) => new Promise<V>((r) => setTimeout(() => r(v), ms))
  return {
    list: () => wait([...db]),
    save: (v: Omit<T, 'id'> & { id?: string }) => { const item = { ...v, id: v.id ?? crypto.randomUUID() } as unknown as T; db = db.some((x) => x.id === item.id) ? db.map((x) => (x.id === item.id ? item : x)) : [item, ...db]; return wait(item) },
    remove: (id: string) => { db = db.filter((x) => x.id !== id); return wait(id) },
  }
}
export const universityStore = makeStore<University>(UNIVERSITIES)
export const applicationStore = makeStore<Application>(APPLICATIONS)
