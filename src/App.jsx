import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import LandingPage from './pages/landing/LandingPage'

function App() {
  useEffect(() => {
    const base = import.meta.env.BASE_URL || '/'
    const normalizedBase = base.endsWith('/') ? base : `${base}/`
    const pathname = window.location.pathname
    const relativePath = pathname.startsWith(normalizedBase)
      ? pathname.slice(normalizedBase.length - 1)
      : pathname
    const isValidRoute =
      relativePath === '/' ||
      relativePath === ''

    if (!isValidRoute) {
      window.history.replaceState(null, '', normalizedBase)
    }
  }, [])

  return (
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  )
}

export default App
