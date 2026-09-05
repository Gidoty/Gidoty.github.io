import { lazy, Suspense } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import {
  FlaskConical,
  Database,
  Wind,
  TrendingUp,
  Sprout,
  ShieldCheck,
  LayoutList,
  FileDown,
  Leaf,
} from 'lucide-react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import PageLoader from './components/PageLoader.jsx'
import Placeholder from './components/Placeholder.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))

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
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/calculator"
          element={
            <Placeholder
              icon={FlaskConical}
              title="Core Yield Calculator"
              description="Calculates expected biogas and electricity yield from multi-substrate agricultural waste, using peer-reviewed specific biogas yield coefficients."
            />
          }
        />
        <Route
          path="/digester"
          element={
            <Placeholder
              icon={Database}
              title="Digester Sizing Calculator"
              description="Recommends the digester volume you need from your daily waste input, hydraulic retention time, and digester type."
            />
          }
        />
        <Route
          path="/emissions"
          element={
            <Placeholder
              icon={Wind}
              title="Emissions-Avoided Estimator"
              description="Estimates methane emissions avoided using IPCC 2006/2019 Tier 1 methodology across three baseline disposal scenarios."
            />
          }
        />
        <Route
          path="/carbon"
          element={
            <Placeholder
              icon={TrendingUp}
              title="Carbon Credit Value Projector"
              description="Projects verified carbon credit volume and indicative market value under Gold Standard AWMS, CDM AMS-III, and Article 6.4."
            />
          }
        />
        <Route
          path="/digestate"
          element={
            <Placeholder
              icon={Sprout}
              title="Digestate Nutrient Estimator"
              description="Calculates the NPK content of your digester effluent and its fertiliser replacement value in NGN and USD."
            />
          }
        />
        <Route
          path="/compare"
          element={
            <Placeholder
              icon={LayoutList}
              title="Feasibility Comparison Mode"
              description="Compares up to three substrate or site scenarios side by side to find the highest yield and carbon return."
            />
          }
        />
        <Route
          path="/audit"
          element={
            <Placeholder
              icon={ShieldCheck}
              title="Verification Audit Trail"
              description="Logs every input and calculation step with a SHA-256 hash for a tamper-evident, independently verifiable record."
            />
          }
        />
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
  )
}
