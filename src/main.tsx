import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './lib/i18n'
import { AuthProvider } from './lib/auth'
import { CartProvider } from './lib/cart'

/** Fades out the loading screen from index.html once the site has drawn. */
function HideSplash() {
  useEffect(() => {
    const splash = document.getElementById('splash')
    if (!splash) return
    requestAnimationFrame(() => {
      splash.classList.add('hide')
      setTimeout(() => splash.remove(), 400)
    })
  }, [])
  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <App />
            <HideSplash />
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
