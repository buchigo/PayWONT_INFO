import { useEffect, useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
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

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
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
    <header className="topnav" data-scrolled={scrolled ? 'true' : 'false'}>
      <div className="topnav__inner">
        <div className="topnav__brand">
          <Link className="topnav__brand-link" to="/developer">{'PayWONT ' + '\uAC1C\uBC1C\uC790'}</Link>
        </div>

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
                <a href="#payment" className="topnav__menu-item" onClick={(e) => smoothAnchor(e, '#payment')}>{'\uACB0\uC81C'} API</a>
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
            <a href="#payment" onClick={(e) => smoothAnchor(e, '#payment')}>Payment API</a>
            <a href="#console" onClick={(e) => smoothAnchor(e, '#console')}>Operations Console</a>
          </div>
          <a href="#checklist" onClick={(e) => smoothAnchor(e, '#checklist')}>{'\uCCB4\uD06C\uB9AC\uC2A4\uD2B8'}</a>
          <a href="#contact" onClick={(e) => smoothAnchor(e, '#contact')}>{'\uBB38\uC758'}</a>
          <Link to="/" className="topnav__mobile-home">{'\uD648\uC73C\uB85C'}</Link>
        </div>
      </div>
    </header>
  )
}
