import { Helmet } from 'react-helmet-async'
import { HiOutlineExclamationCircle } from 'react-icons/hi2'
import ExaminerCard from './ExaminerCard'
import ExaminerListSkeleton from './ExaminerListSkeleton'
import { buildExaminerSchema } from './SEOHead'

/**
 * Shared results area: skeleton while loading, then list or empty state.
 */
export default function ExaminerResults({
  examiners,
  loading,
  error,
  countLabel,
  emptyMessage,
  sortHint = ' · Premium listings first',
}) {
  if (loading) {
    return (
      <>
        <div className="results-count results-count--skeleton">
          <span className="skeleton skeleton-count" />
        </div>
        <ExaminerListSkeleton count={4} />
      </>
    )
  }

  if (error) {
    return (
      <p className="state-msg state-msg--error" role="alert">
        <HiOutlineExclamationCircle className="state-msg-icon" aria-hidden="true" />
        {error}
      </p>
    )
  }

  return (
    <>
      {examiners.length > 0 && (
        <Helmet>
          {examiners.map((ex) => (
            <script key={ex.id} type="application/ld+json">
              {JSON.stringify(buildExaminerSchema(ex))}
            </script>
          ))}
        </Helmet>
      )}

      <p className="results-count">
        {countLabel}
        {examiners.length > 0 && sortHint && (
          <span className="results-sort-hint">{sortHint}</span>
        )}
      </p>

      {examiners.length === 0 ? (
        <div className="state-msg state-msg--empty">{emptyMessage}</div>
      ) : (
        <div className="results-grid">
          {examiners.map((ex) => (
            <ExaminerCard key={ex.id} examiner={ex} />
          ))}
        </div>
      )}
    </>
  )
}
