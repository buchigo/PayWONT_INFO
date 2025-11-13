import { Link } from 'react-router-dom'
import './DeveloperPage.css'

const navigationBlocks = [
  {
    title: 'WONT Agent SDK',
    description:
      'PayWONT 월렛과 커스터디 파이프라인을 빠르게 통합할 수 있는 경량 SDK입니다. 모바일/웹 환경에 맞춰 베타 문서를 준비하고 있어요.',
  },
  {
    title: 'Payment API',
    description:
      'On/Off-Ramp, Paygate 연동, 가맹점 정산 시나리오에 필요한 API 엔드포인트들을 정리하고 있습니다.',
  },
  {
    title: 'Operations Console',
    description:
      '트랜잭션 모니터링, 잔액 현황, KYC 검증 상태를 한 번에 확인할 수 있는 운영 도구를 시험 중입니다.',
  },
]

const checklist = [
  '파트너 사전 등록 및 샌드박스 계정 발급',
  'API 키와 웹훅 시크릿 교부',
  '테스트넷에서 멀티 체인 송금 시뮬레이션',
  '정산 주기/한도 등 커스텀 정책 확정',
]

const contactOptions = [
  { label: '파트너 문의', href: 'https://www.buchigo.com/contact/' },
  { label: '기술 지원 메일', href: 'mailto:dev@buchigo.com' },
]

function DeveloperPage() {
  return (
    <div className="developer-page">
      <header className="developer-hero">
        <p className="developer-hero__eyebrow">Developer Preview</p>
        <h1>PayWONT Developer</h1>
        <p>
          통합 테스트와 운영 정책 정리를 위한 개발자 포털을 준비 중입니다. SDK, API, 운영 도구가
          업데이트되면 가장 먼저 전달드릴게요.
        </p>
        <div className="developer-hero__actions">
          <button type="button" className="developer-cta" disabled>
            Developer Portal 준비 중
          </button>
          <Link className="developer-ghost" to="/">
            PayWONT 홈페이지
          </Link>
        </div>
      </header>

      <section className="developer-section">
        <h2>예정된 구성</h2>
        <div className="developer-grid">
          {navigationBlocks.map((block) => (
            <article key={block.title} className="developer-card">
              <h3>{block.title}</h3>
              <p>{block.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="developer-section">
        <h2>시작 체크리스트</h2>
        <ul className="developer-list">
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="developer-section">
        <h2>연락 채널</h2>
        <div className="developer-links">
          {contactOptions.map((option) => (
            <a key={option.label} href={option.href} target="_blank" rel="noopener noreferrer">
              {option.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

export default DeveloperPage
