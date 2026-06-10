import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getExaminers } from '../lib/supabase'
import ExaminerResults from '../components/ExaminerResults'
import SEOHead from '../components/SEOHead'

// Map URL slug → display name + SEO copy
const CITY_META = {
  'oklahoma-city': {
    display: 'Oklahoma City',
    intro: `Oklahoma City is home to dozens of FMCSA-certified DOT physical examiners ready to get your CDL medical card processed quickly.
    Many clinics offer same-day appointments, walk-in availability, and weekend hours to fit your schedule.
    Whether you drive locally or OTR, find a trusted examiner right here in OKC.`,
  },
  tulsa: {
    display: 'Tulsa',
    intro: `Tulsa's network of DOT physical examiners spans urgent care clinics, occupational health centers, and chiropractic offices.
    Most offer fast turnaround so you can stay on the road without delay.
    Filter below for walk-in availability or weekend hours that work for your route.`,
  },
  norman: {
    display: 'Norman',
    intro: `Norman drivers can find convenient DOT physical exams close to home without making the trip into Oklahoma City.
    Local examiners here are FMCSA-certified and ready to issue your CDL medical certificate same day.
    Check below for pricing, hours, and accepted CDL classes.`,
  },
  lawton: {
    display: 'Lawton',
    intro: `Lawton area CDL drivers can complete their DOT physical exam without a long drive.
    Certified examiners in Lawton offer competitive pricing and often same-day or next-day appointments.
    Browse listings below and call directly to confirm availability.`,
  },
  edmond: {
    display: 'Edmond',
    intro: `Edmond's growing network of DOT examiners makes it easy to renew your CDL medical card close to home.
    Many clinics accept walk-ins and are open on weekends for busy drivers.
    Find your nearest examiner and call to schedule today.`,
  },
  'broken-arrow': {
    display: 'Broken Arrow',
    intro: `Broken Arrow CDL drivers have access to FMCSA-certified examiners right in the Tulsa metro area.
    Same-day appointments and walk-in options are available at select clinics.
    Use the listings below to find the best fit for your schedule and budget.`,
  },
  'midwest-city': {
    display: 'Midwest City',
    intro: `Midwest City is conveniently located for OKC-area CDL drivers needing a fast DOT physical.
    Certified examiners here can issue your medical certificate same day in most cases.
    Browse available clinics below and call to confirm hours before you arrive.`,
  },
}

export default function CityPage() {
  const { city: slug } = useParams()
  const meta = CITY_META[slug]
  const cityName = meta?.display ?? slug

  const [examiners, setExaminers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getExaminers({ city: cityName })
        setExaminers(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [cityName])

  const pageTitle = `DOT Physical Examiners in ${cityName}, OK - Same Day Available`
  const metaDesc = `Find FMCSA-certified DOT physical examiners in ${cityName}, OK. Compare clinics, hours, pricing, and call for your CDL medical card.`

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={metaDesc}
        canonical={`https://www.finddotphysical.com/${slug}`}
      />

      <main className="main">
        <section className="hero hero--city">
          <h1 className="hero-title">DOT Physical Examiners in {cityName}, OK</h1>
          {meta?.intro && <p className="city-intro">{meta.intro}</p>}
        </section>

        <section className="results-section" aria-live="polite">
          <ExaminerResults
            examiners={examiners}
            loading={loading}
            error={error}
            countLabel={`${examiners.length} examiner${examiners.length !== 1 ? 's' : ''} in ${cityName}`}
            emptyMessage={
              <>
                No listings yet for {cityName}.{' '}
                <a href="/get-listed">Be the first to get listed →</a>
              </>
            }
            sortHint=""
          />
        </section>

        <section className="cta-banner">
          <p className="cta-text">Are you a DOT examiner in {cityName}?</p>
          <a href="/get-listed" className="btn btn--cta">Get Listed Free →</a>
        </section>
      </main>
    </>
  )
}
