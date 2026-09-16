import { Link } from 'react-router-dom'
import './Introduction.css'

export default function Introduction() {
  return (
    <main className="zv-intro-page">
      <div className="zv-intro-image zv-intro-image--left" aria-hidden="true" />
      <div className="zv-intro-image zv-intro-image--right" aria-hidden="true" />

      <header className="zv-intro-nav">
        <Link to="/" className="zv-intro-brand" aria-label="ZIVRAY home">
          <span className="zv-intro-brand-mark">Z</span>
          <span>ZIVRAY</span>
        </Link>
        <nav className="zv-intro-links" aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#care">Care, connected</a>
          <a href="#privacy">Privacy first</a>
          <Link to="/login" className="zv-intro-login">Login</Link>
          <Link to="/register" className="zv-intro-signup">Create account</Link>
        </nav>
      </header>

      <section className="zv-intro-content" id="about">
        <p className="zv-intro-eyebrow">Her health. Her data. Her control.</p>
        <h1>A smarter, safer space for your health journey.</h1>
        <p className="zv-intro-copy">
          ZIVRAY brings your medical records, prescriptions, appointments, doctors,
          and hospitals together in one private digital sanctuary.
        </p>
        <div className="zv-intro-actions">
          <Link to="/register" className="zv-intro-primary">Begin your journey <span aria-hidden="true">→</span></Link>
          <Link to="/login" className="zv-intro-secondary">I already have an account</Link>
        </div>
        <div className="zv-intro-trust">
          <span className="zv-intro-trust-icon" aria-hidden="true">✦</span>
          <span>Privacy-controlled records</span>
          <span className="zv-intro-trust-dot" aria-hidden="true" />
          <span>AI-powered insights</span>
        </div>
      </section>

      <section className="zv-intro-details" aria-label="Why ZIVRAY">
        <article id="care">
          <p className="zv-intro-detail-kicker">Care, connected</p>
          <h2>Your whole care story, in one calm place.</h2>
          <p>Keep appointments, prescriptions, medical records, and trusted providers together. ZIVRAY helps you prepare for visits and spot useful questions earlier.</p>
        </article>
        <article id="privacy">
          <p className="zv-intro-detail-kicker">Privacy first</p>
          <h2>You decide what gets shared.</h2>
          <p>Your health information stays organized under your control. Share the records you choose with the people and professionals you trust, when you choose.</p>
        </article>
      </section>

      <footer className="zv-intro-footer">
        <div>
          <strong>Care that meets you where you are.</strong>
          <span>Secure by design · Built for women</span>
        </div>
        <div className="zv-intro-contact" id="contact">
          <strong>Talk to ZIVRAY</strong>
          <a href="mailto:care@zivray.com">care@zivray.com</a>
          <a href="tel:+18009487291">+1 (800) 948-7291</a>
        </div>
      </footer>
    </main>
  )
}