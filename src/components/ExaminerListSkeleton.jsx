import ExaminerCardSkeleton from './ExaminerCardSkeleton'

export default function ExaminerListSkeleton({ count = 4 }) {
  return (
    <div className="results-grid" aria-busy="true" aria-label="Loading examiners">
      {Array.from({ length: count }, (_, i) => (
        <ExaminerCardSkeleton key={i} />
      ))}
    </div>
  )
}
