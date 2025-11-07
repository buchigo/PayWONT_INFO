import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [isHeroPassed, setIsHeroPassed] = useState(false)
  const [hasSnappedFromHero, setHasSnappedFromHero] = useState(false)
  const heroRef = useRef(null)
  const entryRef = useRef(null)
  const snappingRef = useRef(false)
  const hasSnappedRef = useRef(hasSnappedFromHero)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    hasSnappedRef.current = hasSnappedFromHero
  }, [hasSnappedFromHero])

  const snapToEntry = useCallback(() => {
    if (snappingRef.current) return
    snappingRef.current = true
    const target = entryRef.current
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setHasSnappedFromHero(true)
    setTimeout(() => {
      snappingRef.current = false
    }, 600)
  }, [])

  const snapToHero = useCallback(() => {
    if (snappingRef.current) return
    snappingRef.current = true
    const target = heroRef.current
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setTimeout(() => {
      snappingRef.current = false
    }, 600)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const trigger = window.innerHeight * 0.1
      setIsHeroPassed(currentY > trigger)

      if (currentY < 4) {
        setHasSnappedFromHero(false)
      }

      const lastY = lastScrollYRef.current
      const isScrollingUp = currentY < lastY
      const hero = heroRef.current
      if (isScrollingUp && hero && !snappingRef.current) {
        const heroBottom = hero.getBoundingClientRect().bottom
        if (heroBottom >= -window.innerHeight * 0.15 && heroBottom <= 24) {
          snapToHero()
        }
      }

      lastScrollYRef.current = currentY
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [snapToHero])

  useEffect(() => {
    const shouldInterceptDown = () => {
      if (snappingRef.current || hasSnappedRef.current) return false
      const hero = heroRef.current
      const heroHeight = hero?.offsetHeight ?? window.innerHeight
      return window.scrollY <= heroHeight * 0.25
    }

    const shouldInterceptUp = () => {
      if (snappingRef.current || !hasSnappedRef.current) return false
      const entry = entryRef.current
      if (!entry) return false
      const entryTop = entry.getBoundingClientRect().top
      return entryTop >= -40 && entryTop <= window.innerHeight * 0.6
    }

    let touchStartY = 0
    let touchActive = false

    const handleWheel = (event) => {
      if (event.deltaY > 0 && shouldInterceptDown()) {
        event.preventDefault()
        snapToEntry()
      } else if (event.deltaY < 0 && shouldInterceptUp()) {
        event.preventDefault()
        snapToHero()
      }
    }

    const handleKeyDown = (event) => {
      let direction = null
      if (event.code === 'Space') {
        direction = event.shiftKey ? 'up' : 'down'
      } else if (['PageDown', 'ArrowDown'].includes(event.code)) {
        direction = 'down'
      } else if (['PageUp', 'ArrowUp'].includes(event.code)) {
        direction = 'up'
      }

      if (direction === 'down' && shouldInterceptDown()) {
        event.preventDefault()
        snapToEntry()
      } else if (direction === 'up' && shouldInterceptUp()) {
        event.preventDefault()
        snapToHero()
      }
    }

    const handleTouchStart = (event) => {
      touchActive = true
      touchStartY = event.touches[0]?.clientY ?? 0
    }

    const handleTouchMove = (event) => {
      if (!touchActive) return
      const currentY = event.touches[0]?.clientY ?? 0
      const delta = touchStartY - currentY

      if (delta > 12 && shouldInterceptDown()) {
        event.preventDefault()
        touchActive = false
        snapToEntry()
      } else if (delta < -12 && shouldInterceptUp()) {
        event.preventDefault()
        touchActive = false
        snapToHero()
      }
    }

    const handleTouchEnd = () => {
      touchActive = false
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [snapToEntry, snapToHero])

  const menuItems = [
    { href: '#intro', label: '소개' },
    { href: '#buchigo', label: 'Buchigo' },
    { href: '#developers', label: 'Developers' },
  ]

  const footerHighlights = [
    'High-performance creative commerce experiences for photographers, designers, and agencies.',
    'Immersive showcase storytelling aligned with PayWONT\'s glassmorphic onboarding.',
    'Lifecycle support that blends strategy, design, and deployment on BuchiGo infrastructure.',
  ]

  const footerLinks = [
    {
      title: 'Partner with BuchiGo',
      items: [
        {
          label: 'Start a project',
          href: 'https://www.buchigo.com/contact/',
        },
        {
          label: 'Visit buchigo.com',
          href: 'https://www.buchigo.com/',
        },
      ],
    },
    {
      title: 'Stay in the loop',
      items: [
        {
          label: 'Creative insights',
          href: 'https://www.buchigo.com/',
        },
        {
          label: 'Support & collaboration',
          href: 'https://www.buchigo.com/contact/',
        },
      ],
    },
  ]

  return (
    <div className="app-shell">
      <header className={`nav-shell ${isHeroPassed ? 'nav-shell--solid' : ''}`}>
        <div
          className="nav-shell__layer nav-shell__layer--glass"
          aria-hidden="true"
        >
          <span className="nav-shell__grain" />
          <span className="nav-shell__sheen" />
        </div>
        <span
          className="nav-shell__glow nav-shell__glow--top"
          aria-hidden="true"
        />
        <span
          className="nav-shell__glow nav-shell__glow--bottom"
          aria-hidden="true"
        />
        <nav className="nav">
          <a className="nav__brand" href="#intro">
            PayWONT
          </a>
          <ul className="nav__list">
            {menuItems.map((item) => (
              <li key={item.href} className="nav__item">
                <a href={item.href} className="nav__link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="page">
        <section id="intro" ref={heroRef} className="panel panel--hero">
          <div className="panel__content">
            <p className="eyebrow">지금은 프롤로그 구간</p>
            <h1 className="headline">Buchigo PayWONT</h1>
            <p className="description">
              페이지로 진입하기 전, PayWONT가 준비한 첫인상을 가득히 담아보세요.
              아래로 스크롤하면 본격적인 이야기가 한 화면씩 펼쳐집니다.
            </p>
            <span className="scroll-hint">Scroll to explore</span>
          </div>
        </section>

        <section
          id="buchigo"
          ref={entryRef}
          className="panel panel--content panel--entry"
        >
          <div className="panel__content">
            <h2 className="section-title">소개</h2>
            <p>
              PayWONT는 Buchigo의 경험을 확장하여 사용자와 브랜드 사이의
              새로운 연결을 만듭니다. 이 영역은 프로젝트의 핵심 가치와 비전을
              소개하는 공간으로 활용할 수 있습니다.
            </p>
          </div>
        </section>

        <section id="developers" className="panel panel--content panel--alt">
          <div className="panel__content">
            <h2 className="section-title">Developers</h2>
            <p>
              팀과 함께 구축할 기능 로드맵, 기술 스택, 참여 정보를 정돈해
              보세요. PayWONT를 구성하는 개발자 스토리가 이곳에 채워질
              차례입니다.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__grid">
            <div className="footer__brand">
              <span className="footer__logo">BuchiGo</span>
              <p>
                High-performance creative commerce experiences that power the
                PayWONT vision. From immersive product storytelling to launch
                orchestration, BuchiGo helps photographers, designers, and
                agencies go live with confidence.
              </p>
              <a
                className="footer__cta"
                href="https://www.buchigo.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore buchigo.com
              </a>
            </div>

            <div className="footer__col">
              <h3 className="footer__heading">What we craft</h3>
              <ul className="footer__list footer__list--bullets">
                {footerHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {footerLinks.map((group) => (
              <div key={group.title} className="footer__col">
                <h3 className="footer__heading">{group.title}</h3>
                <ul className="footer__list">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="footer__bottom">
            <span>
              &copy; {new Date().getFullYear()} BuchiGo &middot; Crafted for
              immersive commerce.
            </span>
            <span className="footer__madeby">Powered by PayWONT</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
