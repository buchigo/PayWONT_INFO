import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
  const [isHeroPassed, setIsHeroPassed] = useState(false)
  const [hasSnappedFromHero, setHasSnappedFromHero] = useState(false)
  const [isNavJumping, setIsNavJumping] = useState(false)
  const heroRef = useRef(null)
  const entryRef = useRef(null)
  const snappingRef = useRef(false)
  const hasSnappedRef = useRef(hasSnappedFromHero)
  const lastScrollYRef = useRef(0)

  const navigate = useNavigate()
  const handleDeveloperNav = useCallback(() => {
    navigate('/developer')
  }, [navigate])

  useEffect(() => {
    hasSnappedRef.current = hasSnappedFromHero
  }, [hasSnappedFromHero])

  const snapToEntry = useCallback(() => {
    if (snappingRef.current) return
    snappingRef.current = true
    const target = entryRef.current
    if (target) {
      const top =
        target.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top, behavior: 'smooth' })
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
      const top =
        target.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setTimeout(() => {
      snappingRef.current = false
    }, 600)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (isNavJumping) {
        lastScrollYRef.current = window.scrollY
        return
      }
      const currentY = window.scrollY
      const trigger = window.innerHeight * 0.1
      setIsHeroPassed(currentY > trigger)

      if (currentY < 4) {
        setHasSnappedFromHero(false)
      }

      const lastY = lastScrollYRef.current
      const isScrollingUp = currentY < lastY
      const isScrollingDown = currentY > lastY
      const hero = heroRef.current
      const heroBottom = hero?.getBoundingClientRect().bottom ?? 0
      const heroHeight = hero?.offsetHeight ?? window.innerHeight
      const entry = entryRef.current
      const entryTop = entry?.getBoundingClientRect().top ?? null
      const topSnapZone = Math.max(60, window.innerHeight * 0.08)
      const entryNearViewportTop =
        entryTop !== null &&
        entryTop >= -topSnapZone &&
        entryTop <= topSnapZone

      if (
        isScrollingDown &&
        hero &&
        !hasSnappedRef.current &&
        !snappingRef.current
      ) {
        if (heroBottom > 0 && heroBottom <= window.innerHeight - 2) {
          snapToEntry()
        } else if (heroBottom <= 0 && currentY <= heroHeight * 1.2) {
          snapToEntry()
        }
      }

      if (isScrollingUp && !snappingRef.current) {
        const heroNearViewportTop =
          hero &&
          heroBottom >= -window.innerHeight * 0.15 &&
          heroBottom <= 24

        if (heroNearViewportTop || entryNearViewportTop) {
          snapToHero()
        }
      }

      lastScrollYRef.current = currentY
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [snapToEntry, snapToHero, isNavJumping])

  useEffect(() => {
    const shouldInterceptDown = () => {
      if (isNavJumping || snappingRef.current || hasSnappedRef.current)
        return false
      const hero = heroRef.current
      const heroHeight = hero?.offsetHeight ?? window.innerHeight
      return window.scrollY <= heroHeight * 0.25
    }

    const shouldInterceptUp = () => {
      if (isNavJumping || snappingRef.current || !hasSnappedRef.current)
        return false
      const entry = entryRef.current
      if (!entry) return false
      const entryTop = entry.getBoundingClientRect().top
      const topSnapZone = Math.max(60, window.innerHeight * 0.08)
      return entryTop >= -topSnapZone && entryTop <= window.innerHeight * 0.6
    }

    let touchStartY = 0
    let touchActive = false

    const handleWheel = (event) => {
      if (snappingRef.current) {
        event.preventDefault()
        return
      }

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
      if (snappingRef.current) {
        event.preventDefault()
        touchActive = false
        return
      }
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
  }, [snapToEntry, snapToHero, isNavJumping])

  const handleNavClick = useCallback(
    (event, href) => {
      event.preventDefault()
      setIsNavJumping(true)

      if (href === '#intro') {
        const nearTop = window.scrollY <= 40
        if (nearTop && entryRef.current) {
          const entryTop = entryRef.current.offsetTop
          window.scrollTo({ top: entryTop, behavior: 'smooth' })
          setHasSnappedFromHero(true)
        } else {
          const hero = heroRef.current
          if (hero) {
            hero.scrollIntoView({ behavior: 'smooth', block: 'start' })
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
          setHasSnappedFromHero(false)
        }
      } else {
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        setHasSnappedFromHero(true)
      }

      setTimeout(() => {
        setIsNavJumping(false)
      }, 1200)
    },
    []
  )

  const menuItems = [
    { href: '#intro', label: '소개' },
    { href: '#developers', label: 'Developer' },
  ]

  const onboardingSteps = [
    '앱 다운로드 및 설치 후 PayWONT 첫 방문',
    'WONT Agent SDK로 디바이스 연동 및 초기 지갑 생성',
    'SMS, PASS, 생체 등을 포함한 원하는 본인 인증 채널 선택',
    '이름·생년월일·휴대폰 번호 입력 후 인증 요청',
    '본인 인증 완료 뒤 6자리 PIN 디지털지갑 생성',
    'WONT 연동 카드 등록 및 예치금 백그라운드 충전(+3일 정산)',
  ]

  const authChannels = [
    'SMS',
    'PASS',
    '삼성패스',
    '네이버',
    '카카오톡',
    '토스',
    '카카오뱅크',
    '국민인증',
    '신한인증',
  ]

  const nftCardHighlights = [
    '블록체인 선불충전 카드(NFT Card)를 전자지갑과 동일 UX로 관리합니다.',
    '맥락가액으로 NFT 카드를 구매하고 중계기관을 거쳐 충전·전송할 수 있습니다.',
    '전자지갑 간 NFT 카드 이전과 PayWONT 간편결제(TWONT)를 즉시 실행합니다.',
    'NFT Card 스킨을 광고 매체로 활용해 복지·보상 재원을 조성합니다.',
  ]

  const tokenModels = [
    {
      name: 'WONT 서비스 (예치금 토큰)',
      description:
        'KRW 1:1 교환 및 금융기관 예치, 예치금·이자 원장과 온체인 총량을 실시간 비교하며 변동/유지/승인/만기 상태를 추적합니다.',
    },
    {
      name: 'AWONT 서비스 (승인 토큰)',
      description:
        'B2B/B2C 계약, 갑/을/병 참여자 승인, 자재·건설·인건비 항목별 예치금 교환 요청을 기록하여 지급 준비 상태를 표시합니다.',
    },
    {
      name: 'TWONT (만기 토큰)',
      description:
        '거래 만기 및 정산+45일 스케줄을 스마트컨트랙트에 저장해 지급/상환, 카드사용료 입금, 카드 명세서 정산까지 자동화합니다.',
    },
    {
      name: 'Bridge Mint · Melting',
      description:
        '디지털화폐·스테이블코인을 Bridge Mint로 WONT 발행 후 Melting으로 소각/환전하여 글로벌 송금과 가상자산 결제를 연결합니다.',
    },
  ]

  const paymentRails = [
    {
      title: '일반결제',
      description:
        '동적 QR·NFC·키오스크 결제와 WONT 앱을 연결해 선수금/후불 예치금 충전, 카드 명세서, 간편결제(TWONT) 토큰 발급·결제를 처리합니다.',
    },
    {
      title: '가상자산 결제',
      description:
        '스테이블코인·NFT 카드 자산을 Bridge Mint로 전환해 WONT를 충전하고 Melting으로 다시 기축통화나 복지포인트로 교환합니다.',
    },
    {
      title: '글로벌 전송',
      description:
        'Paygate와 협업해 USD-WONT 충전 승인, AWONT 승인토큰 발급, TWONT 만기 정산으로 해외 협력사와 복지 수혜자에게 지급합니다.',
    },
  ]

  const feeControls = [
    '카드·예치금 교환 수수료 1.5%와 주요 수수료, 전환/보상/송금 수수료를 수수료관리 시스템에서 정책화하고 자동 배분합니다.',
    '예치금 충전(선/후불)과 백그라운드 +3일 정산, PG API 연계 D-1 week~정산+45일 스케줄, 카드사용료 입금까지 단일 원장에서 관리합니다.',
    '예치금과 WONT 총량 일치성을 상시 비교하고 이자 배분·감사 로그를 남겨 규제 보고에 활용합니다.',
    '카드사는 WONT Agent 데이터로 카드 명세서·청구·신용 관리를 수행하고 수수료 절감 구조를 가맹점에 제공합니다.',
  ]

  const contractFlow = [
    '승인·계약: 갑(발주)·을(시공/공급)·병(중계/금융)이 AWONT 승인토큰으로 역할과 권한을 합의합니다.',
    '예치금 교환 요청: 계약 조건 충족 시 AWONT → WONT 교환으로 지급 준비를 열고 품목별 증빙을 첨부합니다.',
    '지급/정산/승인: 자재·건설·인건비 등 카테고리별 TWONT 만기 처리와 전자 영수증을 동시에 기록합니다.',
    '계약 이행 추적: 하이브리드(DB+체인) 원장에서 계약·자금·물류 상태를 동기화하고 실시간 알림으로 모니터링합니다.',
  ]

  const pointHighlights = [
    '결제포인트 발행 및 관리 시스템이 AWONT 기반 복지·가맹 포인트를 발행하고 만기/소각/보상률을 자동 계산합니다.',
    '사용자별 WONT·AWONT·TWONT 지갑을 단일 UX로 노출해 복지포인트와 간편결제를 같은 흐름에서 처리합니다.',
    'NFT 카드 스킨 광고, 데이터 분석, 전자지갑 연동 API를 수익 모델로 삼아 기존 복지포인트 대비 빠른 결제와 수수료 절감을 제공합니다.',
  ]

  const qrFlow = [
    '키오스크·결제화면·MPM 단말에서 거래마다 동적 QR을 생성하고 모든 결제 정보를 암호화해 노출합니다.',
    '소비자는 WONT 앱/워치를 열어 QR을 스캔하고 PIN, 생체(지문·얼굴) 또는 PASS 인증으로 결제를 승인합니다.',
    'WONT 서버는 결제정보를 서명해 온체인 트랜잭션을 만들고 AWONT/TWONT 상태값을 업데이트합니다.',
    '결제 취소·부분 환불·복지포인트 적용을 동일 API 또는 Embedded 위젯으로 제공해 이커머스/PG 연동을 단순화합니다.',
    'WONT 앱 결제 외에도 동적 QR 링크를 카드 단말, 키오스크, 웹 체크아웃에 삽입할 수 있습니다.',
  ]

  const welfareComparison = {
    legacy: [
      '금융기관 중심 폐쇄형 DB, 정산 D+7~30일 이상으로 포인트 회전율이 낮습니다.',
      '결제·교환 수수료가 다단 구조(카드사·밴·플랫폼)로 3~5%까지 증가합니다.',
      '유효기간 만료·미사용 포인트를 수익화하지만 이용자 경험은 경직됩니다.',
      '운영시스템과 서비스 데이터가 분리되어 외부 제휴 및 확장이 어렵습니다.',
    ],
    chain: [
      '블록체인 원장과 DB를 하이브리드로 묶어 실시간 정산과 투명한 감사 추적을 제공합니다.',
      '1.5% 이하 수수료로 결제·교환 비용을 낮추고 보상률을 즉시 조정합니다.',
      'NFT/AWONT 기반 포인트로 광고 스킨, 데이터 서비스, 제휴 리워드 등 신규 수익을 설계합니다.',
      'API·Embedded 연동으로 커머스/복지 플랫폼이 빠르게 접속하고 사용자 경험을 통합합니다.',
    ],
    summary: [
      '복지포인트 금률과 수익률을 계약별·기간별로 자동 계산해 즉시 반영합니다.',
      '블록체인 결제와 복지포인트 결제 구조를 단일 UX로 통합해 빠른 결제와 수수료 절감을 실현합니다.',
    ],
  }

  const globalRemittance = [
    'USD·스테이블코인 예치 후 Bridge Mint로 WONT를 발행하고 Melting으로 재환전해 글로벌 송금 루프를 완성합니다.',
    'Paygate 연동 프로세스로 USD-WONT 충전 요청/승인, 환전, 송금 서류까지 자동화합니다.',
    '외국인은 스테이블코인 구매->WONT 교환->지갑 코드 발급->PIN 생성->전자지갑 충전 확인->블록체인 간편결제 순으로 Non-KYC 한도 내 이용 가능합니다.',
    '블록체인 간편결제서비스가 전자지갑 생성과 토큰 지급을 자동으로 실행하고 토큰 결제 내역을 계약별로 분리합니다.',
    'TWONT 만기 토큰은 정산 또는 해외 가맹점 송금 시 Melting되어 현지 통화로 지급됩니다.',
  ]

  const footerHighlights = [
    '소비자를 위한 하이엔드 커머스 서비스 제작',
    '전략·디자인·배포 전 과정을 지원하는 BuchiGo 인프라',
  ]

  const footerLinks = [
    {
      title: 'BuchiGo와 파트너십',
      items: [
        {
          label: '파트너십 제안하기',
          href: 'https://www.buchigo.com/contact/',
        },
        {
          label: 'buchigo.com',
          href: 'https://www.buchigo.com/',
        },
      ],
    },
    {
      title: '소식 받아보기',
      items: [
        {
          label: '크리에이티브 인사이트',
          href: 'https://www.buchigo.com/',
        },
        {
          label: '지원 문의 · 협업 제안',
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
          <a className="nav__brand" href={import.meta.env.BASE_URL}>
            PayWONT
          </a>
          <div className="nav__group">
            <ul className="nav__list">
              {menuItems.map((item) => (
                <li key={item.href} className="nav__item">
                  <a
                    href={item.href}
                    className="nav__link"
                    onClick={(event) => handleNavClick(event, item.href)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <button type="button" className="nav-cta" disabled aria-disabled="true">
              다운로드
            </button>
          </div>
        </nav>
      </header>

      <main className="page">
        <section id="intro" ref={heroRef} className="panel panel--hero">
          <div className="panel__content">
            <p className="eyebrow">블록체인 간편결제 서비스</p>
            <h1 className="headline">PayWONT: 블록체인 간편결제</h1>
            <p className="description">
              예치금, 이자, 각종 토큰, 디지털화폐(Bridge Mint·Melting)를 하나의
              경험으로 묶어 예치금과 WONT의 일치성을 보장하는 간편결제
              서비스입니다.
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
            <h2 className="section-title">PayWONT 소개</h2>
            <p>
              PayWONT는 예치금 신용제공 계약, 토큰 발급/결제, 카드 명세서·청구·신용
              관리를 통합한 블록체인 기반 전자지갑입니다. 예치금과 WONT 총량을
              실시간 대조하고 1:1 KRW 교환·금융기관 예치를 보장합니다.
            </p>
            <p>
              예치금 충전(선/후불)과 백그라운드 +3일 정산, 카드사용료 입금,
              예치금 교환 수수료(1.5%)까지 단일 원장에서 자동화되며,
              간편결제(TWONT)와 토큰 정산·교환을 동일 PG API로 노출합니다.
            </p>
            <button type="button" className="hero-cta" disabled>
              앱 다운로드 (준비 중)
            </button>
          </div>
        </section>

        <section id="onboarding" className="panel panel--content">
          <div className="panel__content">
            <h2 className="section-title">온보딩 & 전자지갑 연동</h2>
            <p>
              앱 다운로드 &gt; 최초 방문 &gt; 본인 인증 &gt; 디지털지갑 PIN 생성 흐름을 표준화해
              이름·생년월일·휴대폰 번호 입력 후 인증 요청까지 매끄럽게 안내합니다.
            </p>
            <div className="chip-list" aria-label="본인 인증 채널">
              {authChannels.map((channel) => (
                <span key={channel} className="chip">
                  {channel}
                </span>
              ))}
            </div>
            <div className="info-grid">
              <div className="info-card">
                <h3>온보딩 여정</h3>
                <ol className="step-list">
                  {onboardingSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="info-card">
                <h3>NFT Card & 디지털지갑</h3>
                <ul>
                  {nftCardHighlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="tokens" className="panel panel--content panel--alt">
          <div className="panel__content">
            <h2 className="section-title">핵심 토큰 · 예치 구조</h2>
            <p>
              예치금, 이자, 각종 토큰, 디지털화폐(Bridge Mint, Melting)를 모듈화해
              사용자별 WONT·AWONT·TWONT 시스템을 구성하고, 변동/유지/승인/만기
              상태를 실시간으로 추적합니다.
            </p>
            <div className="info-grid info-grid--two-col">
              {tokenModels.map((token) => (
                <div key={token.name} className="info-card">
                  <h3>{token.name}</h3>
                  <p>{token.description}</p>
                </div>
              ))}
            </div>
            <p>
              WONT 서비스는 1:1 KRW 교환/관리를, AWONT는 승인토큰 기반 B2B/B2C 모델을,
              TWONT는 만기 정산과 Melting 환전을 담당해 예치금과 토큰이 동일 흐름으로
              움직입니다.
            </p>
          </div>
        </section>

        <section id="systems" className="panel panel--content">
          <div className="panel__content">
            <h2 className="section-title">결제 · 수수료 · 계약 시스템</h2>
            <p>
              일반결제/가상자산결제/글로벌전송 라인을 하이브리드(DB, 블록체인) 구조에 올리고
              예치금 관리, 간편결제, 예치금 충전, PG API, 토큰 정산/교환을 통합합니다.
            </p>
            <div className="info-grid">
              <div className="info-card">
                <h3>결제 모델</h3>
                <ul className="info-list">
                  {paymentRails.map((rail) => (
                    <li key={rail.title}>
                      <strong>{rail.title}</strong>
                      <span>{rail.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="info-card">
                <h3>수수료 · 정산</h3>
                <ul>
                  {feeControls.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="info-card info-card--full">
              <h3>승인·계약 플로우(갑/을/병)</h3>
              <ul>
                {contractFlow.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="info-card info-card--full">
              <h3>결제포인트 발행 & 사용자 시스템</h3>
              <ul>
                {pointHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="qr" className="panel panel--content panel--alt">
          <div className="panel__content">
            <h2 className="section-title">동적 QR · 소비자 결제 UX</h2>
            <p>
              동적 QR코드 결제(소비자 결제시스템)는 키오스크·결제화면·MPM 단말에서
              QR 생성/검증을 수행하고, 소비자는 비밀번호·지문 등으로 결제를 확인합니다.
              결제 취소, 환불, 이커머스 API 연동도 동일한 방법(API, Embedded, WONT 앱)으로
              제공합니다.
            </p>
            <div className="info-card">
              <ul>
                {qrFlow.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="welfare" className="panel panel--content">
          <div className="panel__content">
            <h2 className="section-title">복지포인트 비교 · 수익모델</h2>
            <p>
              기존 복지포인트와 블록체인 복지포인트 서비스 구조, 수수료, 금률/수익률을 비교해
              더 빠른 결제와 수수료 절감 구조를 제시합니다.
            </p>
            <div className="comparison">
              <div className="comparison__column">
                <h3>기존 복지포인트</h3>
                <ul>
                  {welfareComparison.legacy.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="comparison__column">
                <h3>블록체인 복지포인트</h3>
                <ul>
                  {welfareComparison.chain.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <ul className="summary-list">
              {welfareComparison.summary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="global" className="panel panel--content panel--alt">
          <div className="panel__content">
            <h2 className="section-title">글로벌 송금 · 환전 구조</h2>
            <p>
              블록체인 간편결제 글로벌 송금 및 환전 구조는 USD-WONT 충전 요청 및 승인,
              Paygate 연동, Non-KYC 외국인 흐름, 전자지갑 생성 및 토큰 지급·결제까지
              전 과정을 자동화합니다.
            </p>
            <div className="info-card">
              <ul>
                {globalRemittance.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="developers" className="panel panel--content panel--developer">
          <div className="panel__content">
            <h2 className="section-title">Developer</h2>
            <p>
              PayWONT 개발자 포털에서는 WONT Agent SDK, 결제 API, 토큰 원장 이벤트 스트림을
              연동하는 가이드와 샘플을 제공할 예정입니다. 지금은 준비 중이며 곧 외부 파트너에게
              공개될 예정입니다.
            </p>
            <button type="button" className="cta-button" onClick={handleDeveloperNav}>
              Developer Portal 바로가기
            </button>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__grid">
            <div className="footer__brand">
              <span className="footer__logo">BuchiGo</span>
              <p>
                BuchiGo는 PayWONT 비전을 구현하는 크리에이티브 파트너입니다.
                스토리텔링, 제품 론칭, 브랜드 경험 제작까지 모든 단계를 함께하며
                안전하게 출시할 수 있도록 지원합니다.
              </p>
              <a
                className="footer__cta"
                href="https://www.buchigo.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                buchigo.com 살펴보기
              </a>
            </div>

            <div className="footer__col">
              <h3 className="footer__heading">우리가 만드는 것</h3>
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
              &copy; {new Date().getFullYear()} BuchiGo &middot; 몰입형 커머스를 위한
              디지털 파트너
            </span>
            <span className="footer__madeby">PayWONT와 함께합니다</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage


