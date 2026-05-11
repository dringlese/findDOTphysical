import { redirectToCheckout } from '../lib/stripe'

export default function ExaminerCard({ examiner }) {
  const {
    id, name, clinic_type, city, phone, rating, review_count,
    price, wait_time, hours, badges = [], tier, verified,
  } = examiner

  const isPremium = tier === 'premium'
  const isFeatured = tier === 'featured'

  async function handleUpgrade(targetTier) {
    try {
      await redirectToCheckout({ tier: targetTier, examinerId: id })
    } catch (err) {
      alert('Could not start checkout: ' + err.message)
    }
  }

  return (
    <div className={`examiner-card ${isPremium ? 'card--premium' : isFeatured ? 'card--featured' : ''}`}>
      {isPremium && <div className="card-badge card-badge--premium">⭐ Premium</div>}
      {isFeatured && !isPremium && <div className="card-badge card-badge--featured">Featured</div>}

      <div className="card-header">
        <div>
          <h3 className="card-name">
            {name}
            {verified && <span className="verified-badge" title="FMCSA Verified">✓</span>}
          </h3>
          <p className="card-clinic">{clinic_type} · {city}, OK</p>
        </div>
        <div className="card-rating">
          <span className="rating-score">{rating?.toFixed(1) ?? '—'}</span>
          <span className="rating-count">({review_count ?? 0} reviews)</span>
        </div>
      </div>

      <div className="card-meta">
        <MetaItem icon="💰" label="Price" value={price} />
        <MetaItem icon="⏱" label="Wait" value={wait_time} />
        <MetaItem icon="🕐" label="Hours" value={hours} />
      </div>

      {badges.length > 0 && (
        <div className="card-badges">
          {badges.map((b) => <span key={b} className="badge">{b}</span>)}
        </div>
      )}

      <div className="card-actions">
        <a href={`tel:${phone}`} className="btn btn--call">📞 Call Now</a>

        {tier === 'free' && (
          <button className="btn btn--upgrade btn--featured" onClick={() => handleUpgrade('featured')}>
            Upgrade to Featured — $49/mo
          </button>
        )}
        {(tier === 'free' || tier === 'featured') && (
          <button className="btn btn--upgrade btn--premium" onClick={() => handleUpgrade('premium')}>
            Upgrade to Premium — $99/mo
          </button>
        )}
      </div>
    </div>
  )
}

function MetaItem({ icon, label, value }) {
  return value ? (
    <span className="meta-item">
      {icon} <strong>{label}:</strong> {value}
    </span>
  ) : null
}
