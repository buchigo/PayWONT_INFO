import { useLayoutEffect } from 'react'
import TopNav from '../../components/topnav/TopNav'
import './PaymentApiPage.css'

const leftNavSections = [
  {
    id: 'overview',
    label: '결제 API 개요',
  },
  {
    id: 'endpoints',
    label: '요청 엔드포인트',
  },
  {
    id: 'common-rules',
    label: '공통 규칙',
  },
  {
    id: 'create-payment',
    label: '결제 생성',
  },
  {
    id: 'retrieve-payment',
    label: '결제 조회',
  },
  {
    id: 'cancel-payment',
    label: '결제 취소',
  },
  {
    id: 'webhooks',
    label: '웹훅 이벤트',
  },
  {
    id: 'errors',
    label: '에러 코드',
  },
]

function CodeBlock({ title, children }) {
  return (
    <div className="api-code">
      {title && <div className="api-code__title">{title}</div>}
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  )
}

function Pill({ active, children }) {
  return (
    <button
      type="button"
      className="api-pill"
      data-active={active ? 'true' : 'false'}
    >
      {children}
    </button>
  )
}

function Tag({ children }) {
  return <span className="api-tag">{children}</span>
}

function HttpBadge({ method }) {
  return <span className={`api-http api-http--${method.toLowerCase()}`}>{method}</span>
}

function RightAnchor({ href, label }) {
  return (
    <a className="api-toc__link" href={href}>
      {label}
    </a>
  )
}

