import { lazy, Suspense } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { FileDown, Leaf } from 'lucide-react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import PageLoader from './components/PageLoader.jsx'
import Placeholder from './components/Placeholder.jsx'
import { BioCredStoreProvider } from './store/BioCredStore.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Calculator = lazy(() => import('./pages/Calculator.jsx'))
const Digester = lazy(() => import('./pages/Digester.jsx'))
const Emissions = lazy(() => import('./pages/Emissions.jsx'))
const Carbon = lazy(() => import('./pages/Carbon.jsx'))
const Digestate = lazy(() => import('./pages/Digestate.jsx'))
const Compare = lazy(() => import('./pages/Compare.jsx'))
const Audit = lazy(() => import('./pages/Audit.jsx'))

function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <Navbar />
      <main className="flex-1 pt-14">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BioCredStoreProvider>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/digester" element={<Digester />} />
          <Route path="/emissions" element={<Emissions />} />
          <Route path="/carbon" element={<Carbon />} />
          <Route path="/digestate" element={<Digestate />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/audit" element={<Audit />} />
          <Route
            path="/report"
            element={
              <Placeholder
                icon={FileDown}
                title="Exportable Feasibility Report"
                description="Generates a downloadable PDF and CSV report suitable for grant applications, investor pitches, and regulatory submissions."
              />
            }
          />
          <Route
            path="/about"
            element={
              <Placeholder
                icon={Leaf}
                title="About G-BioCred"
                description="The research, methodology, and people behind G-BioCred."
              />
            }
          />
        </Route>
      </Routes>
    </BioCredStoreProvider>
  )
}
