import { useEffect, useState } from 'react'
import SEOHead from '../components/SEOHead'

const LAUNCH_DATE = import.meta.env.VITE_LAUNCH_DATE || '2026-08-01T00:00:00'

function getTimeLeft(target) {
  const diff = new Date(target) - new Date()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function ComingSoonPage() {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(LAUNCH_DATE))

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(LAUNCH_DATE)), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <SEOHead
        title="Coming Soon — FindDOTPhysical.com"
        description="Oklahoma's CDL Medical Exam Directory is launching soon. Find FMCSA-certified DOT physical examiners near you."
        canonical="https://www.finddotphysical.com"
        noindex
      />

      <div className="cs-page">
        <div className="cs-inner">
          <div className="cs-logo">
            <span className="cs-logo-icon">🚛</span>
            <span className="cs-logo-name">FindDOTPhysical.com</span>
          </div>

          <h1 className="cs-title">We're Launching Soon</h1>
          <p className="cs-sub">
            Oklahoma's FMCSA-certified DOT physical examiner directory is on its way.
            <br />
            Find certified medical examiners, compare clinics, and get your CDL medical card fast.
          </p>

          <div className="cs-timer" aria-label="Countdown to launch">
            <div className="cs-unit">
              <span className="cs-num">{pad(timeLeft.days)}</span>
              <span className="cs-label">Days</span>
            </div>
            <span className="cs-sep" aria-hidden="true">:</span>
            <div className="cs-unit">
              <span className="cs-num">{pad(timeLeft.hours)}</span>
              <span className="cs-label">Hours</span>
            </div>
            <span className="cs-sep" aria-hidden="true">:</span>
            <div className="cs-unit">
              <span className="cs-num">{pad(timeLeft.minutes)}</span>
              <span className="cs-label">Minutes</span>
            </div>
            <span className="cs-sep" aria-hidden="true">:</span>
            <div className="cs-unit">
              <span className="cs-num">{pad(timeLeft.seconds)}</span>
              <span className="cs-label">Seconds</span>
            </div>
          </div>

          {/* <p className="cs-footer-note">
            Are you an FMCSA National Registry Certified Medical Examiner?{' '}
            <a href="/admin" className="cs-admin-link">
              Get early access →
            </a>
          </p> */}
        </div>

        <p className="cs-copy">
          © {new Date().getFullYear()} FindDOTPhysical.com · Oklahoma's CDL Medical Exam Directory
        </p>
      </div>
    </>
  )
}
