import { useEffect, useState, type FormEvent } from 'react'
import { useStudents } from '../hooks/useStudents'
import { useToast } from '../hooks/useToast'
import { HINTS, METHODS, PURPOSES } from '../data/payments'
import { paymentService } from '../services/paymentService'
import type { Payment } from '../types'
const fm = (n: number) => '৳ ' + n.toLocaleString('en-IN')
export default function Payments() {
  const { students } = useStudents()
  const toast = useToast()
  const [rows, setRows] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [method, setMethod] = useState(METHODS[0])
  const [student, setStudent] = useState('')
  const [purpose, setPurpose] = useState(PURPOSES[0])
  const [amount, setAmount] = useState('')
  const [ref, setRef] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => { paymentService.list().then((r) => { setRows(r); setLoading(false) }) }, [])
  const sum = (s: Payment['status']) => rows.filter((r) => r.status === s).reduce((a, r) => a + r.amount, 0)
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const who = student || students[0]?.name
    const a = Number(amount)
    if (!who) return toast('Add a student first', 'err')
    if (!(a > 0)) return toast('Enter an amount greater than 0', 'err')
    setBusy(true)
    const p = await paymentService.create({ student: who, purpose, method: method.name, amount: a, status: method.group === 'Card' ? 'Pending' : 'Paid', reference: ref })
    setRows((r) => [p, ...r]); setAmount(''); setRef(''); setBusy(false); toast(`Payment recorded for ${who}`)
  }
  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-extrabold">Payments</h1><p className="text-sm text-mut">Admin only. Collect and track student payments in BDT.</p></div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[['Received', fm(sum('Paid'))], ['Pending', fm(sum('Pending'))], ['Payments recorded', String(rows.length)]].map(([l, v]) => <div key={l} className="card"><div className="text-xs text-mut">{l}</div><div className="mt-1 text-2xl font-extrabold">{v}</div></div>)}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <form onSubmit={submit} className="card xl:col-span-2">
          <h2 className="font-bold">Collect payment</h2><p className="mb-3 text-xs text-mut">Choose how the student is paying</p>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
            {METHODS.map((m) => (
              <button type="button" key={m.name} aria-pressed={m.name === method.name} onClick={() => setMethod(m)} className={`flex items-center gap-2 rounded-xl border bg-bg p-2.5 text-left text-sm font-bold ${m.name === method.name ? 'border-pri ring-2 ring-pri/20' : 'border-line'}`}>
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-line" style={{ background: m.bg, color: m.fg }}>{m.mark}</span>{m.name}
              </button>))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <select className="input" aria-label="Student" value={student} onChange={(e) => setStudent(e.target.value)}>{students.map((s) => <option key={s.id}>{s.name}</option>)}</select>
            <select className="input" aria-label="Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)}>{PURPOSES.map((p) => <option key={p}>{p}</option>)}</select>
            <input className="input" type="number" min="1" placeholder="Amount (BDT)" aria-label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <input className="input" placeholder="Transaction ID / reference" aria-label="Reference" value={ref} disabled={method.group === 'Cash'} onChange={(e) => setRef(e.target.value)} />
          </div>
          <p className="mt-2 text-xs text-mut">{HINTS[method.group]}</p>
          <button className="btn mt-4" disabled={busy}>{busy ? 'Saving...' : 'Record payment'}</button>
        </form>
        <div className="card"><h2 className="mb-2 font-bold">Recent payments</h2>
          {loading && <div className="h-24 animate-pulse rounded-lg bg-soft" />}
          <ul>{rows.map((p) => <li key={p.id} className="flex items-center justify-between gap-2 border-b border-line py-3 last:border-0"><div><b className="block text-sm">{p.student}</b><span className="text-xs text-mut">{p.purpose} · {p.method}</span></div><div className="text-right"><b className="block text-sm">{fm(p.amount)}</b><span className={`pill ${p.status === 'Paid' ? '!bg-emerald-100 !text-emerald-700' : '!bg-amber-100 !text-amber-700'}`}>{p.status}</span></div></li>)}</ul>
        </div>
      </div>
    </div>)
}
