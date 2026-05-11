import { useState } from 'react'
import SEOHead from '../components/SEOHead'

const TALLY_FORM_ID = import.meta.env.VITE_TALLY_FORM_ID || 'rjGreM'

export default function GetListedPage() {
  const [selectedPlan, setSelectedPlan] = useState('Free Listing')

  return (
    <>
      <SEOHead
        title="Get Your DOT Examiner Clinic Listed — Free"
        description="List your DOT physical exam clinic on FindDOTPhysical.com and reach CDL drivers across Oklahoma. Free basic listing. Featured and Premium tiers available."
        canonical="https://www.finddotphysical.com/get-listed"
      />

      <main className="main">
        <section className="hero">
          <h1 className="hero-title">Get Your Clinic Listed</h1>
          <p className="hero-sub">
            Reach CDL drivers across Oklahoma who need a DOT physical right now.
            Basic listing is <strong>free</strong>. Upgrade for premium placement.
          </p>
        </section>

        {/* Tier comparison */}
        <section className="tiers-section">
          <p className="tiers-note">
            Choose a listing tier first, then submit the form below.
          </p>
          <div className="tier-cards">
            <TierCard
              name="Free"
              price="$0"
              selected={selectedPlan === 'Free Listing'}
              onSelect={() => setSelectedPlan('Free Listing')}
              features={['Basic listing', 'Name, phone, city', 'Call Now button']}
            />
            <TierCard
              name="Featured"
              price="$49/mo"
              highlight
              selected={selectedPlan === 'Featured $49/month'}
              onSelect={() => setSelectedPlan('Featured $49/month')}
              features={[
                'Everything in Free',
                'Subtle featured highlight',
                'Priority placement',
                'Badge display',
              ]}
            />
            <TierCard
              name="Premium"
              price="$99/mo"
              premium
              selected={selectedPlan === 'Premium $99/month'}
              onSelect={() => setSelectedPlan('Premium $99/month')}
              features={[
                'Everything in Featured',
                'Top of results',
                'Green glow border',
                '⭐ Premium badge',
                'Maximum visibility',
              ]}
            />
          </div>
        </section>

        {/* Tally embed */}
        <section className="form-section">
          <h2 className="section-title">Submit Your Listing</h2>
          <div className="selected-plan-banner">
            Selected plan: <strong>{selectedPlan}</strong>
          </div>
          <iframe
            src={`https://tally.so/embed/${TALLY_FORM_ID}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
            loading="lazy"
            width="100%"
            height="500"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Get Listed Form"
            style={{ minHeight: 500 }}
          />
        </section>
      </main>
    </>
  )
}

function TierCard({ name, price, features, highlight, premium, selected, onSelect }) {
  return (
    <div
      className={`tier-card ${highlight ? 'tier-card--featured' : ''} ${premium ? 'tier-card--premium' : ''} ${selected ? 'tier-card--selected' : ''}`}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
      aria-label={`Select ${name} plan`}
    >
      {premium && <div className="tier-badge">⭐ Most Visibility</div>}
      <h3 className="tier-name">{name}</h3>
      <p className="tier-price">{price}</p>
      <ul className="tier-features">
        {features.map((f) => <li key={f}>{f}</li>)}
      </ul>
      <p className="tier-action-text">{selected ? 'Selected' : 'Click to select'}</p>
    </div>
  )
}
