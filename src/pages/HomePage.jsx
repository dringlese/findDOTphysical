import { useState, useCallback, useRef } from 'react'
import { getExaminers } from '../lib/supabase'
import SearchBar from '../components/SearchBar'
import ExaminerResults from '../components/ExaminerResults'
import SEOHead from '../components/SEOHead'

export default function HomePage() {
  const [examiners, setExaminers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const hasLoadedOnce = useRef(false)

  const fetchExaminers = useCallback(async (filters) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getExaminers(filters)
      setExaminers(data)
      hasLoadedOnce.current = true
    } catch (err) {
      setError(err.message)
      if (!hasLoadedOnce.current) setExaminers([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = useCallback(
    (newFilters) => {
      fetchExaminers(newFilters)
    },
    [fetchExaminers]
  )

  return (
    <>
      <SEOHead
        title="Find DOT Physical Examiners in Oklahoma — Same Day Available"
        description="Search FMCSA-certified DOT physical examiners across Oklahoma. Filter by city, walk-ins, and weekend availability. Get your CDL medical card fast."
        canonical="https://www.finddotphysical.com"
      />

      <main className="main">
        <section className="hero">
          <h1 className="hero-title">Find a DOT Physical Examiner in Oklahoma</h1>
          <p className="hero-sub">
            FMCSA-certified examiners. Same-day appointments. CDL medical cards.
          </p>
        </section>

        <section className="search-section" aria-label="Search and filters">
          <SearchBar onSearch={handleSearch} />
        </section>

        <section className="results-section" aria-live="polite">
          <ExaminerResults
            examiners={examiners}
            loading={loading}
            error={error}
            countLabel={`${examiners.length} examiner${examiners.length !== 1 ? 's' : ''} found`}
            emptyMessage="No examiners match your search. Try adjusting your filters or clearing them."
          />
        </section>

        <section className="cta-banner">
          <p className="cta-text">Are you a DOT examiner?</p>
          <a href="/get-listed" className="btn btn--cta">Get Listed Free →</a>
        </section>
      </main>
    </>
  )
}
