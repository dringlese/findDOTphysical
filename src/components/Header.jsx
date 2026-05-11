import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo">
          🚛 <span>FindDOTPhysical</span><span className="logo-tld">.com</span>
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
