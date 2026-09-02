import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import PageLoader from './components/PageLoader.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Report = lazy(() => import('./pages/Report.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Tracker = lazy(() => import('./pages/Tracker.jsx'))
const Methane = lazy(() => import('./pages/Methane.jsx'))
const DataExport = lazy(() => import('./pages/DataExport.jsx'))
const About = lazy(() => import('./pages/About.jsx'))

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <Navbar />
      <main className="flex-1 pt-20 print:pt-0">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<Report />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/methane" element={<Methane />} />
            <Route path="/data" element={<DataExport />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
