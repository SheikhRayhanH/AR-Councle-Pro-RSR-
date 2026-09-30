import type { LucideIcon } from 'lucide-react'
interface Props { icon: LucideIcon; label: string; value: number; change: string; up?: boolean }
export default function KpiCard({ icon: Icon, label, value, change, up = true }: Props) {
  return (
    <div className="card transition hover:-translate-y-1 hover:shadow-md">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-soft text-pri"><Icon size={18} /></div>
      <div className="mt-3 text-3xl font-extrabold tracking-tight">{value}</div>
      <div className="text-sm text-mut">{label}</div>
      <div className={`mt-2 text-xs font-semibold ${up ? 'text-emerald-600' : 'text-amber-600'}`}>{change} <span className="font-medium text-mut">vs last month</span></div>
    </div>)
}
