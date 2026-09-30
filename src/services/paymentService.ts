import type { Payment } from '../types'
import { initialPayments } from '../data/payments'
// Swap for real API calls later. The backend must also enforce admin-only access.
let db: Payment[] = [...initialPayments]
const wait = <T>(v: T, ms = 350) => new Promise<T>((r) => setTimeout(() => r(v), ms))
export const paymentService = {
  list: () => wait([...db]),
  create: (i: Omit<Payment, 'id' | 'date'>) => { const p: Payment = { ...i, id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10) }; db = [p, ...db]; return wait(p) },
}
