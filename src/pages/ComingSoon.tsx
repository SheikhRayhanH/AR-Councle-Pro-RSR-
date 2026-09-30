import { Hammer } from 'lucide-react'
export default function ComingSoon({ title }: { title: string }) {
  return <div className="card grid place-items-center gap-2 py-20 text-center"><Hammer className="text-pri" /><h1 className="text-xl font-extrabold">{title}</h1><p className="max-w-sm text-sm text-mut">This page is planned for the next step of the build.</p></div>
}
