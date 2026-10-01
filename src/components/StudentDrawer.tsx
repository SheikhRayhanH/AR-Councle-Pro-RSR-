import { useEffect, type ReactNode } from 'react'
import { FileText, Pencil, X } from 'lucide-react'
import type { Student } from '../types'
import StatusPill from './StatusPill'
const DOCS = ['Passport', 'SSC certificate', 'HSC certificate', 'Bachelor transcript', 'IELTS / PTE result']
const Row = ({ l, v }: { l: string; v: string | number }) => <div className="flex justify-between gap-4 border-b border-dashed border-line py-1.5 text-sm"><span className="text-mut">{l}</span><b className="text-right">{v || '-'}</b></div>
const Section = ({ title, children }: { title: string; children: ReactNode }) => <section className="mt-5"><h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-mut">{title}</h3>{children}</section>
export default function StudentDrawer({ s, onClose, onEdit }: { s: Student; onClose: () => void; onEdit: () => void }) {
  useEffect(() => { const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [onClose])
  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/50" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside role="dialog" aria-modal="true" aria-label={`${s.name} details`} className="h-full w-full max-w-md overflow-y-auto bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="text-xl font-extrabold">{s.name}</h2><div className="mt-1"><StatusPill status={s.status} /></div></div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1 hover:bg-soft"><X size={18} /></button>
        </div>
        <Section title="Personal information"><Row l="Email" v={s.email} /><Row l="Phone" v={s.phone} /><Row l="Date of birth" v={s.dob} /><Row l="Address" v={s.address} /></Section>
        <Section title="Academic background"><Row l="SSC (GPA)" v={s.ssc.toFixed(2)} /><Row l="HSC (GPA)" v={s.hsc.toFixed(2)} /><Row l="Bachelor (CGPA)" v={s.bachelor.toFixed(2)} /><Row l="Subject" v={s.subject} /></Section>
        <Section title="Study preferences"><Row l="Country" v={s.country} /><Row l="University" v={s.university} /><Row l="Budget" v={s.budget} /><Row l="IELTS / PTE" v={s.ielts.toFixed(1)} /><Row l="Intake" v={s.intake} /></Section>
        <Section title="Application information"><Row l="Status" v={s.status} /><Row l="Counselor" v={s.counselor} /><Row l="Added on" v={s.addedAt} /><Row l="Notes" v={s.notes} /></Section>
        <Section title="Documents">
          <ul>{DOCS.map((d) => <li key={d} className="flex items-center justify-between border-b border-dashed border-line py-1.5 text-sm"><span className="flex items-center gap-2"><FileText size={14} className="text-mut" />{d}</span><span className="pill !bg-stone-200 !text-stone-600">Not uploaded</span></li>)}</ul>
          <p className="mt-2 text-xs text-mut">Document upload will be available when the backend is connected.</p>
        </Section>
        <button className="btn mt-6" onClick={onEdit}><Pencil size={15} />Edit student</button>
      </aside>
    </div>)
}
