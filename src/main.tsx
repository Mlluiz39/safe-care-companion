import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,
  onRegistered(r) {
    console.log("SW registrado:", r)
  },
  onRegisterError(error) {
    console.error("Erro ao registrar SW:", error)
  }
})


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(reg => console.log('Service Worker registrado', reg))
      .catch(err => console.log('Erro ao registrar SW:', err))
  })
}


createRoot(document.getElementById('root')!).render(<App />)
