import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import { sendContact } from '../services/contactService'
import { useToast } from '../hooks/useToast'
const FIELDS = [['name', 'Name', 'text'], ['email', 'Email', 'email'], ['phone', 'Phone', 'tel'], ['subject', 'Subject', 'text']] as const
export default function ContactForm() {
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (busy) return
    const form = e.currentTarget
    setBusy(true); setError('')
    try { await sendContact(new FormData(form)); form.reset(); toast('Message sent. Thank you!') }
    catch (x) { setError(x instanceof Error ? x.message : 'Your message could not be sent. Please try again.') }
    finally { setBusy(false) }
  }
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      {FIELDS.map(([n, l, t]) => <input key={n} name={n} type={t} placeholder={l} aria-label={l} required={n !== 'phone'} className="input" />)}
      <textarea name="message" rows={3} required placeholder="Message" aria-label="Message" className="input sm:col-span-2" />
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
      {error && <p role="alert" className="text-sm font-medium text-red-600 sm:col-span-2">{error}</p>}
      <div className="sm:col-span-2"><button className="btn" disabled={busy}><Send size={16} />{busy ? 'Sending...' : 'Send Message'}</button></div>
    </form>)
}
