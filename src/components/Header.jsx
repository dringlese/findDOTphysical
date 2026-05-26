import { Link } from 'react-router-dom'
import { HiTruck } from 'react-icons/hi2'

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <HiTruck className="logo-icon" aria-hidden="true" />
          <span className="logo-text">
            <span className="logo-name">FindDOTPhysical</span>
            <span className="logo-tld">.com</span>
          </span>
        </Link>
        <nav className="header-nav">
          <Link to="/oklahoma-city" className="nav-link">Oklahoma City</Link>
          <Link to="/tulsa" className="nav-link">Tulsa</Link>
          <Link to="/edmond" className="nav-link">Edmond</Link>
          <Link to="/get-listed" className="btn btn--get-listed">Get Listed</Link>
        </nav>
      </div>
    </header>
  )
}
