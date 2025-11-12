import { HashRouter, Route, Routes } from 'react-router-dom'
import DeveloperPage from './pages/developer/DeveloperPage'
import LandingPage from './pages/landing/LandingPage'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/developer" element={<DeveloperPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
