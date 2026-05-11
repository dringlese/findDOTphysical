import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CityPage from './pages/CityPage'
import GetListedPage from './pages/GetListedPage'
import AdminPage from './pages/AdminPage'
import UpgradeSuccessPage from './pages/UpgradeSuccessPage'
import './styles/global.css'

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* City SEO pages */}
          <Route path="/:city" element={<CityPage />} />

          {/* Other pages */}
          <Route path="/get-listed" element={<GetListedPage />} />
          <Route path="/upgrade-success" element={<UpgradeSuccessPage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </HelmetProvider>
  )
}
