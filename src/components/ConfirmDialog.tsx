import { useState } from 'react'
import Modal from './Modal'
interface Props { title: string; message: string; confirmLabel: string; onConfirm: () => Promise<void>; onClose: () => void }
export default function ConfirmDialog({ title, message, confirmLabel, onConfirm, onClose }: Props) {
  const [busy, setBusy] = useState(false)
  const go = async () => { setBusy(true); await onConfirm(); setBusy(false) }
  return (<Modal title={title} onClose={onClose}>
    <p className="text-sm text-mut">{message}</p>
    <div className="mt-5 flex justify-end gap-2"><button className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn !bg-red-600" disabled={busy} onClick={go}>{busy ? 'Deleting...' : confirmLabel}</button></div>
  </Modal>)
}
