const ENDPOINT = 'https://api.web3forms.com/submit'
export async function sendContact(data: FormData): Promise<void> {
  const key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined
  if (!key || key === 'YOUR_WEB3FORMS_ACCESS_KEY') throw new Error('The contact form is not set up yet. Add VITE_WEB3FORMS_ACCESS_KEY to your .env file.')
  data.append('access_key', key)
  data.append('from_name', 'AR Councle Pro')
  const res = await fetch(ENDPOINT, { method: 'POST', body: data })
  const json = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || 'Your message could not be sent. Please try again.')
}
