import { useState, useEffect } from 'react'
import { getExaminers } from '../lib/supabase'
import ExaminerCard from '../components/ExaminerCard'
import SearchBar from '../components/SearchBar'
import SEOHead from '../components/SEOHead'

export default function HomePage() {
  const [examiners, setExaminers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    fetchExaminers(filters)
  }, [])

  async function fetchExaminers(f) {
    setLoading(true)
    setError(null)
    try {
      const data = await getExaminers(f)
      setExaminers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(newFilters) {
    setFilters(newFilters)
    fetchExaminers(newFilters)
  }

  return (
    <>
      <SEOHead
        title="Find DOT Physical Examiners in Oklahoma — Same Day Available"
        description="Search FMCSA-certified DOT physical examiners across Oklahoma. Filter by city, walk-ins, and weekend availability. Get your CDL medical card fast."
        canonical="https://www.finddotphysical.com"
      />

      <main className="main">
        {/* ── Hero ── */}
        <section className="hero">
          <h1 className="hero-title">Find a DOT Physical Examiner in Oklahoma</h1>
          <p className="hero-sub">
            FMCSA-certified examiners. Same-day appointments. CDL medical cards.
          </p>
        </section>

        {/* ── Search ── */}
        <section className="search-section">
          <SearchBar onSearch={handleSearch} />
        </section>

        {/* ── Results ── */}
        <section className="results-section">
          {loading && <p className="state-msg">Loading examiners…</p>}
          {error && <p className="state-msg state-msg--error">Error: {error}</p>}

          {!loading && !error && (
            <>
              <p className="results-count">
                {examiners.length} examiner{examiners.length !== 1 ? 's' : ''} found
              </p>

              {examiners.length === 0 ? (
                <p className="state-msg">No examiners match your search. Try adjusting your filters.</p>
              ) : (
                <div className="results-grid">
                  {examiners.map((ex) => (
                    <ExaminerCard key={ex.id} examiner={ex} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* ── CTA Banner ── */}
        <section className="cta-banner">
          <p className="cta-text">Are you a DOT examiner?</p>
          <a href="/get-listed" className="btn btn--cta">Get Listed Free →</a>
        </section>
      </main>
    </>
  )
}
