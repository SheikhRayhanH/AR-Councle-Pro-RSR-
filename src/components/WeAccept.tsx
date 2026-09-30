import type { ReactNode } from 'react'
import { Building2 } from 'lucide-react'
import { BANKS, METHODS, type Method } from '../data/payments'
const Group = ({ title, children }: { title: string; children: ReactNode }) => <div className="mt-4"><p className="mb-2 text-xs text-mut">{title}</p><div className="flex flex-wrap gap-2.5">{children}</div></div>
const Mark = ({ m }: { m: Method }) => <span className="inline-flex h-10 items-center rounded-xl border border-line px-4 text-sm font-extrabold" style={{ background: m.bg, color: m.fg }}>{m.name}</span>
export default function WeAccept() {
  return (
    <section className="card">
      <h2 className="font-bold">We accept</h2><p className="text-xs text-mut">Pay your service fees with any of these methods</p>
      <Group title="Mobile banking">{METHODS.filter((m) => m.group === 'Mobile banking').map((m) => <Mark key={m.name} m={m} />)}</Group>
      <Group title="Cards">{METHODS.filter((m) => m.group === 'Card').map((m) => <Mark key={m.name} m={m} />)}</Group>
      <Group title="Bank transfer and cash">{BANKS.map((b) => <span key={b} className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-bg px-4 text-sm font-semibold"><Building2 size={15} className="text-pri" />{b}</span>)}</Group>
    </section>)
}
