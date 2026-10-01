import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { BarChart3, BookOpen, Building2, CheckCircle2, FileText, Globe, GraduationCap, Hourglass, Plane, Sparkles, UserPlus, Users } from 'lucide-react'
import { useStudents } from '../hooks/useStudents'
import { useUser } from '../hooks/useAuth'
import { canView, seesAllStudents } from '../data/permissions'
import { useToast } from '../hooks/useToast'
import { ACTIVITIES, BASE, COUNTRIES, TREND } from '../data/mock'
import { AGENCY } from '../data/agency'
import type { ApplicationStatus, Page } from '../types'
import KpiCard from '../components/KpiCard'
import ContactForm from '../components/ContactForm'
import WeAccept from '../components/WeAccept'
export default function Dashboard({ onAddStudent, onGo }: { onAddStudent: () => void; onGo: (p: Page) => void }) {
  const { students: all } = useStudents()
  const user = useUser()
  const isAdmin = seesAllStudents(user.role)
  const students = useMemo(() => (isAdmin ? all : all.filter((s) => s.counselor === user.name)), [all, isAdmin, user.name])
  const B = isAdmin ? BASE : { students: 0, apps: 0, offers: 0, visa: 0, pending: 0 }
  const toast = useToast()
  const k = useMemo(() => {
    const n = (...s: ApplicationStatus[]) => students.filter((x) => s.includes(x.status)).length
    return { total: B.students + students.length, apps: B.apps + students.filter((x) => x.status !== 'Draft').length, offers: B.offers + n('Offer Received'), visa: B.visa + n('Visa Approved'), pending: B.pending + n('Applied', 'Submitted', 'In Process') }
  }, [students])
  const go = (p: Page) => (canView(user.role, p) ? onGo(p) : toast('Your role cannot open that page', 'err'))
  const soon = (t: string) => toast(`${t} is coming in the next step`)
  const actions = [{ l: 'Add New Student', i: UserPlus, f: onAddStudent }, { l: 'Add Application', i: FileText, f: () => go('applications') }, { l: 'Add University', i: Building2, f: () => go('universities') }, { l: 'Generate Report', i: BarChart3, f: () => go('reports') }]
  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-[#14307e] p-6 text-white shadow-lg sm:p-8">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Good Morning, {user.role === 'admin' ? 'Rayhan' : user.name.split(' ')[0]}! 👋</h1>
        <p className="mt-1 max-w-md text-[#c3d1ff]">Here's what's happening with your education consultancy today.</p>
        <div aria-hidden className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 gap-4 text-white/25 md:flex"><Globe size={60} /><GraduationCap size={60} /><Building2 size={60} /><BookOpen size={60} /><Plane size={60} /></div>
      </section>
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard icon={Users} label="Total Students" value={k.total} change="+12.5%" />
        <KpiCard icon={Sparkles} label="New Leads" value={24} change="+8.2%" />
        <KpiCard icon={FileText} label="Applications" value={k.apps} change="+5.4%" />
        <KpiCard icon={CheckCircle2} label="Offers" value={k.offers} change="+16.7%" />
        <KpiCard icon={Plane} label="Visa Approved" value={k.visa} change="+40%" />
        <KpiCard icon={Hourglass} label="Pending" value={k.pending} change="-4.1%" up={false} />
      </section>
      <section className="grid gap-4 xl:grid-cols-3">
        <div className="card xl:col-span-2">
          <h2 className="font-bold">Application Trend</h2><p className="mb-3 text-xs text-mut">January to December</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={TREND}><CartesianGrid stroke="var(--line)" vertical={false} /><XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--mut)" /><YAxis tick={{ fontSize: 11 }} stroke="var(--mut)" width={28} /><Tooltip />
              <Area type="monotone" dataKey="applications" name="Applications" stroke="#1d4ed8" fill="#1d4ed8" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="offers" name="Offers" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.12} strokeWidth={2} />
              <Area type="monotone" dataKey="visa" name="Visa Approved" stroke="#059669" fill="#059669" fillOpacity={0.12} strokeWidth={2} /></AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h2 className="font-bold">Country Preference</h2>
          <div className="relative mx-auto mt-2 h-44 w-44">
            <ResponsiveContainer><PieChart><Pie data={COUNTRIES} dataKey="value" innerRadius={58} outerRadius={82} paddingAngle={2} stroke="none">{COUNTRIES.map((c) => <Cell key={c.name} fill={c.color} />)}</Pie></PieChart></ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center text-center"><div><b className="block text-2xl">{k.total}</b><span className="text-xs text-mut">Students</span></div></div>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">{COUNTRIES.map((c) => <li key={c.name} className="flex justify-between"><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded" style={{ background: c.color }} />{c.name}</span><b>{c.value}%</b></li>)}</ul>
        </div>
      </section>
      <section className="grid gap-4 xl:grid-cols-3">
        <div className="card xl:col-span-2"><h2 className="mb-2 font-bold">Recent Activities</h2>
          <ul>{ACTIVITIES.map(([t, w, when], i) => <li key={i} className="flex items-center justify-between border-b border-line py-3 last:border-0"><div><b className="block text-sm">{t}</b><span className="text-xs text-mut">{w}</span></div><time className="text-xs text-mut">{when}</time></li>)}</ul></div>
        <div className="card"><h2 className="mb-3 font-bold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">{actions.map(({ l, i: Icon, f }) => <button key={l} onClick={f} className="flex flex-col items-start gap-2 rounded-xl border border-line bg-bg p-3 text-left text-sm font-semibold transition hover:-translate-y-0.5 hover:border-pri hover:bg-soft"><Icon size={18} className="text-pri" />{l}</button>)}</div></div>
      </section>
      <section className="card grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <div><h2 className="font-bold">Contact</h2><p className="my-2 text-sm text-mut">Have questions or need assistance?</p>
          <a className="block font-bold text-pri" href={`mailto:${AGENCY.email}`}>{AGENCY.email}</a><a className="mt-1 block font-bold text-pri" href={`tel:${AGENCY.phone}`}>{AGENCY.phone}</a></div>
        <ContactForm />
      </section>
      <WeAccept />
    </div>)
}
