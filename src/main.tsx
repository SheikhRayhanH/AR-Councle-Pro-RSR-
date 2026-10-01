import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
try { const t = localStorage.getItem('arcp-theme'); if (t) document.documentElement.dataset.theme = t } catch { /* ignore */ }
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
