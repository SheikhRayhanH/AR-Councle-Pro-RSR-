import { ChevronLeft, ChevronRight } from 'lucide-react'
interface Props { page: number; total: number; per: number; onChange: (p: number) => void }
export default function Pagination({ page, total, per, onChange }: Props) {
  const pages = Math.max(1, Math.ceil(total / per))
  return (
    <div className="mt-4 flex items-center justify-end gap-2 text-sm">
      <button className="btn-ghost !px-2.5" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
      <span className="text-mut">Page {page} of {pages}</span>
      <button className="btn-ghost !px-2.5" disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
    </div>)
}
