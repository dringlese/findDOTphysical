/** Placeholder card while examiner data loads */
export default function ExaminerCardSkeleton() {
  return (
    <div className="examiner-card examiner-card--skeleton" aria-hidden="true">
      <div className="skeleton skeleton-badge" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-line skeleton-line--short" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton-block">
        <div className="skeleton skeleton-detail" />
        <div className="skeleton skeleton-detail" />
        <div className="skeleton skeleton-detail" />
      </div>
      <div className="skeleton-row">
        <div className="skeleton skeleton-pill" />
        <div className="skeleton skeleton-pill" />
      </div>
      <div className="skeleton skeleton-button" />
    </div>
  )
}
