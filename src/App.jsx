import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CityPage from './pages/CityPage'
import GetListedPage from './pages/GetListedPage'
import AdminPage from './pages/AdminPage'
import UpgradeSuccessPage from './pages/UpgradeSuccessPage'
import ComingSoonPage from './pages/ComingSoonPage'
import './styles/global.css'

// Set VITE_COMING_SOON=true in .env to enable demo/maintenance mode.
// /admin is always accessible so you can manage listings during the holding period.
const COMING_SOON = import.meta.env.VITE_COMING_SOON === 'true'

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        {COMING_SOON ? (
          <Routes>
            {/* Admin always accessible even in demo mode */}
            <Route path="/admin" element={<AdminPage />} />
            {/* All other routes show the Coming Soon page */}
            <Route path="*" element={<ComingSoonPage />} />
          </Routes>
        ) : (
          <>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/:city" element={<CityPage />} />
              <Route path="/get-listed" element={<GetListedPage />} />
              <Route path="/upgrade-success" element={<UpgradeSuccessPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
            <Footer />
          </>
        )}
      </BrowserRouter>
    </HelmetProvider>
  )
}
