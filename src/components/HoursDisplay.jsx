import { parseHours } from '../lib/formatHours'

export default function HoursDisplay({ hours }) {
  const parsed = parseHours(hours)
  if (!parsed) return null

  if (parsed.kind === 'text') {
    return <span className="hours-text">{parsed.text}</span>
  }

  return (
    <div className="hours-display">
      {parsed.lines.map((line, i) => (
        <div key={i} className="hours-line">
          <span className="hours-days">{line.days}</span>
          <span className="hours-times">{line.times}</span>
        </div>
      ))}
    </div>
  )
}
