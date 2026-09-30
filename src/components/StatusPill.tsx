import type { ApplicationStatus } from '../types'
const TONE: Partial<Record<ApplicationStatus, string>> = { 'Offer Received': '!bg-emerald-100 !text-emerald-700', 'Visa Approved': '!bg-emerald-100 !text-emerald-700', Rejected: '!bg-red-100 !text-red-700', Draft: '!bg-stone-200 !text-stone-600' }
export default function StatusPill({ status }: { status: ApplicationStatus }) { return <span className={`pill ${TONE[status] ?? ''}`}>{status}</span> }
