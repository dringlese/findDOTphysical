import { useEffect, useRef, useState } from 'react'
import { HiMagnifyingGlass, HiMapPin } from 'react-icons/hi2'
import { OK_CITIES, CITY_FILTER_ALL } from '../lib/cities'

export default function SearchBar({ onSearch }) {
  const [search, setSearch] = useState('')
  const [city, setCity] = useState(CITY_FILTER_ALL)
  const [walkIns, setWalkIns] = useState(false)
  const [openWeekends, setOpenWeekends] = useState(false)
  const timerRef = useRef(null)
  const onSearchRef = useRef(onSearch)
  const mountedRef = useRef(false)

  onSearchRef.current = onSearch

  function buildFilters() {
    return {
      search: search.trim(),
      city: city === CITY_FILTER_ALL ? '' : city,
      walkIns,
      openWeekends,
    }
  }

  function runSearch(immediate = false) {
    clearTimeout(timerRef.current)
    const execute = () => onSearchRef.current(buildFilters())
    if (immediate) execute()
    else timerRef.current = setTimeout(execute, 300)
  }

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      onSearchRef.current(buildFilters())
      return
    }
    runSearch(false)
    return () => clearTimeout(timerRef.current)
  }, [search, city, walkIns, openWeekends]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(e) {
    e.preventDefault()
    runSearch(true)
  }

  function handleClear() {
    setSearch('')
    setCity(CITY_FILTER_ALL)
    setWalkIns(false)
    setOpenWeekends(false)
  }

  const hasActiveFilters =
    search.trim() || city !== CITY_FILTER_ALL || walkIns || openWeekends

  return (
    <form className="search-bar" onSubmit={handleSubmit} aria-label="Search filters">
      <div className="search-controls">
        <div className="search-name-field">
          <label htmlFor="examiner-search" className="search-field-label">
            Practice name
          </label>
          <div className="search-input-wrap">
            <HiMagnifyingGlass className="search-input-icon" aria-hidden="true" />
            <input
              id="examiner-search"
              type="search"
              className="search-input search-input--icon"
              placeholder="Practice name starts with…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-describedby="search-hint"
              autoComplete="off"
              enterKeyHint="search"
            />
          </div>
        </div>

        <div className="search-city-field">
          <label htmlFor="city-filter" className="search-field-label">
            City
          </label>
          <div className="search-select-wrap">
            <HiMapPin className="search-select-icon" aria-hidden="true" />
            <select
              id="city-filter"
              className="search-select search-select--icon"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
            <option value={CITY_FILTER_ALL}>{CITY_FILTER_ALL}</option>
            {OK_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            </select>
          </div>
        </div>
      </div>

      <p id="search-hint" className="search-hint">
        Matches practice names that start with your text. Use the city dropdown for location.
      </p>

      <div className="search-filters">
        <label className="filter-check">
          <input
            type="checkbox"
            checked={walkIns}
            onChange={(e) => setWalkIns(e.target.checked)}
          />
          <span>Walk-ins Welcome</span>
        </label>
        <label className="filter-check">
          <input
            type="checkbox"
            checked={openWeekends}
            onChange={(e) => setOpenWeekends(e.target.checked)}
          />
          <span>Open Weekends</span>
        </label>
        {hasActiveFilters && (
          <button type="button" className="btn-clear" onClick={handleClear}>
            Clear filters
          </button>
        )}
      </div>
    </form>
  )
}
