import { useEffect, useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import './TopNav.css'

function Burger() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false)
  const [navAlpha, setNavAlpha] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, isDarkMode, toggleTheme } = useTheme()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0
      const threshold = 120
      const a = Math.max(0, Math.min(1, y / threshold))
      setNavAlpha(a)
      setScrolled(y > 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // Close mobile menu on route change
    setMobileOpen(false)
  }, [location.pathname])

  const smoothAnchor = useCallback((e, href) => {
    e.preventDefault()
    if (!href || !href.startsWith('#')) return
    const id = href.slice(1)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setMobileOpen(false)
  }, [])

  return (
    <header
      className="topnav"
      data-scrolled={scrolled ? 'true' : 'false'}
      style={{ '--nav-bg-alpha': navAlpha }}
    >
      <div className="topnav__inner">
        <div className="topnav__brand">
          <Link className="topnav__brand-link" to="/developer">{'PayWONT Developer'}</Link>
        </div>

        <div className="topnav__right">
          <nav className="topnav__nav" aria-label={'\uC8FC\uC694 \uBA54\uB274'}>
            <ul className="topnav__list">
              <li className="topnav__item">
                <a href="#intro" className="topnav__link" onClick={(e) => smoothAnchor(e, '#intro')}>{'\uC18C\uAC1C'}</a>
              </li>
              <li className="topnav__item topnav__item--has-menu">
                <span className="topnav__link" role="button" tabIndex={0} aria-haspopup="true" aria-expanded="false">
                  {'\uC81C\uD488'} <ChevronDown />
                </span>
                <div className="topnav__menu" role="menu">
                  <a href="#sdk" className="topnav__menu-item" onClick={(e) => smoothAnchor(e, '#sdk')}>{'WONT ' + '\uC5D0\uC774\uC804\uD2B8'} SDK</a>
                  <Link to="/developer/payment-api" className="topnav__menu-item">{'\uACB0\uC81C'} API</Link>
                  <a href="#console" className="topnav__menu-item" onClick={(e) => smoothAnchor(e, '#console')}>{'\uC6B4\uC601 ' + '\uCF58\uC194'}</a>
                </div>
              </li>
              <li className="topnav__item">
                <a href="#checklist" className="topnav__link" onClick={(e) => smoothAnchor(e, '#checklist')}>{'\uCCB4\uD06C\uB9AC\uC2A4\uD2B8'}</a>
              </li>
              <li className="topnav__item">
                <a href="#contact" className="topnav__link" onClick={(e) => smoothAnchor(e, '#contact')}>{'\uBB38\uC758'}</a>
              </li>
            </ul>
          </nav>

          <div className="topnav__settings">
            <button
              type="button"
              className="topnav__settings-btn"
              aria-label="설정"
            >
              <SettingsIcon />
            </button>
            <div className="topnav__settings-menu">
              <div className="topnav__settings-item">
                <span className="topnav__settings-label">테마</span>
                <button
                  type="button"
                  className="topnav__theme-toggle"
                  onClick={toggleTheme}
                  aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
                  data-theme={isDarkMode ? 'dark' : 'light'}
                >
                  <span className="topnav__theme-toggle-track">
                    <span className="topnav__theme-toggle-thumb">
                      {isDarkMode ? <MoonIcon /> : <SunIcon />}
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <button type="button" className="topnav__burger" aria-label={'\uBAA8\uBC14\uC77C \uBA54\uB274'} onClick={() => setMobileOpen(!mobileOpen)}>
          <Burger />
        </button>
      </div>

      <div className="topnav__mobile" data-open={mobileOpen ? 'true' : 'false'}>
        <div className="topnav__mobile-inner">
          <a href="#intro" onClick={(e) => smoothAnchor(e, '#intro')}>{'\uC18C\uAC1C'}</a>
          <div className="topnav__mobile-group">
            <div className="topnav__mobile-label">{'\uC81C\uD488'}</div>
            <a href="#sdk" onClick={(e) => smoothAnchor(e, '#sdk')}>WONT Agent SDK</a>
            <Link to="/developer/payment-api">Payment API</Link>
            <a href="#console" onClick={(e) => smoothAnchor(e, '#console')}>Operations Console</a>
          </div>
          <a href="#checklist" onClick={(e) => smoothAnchor(e, '#checklist')}>{'\uCCB4\uD06C\uB9AC\uC2A4\uD2B8'}</a>
          <a href="#contact" onClick={(e) => smoothAnchor(e, '#contact')}>{'\uBB38\uC758'}</a>
          <div className="topnav__mobile-theme">
            <span className="topnav__settings-label">테마</span>
            <button
              type="button"
              className="topnav__theme-toggle"
              onClick={() => {
                toggleTheme()
                setMobileOpen(false)
              }}
              aria-label={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
              data-theme={isDarkMode ? 'dark' : 'light'}
            >
              <span className="topnav__theme-toggle-track">
                <span className="topnav__theme-toggle-thumb">
                  {isDarkMode ? <MoonIcon /> : <SunIcon />}
                </span>
              </span>
            </button>
          </div>
          <Link to="/" className="topnav__mobile-home">{'\uD648\uC73C\uB85C'}</Link>
        </div>
      </div>
    </header>
  )
}
