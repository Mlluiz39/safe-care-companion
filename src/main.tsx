import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => console.log('Service Worker registrado'))
      .catch(err => console.log('Erro ao registrar SW:', err))
  })
}

createRoot(document.getElementById('root')!).render(<App />)
