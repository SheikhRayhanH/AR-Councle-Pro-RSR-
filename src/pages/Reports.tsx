import { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Download, Printer } from 'lucide-react'
import { useStudents } from '../hooks/useStudents'
import { useTeam } from '../hooks/useTeam'
import { useToast } from '../hooks/useToast'
import { paymentService } from '../services/paymentService'
import { TREND } from '../data/mock'
const WON = ['Offer Received', 'Visa Processing', 'Visa Approved']
const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0)
export default function Reports() {
  const { students } = useStudents()
  const { counselors } = useTeam()
  const toast = useToast()
  const [paid, setPaid] = useState(0)
  useEffect(() => { paymentService.list().then((r) => setPaid(r.filter((p) => p.status === 'Paid').reduce((a, p) => a + p.amount, 0))) }, [])
  const d = useMemo(() => {
    const applied = students.filter((s) => s.status !== 'Draft').length
    const offers = students.filter((s) => WON.includes(s.status)).length
    const visa = students.filter((s) => s.status === 'Visa Approved').length
    const byCountry = students.reduce<Record<string, number>>((a, s) => ({ ...a, [s.country]: (a[s.country] ?? 0) + 1 }), {})
    const countries = Object.entries(byCountry).map(([name, students]) => ({ name, students }))
    const perf = counselors.map((c) => { const m = students.filter((s) => s.counselor === c); return { name: c.split(' ')[0], students: m.length, offers: m.filter((s) => WON.includes(s.status)).length } })
    return { total: students.length, applied, offers, visa, countries, perf }
  }, [students, counselors])
  const csv = () => {
    const rows: string[][] = [['AR Councle Pro report'], ['Total students', String(d.total)], ['Applications', String(d.applied)], ['Offers', String(d.offers)], ['Visa approvals', String(d.visa)], ['Payments received (BDT)', String(paid)], [], ['Name', 'Counselor', 'Country', 'Subject', 'IELTS', 'Status'], ...students.map((s) => [s.name, s.counselor, s.country, s.subject, String(s.ielts), s.status])]
    const text = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['\uFEFF' + text], { type: 'text/csv;charset=utf-8' })); a.download = 'ar-councle-pro-students.csv'; a.click(); URL.revokeObjectURL(a.href)
    toast('Report downloaded')
  }
  const kpis: [string, string][] = [['Total Students', String(d.total)], ['Applications', String(d.applied)], ['Offers', String(d.offers)], ['Visa Approvals', String(d.visa)], ['Payments Received', '৳ ' + paid.toLocaleString('en-IN')]]
  const funnel: [string, number][] = [['Students', d.total], ['Applied', d.applied], ['Offers', d.offers], ['Visa approved', d.visa]]
  const axis = { tick: { fontSize: 11 }, stroke: 'var(--mut)' }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold">Reports & Analytics</h1><p className="text-sm text-mut">Admin only. Numbers update as you add students and change statuses.</p></div>
        <div className="flex gap-2 print:hidden"><button className="btn-ghost" onClick={() => window.print()}><Printer size={16} />Print</button><button className="btn" onClick={csv}><Download size={16} />Generate Report</button></div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">{kpis.map(([l, v]) => <div key={l} className="card"><div className="text-xs text-mut">{l}</div><div className="mt-1 text-2xl font-extrabold">{v}</div></div>)}</div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="card"><h2 className="mb-3 font-bold">Application Trends</h2>
          <ResponsiveContainer width="100%" height={240}><AreaChart data={TREND}><CartesianGrid stroke="var(--line)" vertical={false} /><XAxis dataKey="month" {...axis} /><YAxis width={28} {...axis} /><Tooltip /><Legend />
            <Area type="monotone" dataKey="applications" name="Applications" stroke="#1d4ed8" fill="#1d4ed8" fillOpacity={0.15} /><Area type="monotone" dataKey="offers" name="Offers" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.12} /><Area type="monotone" dataKey="visa" name="Visa Approved" stroke="#059669" fill="#059669" fillOpacity={0.12} /></AreaChart></ResponsiveContainer></div>
        <div className="card"><h2 className="mb-3 font-bold">Country Distribution</h2>
          <ResponsiveContainer width="100%" height={240}><BarChart data={d.countries}><CartesianGrid stroke="var(--line)" vertical={false} /><XAxis dataKey="name" {...axis} /><YAxis width={28} allowDecimals={false} {...axis} /><Tooltip /><Bar dataKey="students" name="Students" fill="#1d4ed8" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
        <div className="card"><h2 className="mb-3 font-bold">Counselor Performance</h2>
          <ResponsiveContainer width="100%" height={240}><BarChart data={d.perf}><CartesianGrid stroke="var(--line)" vertical={false} /><XAxis dataKey="name" {...axis} /><YAxis width={28} allowDecimals={false} {...axis} /><Tooltip /><Legend /><Bar dataKey="students" name="Students" fill="#94a3b8" radius={[6, 6, 0, 0]} /><Bar dataKey="offers" name="Offers or visa" fill="#059669" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
        <div className="card"><h2 className="mb-3 font-bold">Conversion Overview</h2>
          <div className="space-y-4">{funnel.map(([l, v]) => <div key={l}><div className="flex justify-between text-sm"><span>{l}</span><b>{v} <span className="font-medium text-mut">({pct(v, d.total)}%)</span></b></div><div className="mt-1 h-2.5 overflow-hidden rounded bg-line"><i className="block h-full rounded bg-pri" style={{ width: `${pct(v, d.total)}%` }} /></div></div>)}</div></div>
      </div>
    </div>)
}
