import { useEffect, useState } from 'react'

const CITIES = [
  'All Cities',
  'Oklahoma City',
  'Tulsa',
  'Norman',
  'Lawton',
  'Edmond',
  'Broken Arrow',
  'Midwest City',
]

export default function SearchBar({ onSearch }) {
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [walkIns, setWalkIns] = useState(false)
  const [openWeekends, setOpenWeekends] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch({ search, city: city === 'All Cities' ? '' : city, walkIns, openWeekends })
    }, 150)
    return () => clearTimeout(timer)
  }, [search, city, walkIns, openWeekends, onSearch])

  function handleSubmit(e) {
    e?.preventDefault()
    onSearch({ search, city: city === 'All Cities' ? '' : city, walkIns, openWeekends })
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, city, or clinic type…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search examiners"
        />

        <select
          className="search-select"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label="Filter by city"
        >
          {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <button type="submit" className="btn btn--search">Search</button>
      </div>

      <div className="search-filters">
        <label className="filter-check">
          <input
            type="checkbox"
            checked={walkIns}
            onChange={(e) => setWalkIns(e.target.checked)}
          />
          Walk-ins Welcome
        </label>
        <label className="filter-check">
          <input
            type="checkbox"
            checked={openWeekends}
            onChange={(e) => setOpenWeekends(e.target.checked)}
          />
          Open Weekends
        </label>
      </div>
    </form>
  )
}
