import {
  HiPhone,
  HiGlobeAlt,
  HiStar,
  HiCheckBadge,
  HiArrowTopRightOnSquare,
} from 'react-icons/hi2'
import { redirectToCheckout } from '../lib/stripe'
import HoursDisplay from './HoursDisplay'

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function formatPhone(raw) {
  if (!hasText(raw)) return null
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  if (digits.length === 11 && digits[0] === '1') {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  return raw.trim()
}

function telHref(raw) {
  if (!hasText(raw)) return null
  const digits = raw.replace(/\D/g, '')
  const ten =
    digits.length === 10
      ? digits
      : digits.length === 11 && digits[0] === '1'
        ? digits.slice(1)
        : null
  if (!ten) return null
  return `tel:+1${ten}`
}

function normalizeWebsite(url) {
  if (!hasText(url)) return null
  const trimmed = url.trim()
  return trimmed.startsWith('http://') || trimmed.startsWith('https://')
    ? trimmed
    : `https://${trimmed}`
}

function badgeClass(name) {
  const n = name.toLowerCase()
  if (n.includes('walk-in')) return 'badge badge--walkin'
  if (n.includes('weekend')) return 'badge badge--weekend'
  if (n.includes('fmcsa') || n.includes('certified')) return 'badge badge--certified'
  return 'badge'
}

export default function ExaminerCard({ examiner }) {
  const {
    id, name, practice_name, clinic_type, city, state, address, phone, fax,
    price, wait_time, hours, badges = [],
    tier, verified, website,
  } = examiner

  const isPremium = tier === 'premium'
  const isFeatured = tier === 'featured'

  const displayPhone = formatPhone(phone)
  const phoneHref = telHref(phone)
  const displayFax = formatPhone(fax)
  const websiteUrl = normalizeWebsite(website)
  const showHours = hasText(hours)

  const locationLine = [clinic_type, city ? `${city}, ${state || 'OK'}` : null]
    .filter(Boolean)
    .join(' · ')

  const visibleBadges = badges.filter((b) => hasText(b))

  async function handleUpgrade(targetTier) {
    try {
      await redirectToCheckout({ tier: targetTier, examinerId: id })
    } catch (err) {
      alert('Could not start checkout: ' + err.message)
    }
  }

  return (
    <article
      className={`examiner-card ${isPremium ? 'card--premium' : isFeatured ? 'card--featured' : ''}`}
    >
      {(isPremium || isFeatured) && (
        <div className="card-tier-row">
          {isPremium && (
            <span className="card-badge card-badge--premium">
              <HiStar className="icon-inline" aria-hidden="true" /> Premium
            </span>
          )}
          {isFeatured && !isPremium && (
            <span className="card-badge card-badge--featured">Featured</span>
          )}
        </div>
      )}

      <header className="card-header">
        <h3 className="card-name">{name}</h3>
        {hasText(practice_name) && (
          <p className="card-practice">{practice_name.trim()}</p>
        )}
        {verified && (
          <span className="verified-badge" title="FMCSA Verified">
            <HiCheckBadge className="icon-inline" aria-hidden="true" />
            FMCSA Verified
          </span>
        )}
        {locationLine && <p className="card-clinic">{locationLine}</p>}
        {hasText(address) && <p className="card-address">{address.trim()}</p>}
      </header>

      {(price || wait_time || showHours) && (
        <dl className="card-details">
          {price && (
            <div className="card-detail">
              <dt>Price</dt>
              <dd>{price}</dd>
            </div>
          )}
          {wait_time && (
            <div className="card-detail">
              <dt>Wait time</dt>
              <dd>{wait_time}</dd>
            </div>
          )}
          {showHours && (
            <div className="card-detail card-detail--hours">
              <dt>Hours</dt>
              <dd>
                <HoursDisplay hours={hours} />
              </dd>
            </div>
          )}
        </dl>
      )}

      {visibleBadges.length > 0 && (
        <ul className="card-badges" aria-label="Clinic features">
          {visibleBadges.map((b) => (
            <li key={b}>
              <span className={badgeClass(b)}>{b}</span>
            </li>
          ))}
        </ul>
      )}

      <footer className="card-contact">
        {phoneHref ? (
          <a
            href={phoneHref}
            className="btn btn--call"
            aria-label={`Call ${name}${displayPhone ? ` at ${displayPhone}` : ''}`}
          >
            <HiPhone className="btn-call-icon" aria-hidden="true" />
            <span className="btn-call-text">
              <span className="btn-call-label">Call Now</span>
              {displayPhone && <span className="btn-call-number">{displayPhone}</span>}
            </span>
          </a>
        ) : (
          <span className="card-no-phone">Phone not listed</span>
        )}

        <div className="card-contact-secondary">
          {websiteUrl && (
            <a
              href={websiteUrl}
              className="card-link card-link--website"
              target="_blank"
              rel="noopener noreferrer"
            >
              <HiGlobeAlt className="icon-inline" aria-hidden="true" />
              Visit website
              <HiArrowTopRightOnSquare className="icon-inline icon-external" aria-hidden="true" />
            </a>
          )}
          {displayFax && (
            <span className="card-fax">
              <span className="card-fax-label">Fax</span> {displayFax}
            </span>
          )}
        </div>
      </footer>

      {(tier === 'free' || tier === 'featured') && (
        <div className="card-upgrade-row">
          {tier === 'free' && (
            <button
              type="button"
              className="btn btn--upgrade btn--featured"
              onClick={() => handleUpgrade('featured')}
            >
              Upgrade to Featured — $49/mo
            </button>
          )}
          <button
            type="button"
            className="btn btn--upgrade btn--premium"
            onClick={() => handleUpgrade('premium')}
          >
            Upgrade to Premium — $99/mo
          </button>
        </div>
      )}
    </article>
  )
}