function PaymentApiPage() {
  // 페이지 로드 시 최상단으로 스크롤 (useLayoutEffect 사용하여 렌더링 전 실행)
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <TopNav />
      <div className="api-page">
        <div className="api-layout">
          <aside className="api-sidebar" aria-label="결제 API 섹션 목록">
            <div className="api-sidebar__inner">
              <div className="api-sidebar__group">
                <div className="api-sidebar__group-title">결제 API</div>
                <nav>
                  {leftNavSections.map((item) => (
                    <a key={item.id} href={`#${item.id}`} className="api-sidebar__link">
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          <main className="api-main">
            <header id="overview" className="api-hero">
              <p className="api-hero__eyebrow">PAYWONT REFERENCE</p>
              <h1>결제 API</h1>
              <p className="api-hero__lead">
                결제 생성부터 조회, 취소, 정산까지 PayWONT 결제 API의
                전체 구조와 요청 규칙을 한 곳에서 확인할 수 있습니다.
              </p>
              <div className="api-hero__pills" aria-label="환경 선택" role="group">
                <Pill active>테스트</Pill>
                <Pill>실운영</Pill>
              </div>

              <div id="endpoints" className="api-hero__endpoints">
                <div className="api-hero__endpoint-card">
                  <div className="api-hero__endpoint-label">테스트 환경</div>
                  <CodeBlock>
                    https://api.test.paywont.com
                  </CodeBlock>
                </div>
                <div className="api-hero__endpoint-card">
                  <div className="api-hero__endpoint-label">실운영 환경</div>
                  <CodeBlock>
                    https://api.paywont.com
                  </CodeBlock>
                </div>
              </div>
            </header>

            <section id="common-rules" className="api-section">
              <h2>공통 규칙</h2>
              <p>
                모든 결제 API는 HTTPS 기반의 REST 스타일로 설계되어 있으며,
                HTTP 상태 코드와 응답 본문을 함께 사용해 결과를 표현합니다.
              </p>
              <ul>
                <li>모든 요청은 TLS(HTTPS)를 사용해야 합니다.</li>
                <li>요청과 응답 바디는 기본적으로 JSON 형식을 사용합니다.</li>
                <li>서버 시간 기준은 UTC+9 (Asia/Seoul) 입니다.</li>
              </ul>

              <div className="api-grid">
                <div className="api-card">
                  <h3>공통 헤더</h3>
                  <p>아래 헤더는 모든 결제 API 요청에 공통으로 포함됩니다.</p>
                  <CodeBlock title="요청 헤더 예시">
{`Authorization: Bearer {secretKey}
Content-Type: application/json
Idempotency-Key: {uniqueKey}`}
                  </CodeBlock>
                </div>
                <div className="api-card">
                  <h3>응답 포맷</h3>
                  <p>성공과 실패 모두 JSON 본문으로 응답합니다.</p>
                  <CodeBlock title="성공 응답 예시">
{`{
  "success": true,
  "data": {
    "paymentId": "pay_1234567890",
    "status": "SUCCEEDED"
  }
}`}
                  </CodeBlock>
                </div>
              </div>
            </section>

            <section id="create-payment" className="api-section">
              <div className="api-section__header">
                <div>
                  <h2>결제 생성</h2>
                  <p>
                    가맹점에서 최종 결제 승인을 수행할 때 호출하는 API입니다.
                  </p>
                </div>
                <Tag>payments</Tag>
              </div>

              <article className="api-endpoint">
                <div className="api-endpoint__summary">
                  <div className="api-endpoint__title">
                    <HttpBadge method="POST" />
                    <span>/v1/payments</span>
                  </div>
                  <p>결제를 승인하고 최종 결제 상태를 반환합니다.</p>
                </div>

                <div className="api-endpoint__body">
                  <div className="api-endpoint__column">
                    <h3>요청 본문</h3>
                    <p>주요 필드만 발췌한 예시입니다.</p>
                    <CodeBlock title="Request Body">
{`{
  "orderId": "ORDER-2025-0001",
  "orderName": "테스트 결제",
  "amount": 15000,
  "currency": "KRW",
  "customer": {
    "customerId": "USER-001",
    "email": "customer@example.com"
  },
  "callback": {
    "successUrl": "https://merchant.com/payments/success",
    "failUrl": "https://merchant.com/payments/fail"
  }
}`}
                    </CodeBlock>
                  </div>

                  <div className="api-endpoint__column">
                    <h3>응답 예시</h3>
                    <CodeBlock title="Response Body">
{`{
  "paymentId": "pay_1234567890",
  "orderId": "ORDER-2025-0001",
  "status": "SUCCEEDED",
  "approvedAt": "2025-11-14T04:16:12+09:00",
  "amount": {
    "total": 15000,
    "currency": "KRW"
  }
}`}
                    </CodeBlock>
                  </div>
                </div>
              </article>
            </section>

            <section id="retrieve-payment" className="api-section">
              <div className="api-section__header">
                <div>
                  <h2>결제 조회</h2>
                  <p>결제 ID 또는 주문 번호로 결제 상태를 조회합니다.</p>
                </div>
                <Tag>payments</Tag>
              </div>

              <article className="api-endpoint">
                <div className="api-endpoint__summary">
                  <div className="api-endpoint__title">
                    <HttpBadge method="GET" />
                    <span>/v1/payments/{'{paymentId}'}</span>
                  </div>
                  <p>단일 결제 건의 상세 정보를 반환합니다.</p>
                </div>

                <div className="api-endpoint__body">
                  <div className="api-endpoint__column">
                    <h3>요청</h3>
                    <CodeBlock title="Path Parameter">
{`GET /v1/payments/{paymentId}

// 혹은
GET /v1/payments?orderId={orderId}`}
                    </CodeBlock>
                  </div>
                  <div className="api-endpoint__column">
                    <h3>응답 예시</h3>
                    <CodeBlock>
{`{
  "paymentId": "pay_1234567890",
  "orderId": "ORDER-2025-0001",
  "status": "SUCCEEDED",
  "approvedAt": "2025-11-14T04:16:12+09:00"
}`}
                    </CodeBlock>
                  </div>
                </div>
              </article>
            </section>

            <section id="cancel-payment" className="api-section">
              <div className="api-section__header">
                <div>
                  <h2>결제 취소</h2>
                  <p>승인된 결제를 전액 또는 부분 취소합니다.</p>
                </div>
                <Tag>payments</Tag>
              </div>

              <article className="api-endpoint">
                <div className="api-endpoint__summary">
                  <div className="api-endpoint__title">
                    <HttpBadge method="POST" />
                    <span>/v1/payments/{'{paymentId}'}/cancel</span>
                  </div>
                  <p>가맹점 사유를 포함해 결제 취소를 요청합니다.</p>
                </div>

                <div className="api-endpoint__body">
                  <div className="api-endpoint__column">
                    <h3>요청 본문</h3>
                    <CodeBlock>
{`{
  "cancelAmount": 15000,
  "reason": "고객 단순 변심",
  "requestId": "CANCEL-001"
}`}
                    </CodeBlock>
                  </div>
                  <div className="api-endpoint__column">
                    <h3>응답 예시</h3>
                    <CodeBlock>
{`{
  "paymentId": "pay_1234567890",
  "status": "CANCELED",
  "canceledAt": "2025-11-14T05:02:11+09:00",
  "cancelAmount": 15000
}`}
                    </CodeBlock>
                  </div>
                </div>
              </article>
            </section>

            <section id="webhooks" className="api-section">
              <h2>웹훅 이벤트</h2>
              <p>
                PayWONT는 결제 상태 변경을 실시간으로 전파하기 위해 웹훅 기반의
                비동기 알림을 제공합니다.
              </p>
              <ul>
                <li>웹훅 URL은 가맹점 콘솔에서 등록합니다.</li>
                <li>동일 이벤트에 대해 최소 한 번 이상 전달을 보장합니다.</li>
                <li>5xx 응답 또는 타임아웃이 발생하면 재시도 됩니다.</li>
              </ul>

              <CodeBlock title="웹훅 페이로드 예시">
{`{
  "event": "payment.status.changed",
  "data": {
    "paymentId": "pay_1234567890",
    "status": "SUCCEEDED"
  },
  "sentAt": "2025-11-14T04:17:12+09:00",
  "signature": "{HMAC-SIGNATURE}"
}`}
              </CodeBlock>
            </section>

            <section id="errors" className="api-section">
              <h2>에러 코드</h2>
              <p>
                모든 에러 응답은 HTTP 상태 코드와 함께 PayWONT 고유의 에러 코드를
                반환합니다.
              </p>

              <div className="api-table">
                <div className="api-table__header">
                  <span>HTTP</span>
                  <span>코드</span>
                  <span>메시지</span>
                </div>
                <div className="api-table__row">
                  <span>400</span>
                  <span>INVALID_REQUEST</span>
                  <span>요청 파라미터가 올바르지 않습니다.</span>
                </div>
                <div className="api-table__row">
                  <span>401</span>
                  <span>UNAUTHORIZED</span>
                  <span>유효하지 않은 인증 정보입니다.</span>
                </div>
                <div className="api-table__row">
                  <span>404</span>
                  <span>PAYMENT_NOT_FOUND</span>
                  <span>요청한 결제 건을 찾을 수 없습니다.</span>
                </div>
                <div className="api-table__row">
                  <span>409</span>
                  <span>DUPLICATED_REQUEST</span>
                  <span>중복된 요청입니다. Idempotency-Key를 확인하세요.</span>
                </div>
                <div className="api-table__row">
                  <span>500</span>
                  <span>INTERNAL_ERROR</span>
                  <span>일시적인 오류가 발생했습니다. 잠시 후 다시 시도하세요.</span>
                </div>
              </div>
            </section>
          </main>

          <aside className="api-toc" aria-label="현재 페이지 목차">
            <div className="api-toc__inner">
              <div className="api-toc__title">이 페이지에서</div>
              <RightAnchor href="#common-rules" label="공통 규칙" />
              <RightAnchor href="#create-payment" label="결제 생성" />
              <RightAnchor href="#retrieve-payment" label="결제 조회" />
              <RightAnchor href="#cancel-payment" label="결제 취소" />
              <RightAnchor href="#webhooks" label="웹훅 이벤트" />
              <RightAnchor href="#errors" label="에러 코드" />
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

export default PaymentApiPage

