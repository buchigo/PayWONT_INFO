import { Link } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import chainVidDark from '../../assets/Chain_vid_dark.mp4'
import chainVidLight from '../../assets/Chain_vid_light.mp4'
import TopNav from '../../components/topnav/TopNav'
import './DeveloperPage.css'

const navigationBlocks = [
  {
    id: 'sdk',
    title: 'WONT \uC5D0\uC774\uC804\uD2B8 SDK',
    description:
      '\uC6F9/\uC571\uC5D0\uC11C PayWONT \uC5D0\uC774\uC804\uD2B8 \uD750\uB984\uC744 \uC5F0\uB3D9\uD558\uAE30 \uC704\uD55C \uACF5\uC2DD SDK\uC785\uB2C8\uB2E4.',
  },
  {
    id: 'payment',
    title: '\uACB0\uC81C API',
    description:
      '\uC628/\uC624\uD504\uB7A8\uD504, \uD398\uC774\uAC8C\uC774\uD2B8 \uC5F0\uB3D9, \uACB0\uC81C \uCC98\uB9AC\uC5D0 \uD544\uC694\uD55C API \uC138\uD2B8\uB97C \uC81C\uACF5\uD569\uB2C8\uB2E4.',
  },
  {
    id: 'console',
    title: '\uC6B4\uC601 \uCF58\uC194',
    description:
      '\uAC70\uB798 \uBAA8\uB2C8\uD130\uB9C1, \uC815\uC0B0, KYC \uC0C1\uD0DC\uB97C \uD655\uC778\uD560 \uC218 \uC788\uB294 \uC6B4\uC601 \uCF58\uC194\uC785\uB2C8\uB2E4.',
  },
]

const checklist = [
  '\uD30C\uD2B8\uB108 \uB4F1\uB85D \uBC0F \uAD00\uB9AC\uC790 \uACC4\uC815 \uBC1C\uAE09',
  'API \uD0A4 \uBC1C\uAE09 \uBC0F \uD14C\uC2A4\uD2B8/\uC6B4\uC601 \uBD84\uB9AC',
  '\uD14C\uC2A4\uD2B8 \uD658\uACBD \uC5F0\uB3D9 \uBC0F \uC2DC\uB098\uB9AC\uC624 \uAC80\uC99D',
  '\uC815\uC0B0 \uC8FC\uAE30/\uC138\uAE08 \uBC0F \uACC4\uC57D \uC815\uCC45 \uD655\uC778',
]

const contactOptions = [
  { label: '\uD30C\uD2B8\uB108 \uBB38\uC758', href: 'https://www.buchigo.com/contact/' },
  { label: '\uC774\uBA54\uC77C \uBB38\uC758', href: 'mailto:dev@buchigo.com' },
]

function DeveloperPage() {
  const { isDarkMode } = useTheme()
  const chainVid = isDarkMode ? chainVidDark : chainVidLight

  return (
    <>
      <TopNav />
      <div className="developer-page">
        <div className="developer-bg" aria-hidden="true">
          <video
            className="developer-bg__video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedMetadata={(e) => { try { e.currentTarget.playbackRate = 0.8 } catch (_) {} }}
            onPlay={(e) => { try { e.currentTarget.playbackRate = 0.8 } catch (_) {} }}
          >
            <source src={chainVid} type="video/mp4" />
          </video>
        </div>
        <div className="developer-overlay" aria-hidden="true" />
        <div className="developer-layout">
          <div className="developer-main">
            <header id="intro" className="developer-hero">
              <h1>PayWONT Developer</h1>
            <p>
              {'\uD604\uC7AC \uD14C\uC2A4\uD2B8\uC640 \uC6B4\uC601 \uC815\uCC45 \uAC80\uC99D\uC744 \uC704\uD574 \uC81C\uD55C\uC801\uC73C\uB85C \uC811\uADFC\uC744 \uC81C\uACF5\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4. SDK, API, \uC6B4\uC601 \uCF58\uC194\uC744 \uC21C\uCC28\uC801\uC73C\uB85C \uACF5\uAC1C\uD560 \uC608\uC815\uC785\uB2C8\uB2E4.'}
            </p>
              <div className="developer-hero__actions">
                <button type="button" className="developer-cta" disabled>
                  {'Developer Portal '}{'\uC900\uBE44 \uC911'}
                </button>
                <Link className="developer-ghost" to="/">
                  {'\uD648\uC73C\uB85C'}
                </Link>
              </div>
            </header>

            <section id="products" className="developer-section">
            <h2>{'\uC81C\uD488 \uC548\uB0B4'}</h2>
              <div className="developer-grid">
                {navigationBlocks.map((block) => (
                  <article key={block.title} id={block.id} className="developer-card">
                    <h3>{block.title}</h3>
                    <p>{block.description}</p>
                  </article>
                ))}
              </div>
            </section>

          <section id="checklist" className="developer-section">
            <h2>{'\uC0AC\uC804 \uCCB4\uD06C\uB9AC\uC2A4\uD2B8'}</h2>
              <ul className="developer-list">
                {checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

          <section id="contact" className="developer-section">
            <h2>{'\uBB38\uC758 \uCC44\uB110'}</h2>
              <div className="developer-links">
                {contactOptions.map((option) => (
                  <a
                    key={option.label}
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {option.label}
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeveloperPage
