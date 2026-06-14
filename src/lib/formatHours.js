/**
 * Parse and format clinic hours for display.
 * Handles: "Mon–Fri 7am–6pm", "Mon–Sun 8am–8pm", "24/7", multi-line, etc.
 */

const DAY_NAMES = [
  ['monday', 'Mon'],
  ['tuesday', 'Tue'],
  ['wednesday', 'Wed'],
  ['thursday', 'Thu'],
  ['friday', 'Fri'],
  ['saturday', 'Sat'],
  ['sunday', 'Sun'],
]

const SPECIAL_HOURS = [
  [/\b24\s*\/\s*7\b|\b24\s*hours?\b|\balways\s*open\b/i, 'Open 24 hours'],
  [/\bby\s+appointment\b/i, 'By appointment only'],
  [/\bclosed\b/i, 'Closed'],
]

/** @param {string} t */
function formatTime(t) {
  const m = t.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i)
  if (!m) return t.trim()
  const h = parseInt(m[1], 10)
  const min = m[2]
  const ap = m[3].toUpperCase()
  if (min) return `${h}:${min} ${ap}`
  return `${h} ${ap}`
}

/** @param {string} range e.g. "7am–6pm" */
function formatTimeRange(range) {
  const parts = range.trim().split(/\s*[-–—]\s*/)
  if (parts.length < 2) return range.trim()
  return `${formatTime(parts[0])} – ${formatTime(parts[1])}`
}

/** @param {string} days */
function formatDays(days) {
  let d = days.trim()
  for (const [full, abbr] of DAY_NAMES) {
    d = d.replace(new RegExp(`\\b${full}\\b`, 'gi'), abbr)
  }
  d = d.replace(/\s*[-–—]\s*/g, '–')
  d = d.replace(/\b([A-Za-z]{3})\s*-\s*([A-Za-z]{3})\b/g, '$1–$2')
  return d.replace(/\s+/g, ' ').trim()
}

/**
 * @param {string} segment e.g. "Mon–Fri 7am–6pm"
 * @returns {{ days: string, times: string } | null}
 */
function parseSegment(segment) {
  const timeMatch = segment.match(
    /(\d{1,2}(?::\d{2})?\s*(?:am|pm)\s*[-–—]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm))/i
  )
  if (!timeMatch) return null

  const timeStr = timeMatch[1]
  const daysStr = segment.slice(0, timeMatch.index).trim()
  if (!daysStr) return null

  return {
    days: formatDays(daysStr),
    times: formatTimeRange(timeStr),
  }
}

/** @param {string} raw */
function splitIntoSegments(raw) {
  if (raw.includes('\n')) {
    return raw.split(/\n+/).map((s) => s.trim()).filter(Boolean)
  }
  const commaSplit = raw.split(/,\s*(?=[A-Za-z])/)
  return commaSplit.length > 1 ? commaSplit : [raw]
}

/**
 * @param {string | null | undefined} raw
 * @returns {{ kind: 'lines', lines: { days: string, times: string }[] } | { kind: 'text', text: string } | null}
 */
export function parseHours(raw) {
  if (typeof raw !== 'string' || !raw.trim()) return null

  const input = raw.trim().replace(/\s+/g, ' ')

  for (const [pattern, label] of SPECIAL_HOURS) {
    if (pattern.test(input)) return { kind: 'text', text: label }
  }

  const segments = splitIntoSegments(input)
  const lines = segments.map(parseSegment).filter(Boolean)

  if (lines.length > 0) return { kind: 'lines', lines }

  // Fallback: light cleanup for unrecognized formats
  const text = input
    .replace(/\s*[-–—]\s*/g, (m, offset, str) => {
      const before = str.slice(0, offset)
      if (/\d\s*$/.test(before) || /^\s*\d/.test(str.slice(offset + m.length))) {
        return ' – '
      }
      return '–'
    })
    .replace(/(\d)\s*(am|pm)/gi, '$1 $2')
    .replace(/\b(am|pm)\b/gi, (m) => m.toUpperCase())

  return { kind: 'text', text }
}
