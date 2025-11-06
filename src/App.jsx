import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [isHeroPassed, setIsHeroPassed] = useState(false)
  const [hasSnappedFromHero, setHasSnappedFromHero] = useState(false)
  const heroRef = useRef(null)
  const entryRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      const trigger = window.innerHeight * 0.1
      setIsHeroPassed(window.scrollY > trigger)

      if (window.scrollY < 4) {
        setHasSnappedFromHero(false)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (hasSnappedFromHero) {
      return
    }

    let touchStartY = 0
    let touchActive = false
    let snapping = false

    const snapToEntry = () => {
      if (snapping) return
      snapping = true
      const section = entryRef.current
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      setHasSnappedFromHero(true)
      setTimeout(() => {
        snapping = false
      }, 600)
    }

    const shouldIntercept = () => {
      const hero = heroRef.current
      if (!hero) {
        return window.scrollY < window.innerHeight * 0.4
      }
      const heroHeight = hero.offsetHeight || window.innerHeight
      return window.scrollY <= heroHeight * 0.2
    }

    const handleWheel = (event) => {
      if (event.deltaY <= 0 || !shouldIntercept()) return
      event.preventDefault()
      snapToEntry()
    }

    const handleKeyDown = (event) => {
      const keys = ['Space', 'PageDown', 'ArrowDown']
      if (!keys.includes(event.code) || !shouldIntercept()) return
      event.preventDefault()
      snapToEntry()
    }

    const handleTouchStart = (event) => {
      touchActive = true
      touchStartY = event.touches[0]?.clientY ?? 0
    }

    const handleTouchMove = (event) => {
      if (!touchActive || !shouldIntercept()) return
      const currentY = event.touches[0]?.clientY ?? 0
      const delta = touchStartY - currentY
      if (delta <= 12) return
      event.preventDefault()
      touchActive = false
      snapToEntry()
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
  }, [hasSnappedFromHero])

  const menuItems = [
    { href: '#intro', label: '소개' },
    { href: '#buchigo', label: 'Buchigo' },
    { href: '#developers', label: 'Developers' },
  ]

  return (
    <div className="app-shell">
      <header className={`nav-shell ${isHeroPassed ? 'nav-shell--solid' : ''}`}>
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
    </div>
  )
}

export default App
