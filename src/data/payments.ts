import type { Payment } from '../types'
export interface Method { name: string; group: 'Mobile banking' | 'Card' | 'Bank' | 'Cash'; bg: string; fg: string; mark: string }
export const METHODS: Method[] = [
  { name: 'bKash', group: 'Mobile banking', bg: '#e2136e', fg: '#fff', mark: 'b' }, { name: 'Nagad', group: 'Mobile banking', bg: '#f47920', fg: '#fff', mark: 'N' },
  { name: 'Rocket', group: 'Mobile banking', bg: '#8c3494', fg: '#fff', mark: 'R' }, { name: 'Upay', group: 'Mobile banking', bg: '#ffd400', fg: '#12358a', mark: 'U' },
  { name: 'Visa', group: 'Card', bg: '#fff', fg: '#1a1f71', mark: 'V' }, { name: 'Mastercard', group: 'Card', bg: '#fff', fg: '#eb001b', mark: 'M' },
  { name: 'AMEX', group: 'Card', bg: '#016fd0', fg: '#fff', mark: 'A' }, { name: 'Bank Transfer', group: 'Bank', bg: '#0f766e', fg: '#fff', mark: 'B' }, { name: 'Cash', group: 'Cash', bg: '#475569', fg: '#fff', mark: '৳' },
]
export const BANKS = ['Dutch-Bangla Bank', 'BRAC Bank', 'City Bank', 'Islami Bank', 'Eastern Bank', 'Cash at office']
export const PURPOSES = ['Counseling fee', 'Application fee', 'Service charge', 'Visa processing']
export const HINTS: Record<Method['group'], string> = {
  'Mobile banking': 'Enter the Transaction ID (TrxID) the student received after sending money.',
  Card: 'Card payments finish on the payment gateway’s secure page. Card numbers are never typed into this app.',
  Bank: 'Enter the bank transfer reference number.', Cash: 'Cash receipt. No reference needed.',
}
export const initialPayments: Payment[] = [
  { id: 'p1', student: 'Rafiul Islam', purpose: 'Service charge', method: 'bKash', amount: 150000, status: 'Paid', date: '2026-09-28' },
  { id: 'p2', student: 'Nusrat Jahan', purpose: 'Application fee', method: 'Nagad', amount: 35000, status: 'Paid', date: '2026-09-27' },
  { id: 'p3', student: 'Tanvir Ahmed', purpose: 'Service charge', method: 'Visa', amount: 25000, status: 'Pending', date: '2026-09-26' },
  { id: 'p4', student: 'Mehedi Hasan', purpose: 'Visa processing', method: 'Bank Transfer', amount: 80000, status: 'Paid', date: '2026-09-24' },
]
