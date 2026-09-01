import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import PageLoader from './components/shared/PageLoader.jsx'

const Home = lazy(() => import('./pages/Home.jsx'))
const Calculator = lazy(() => import('./pages/Calculator.jsx'))
const CrudeAdvisor = lazy(() => import('./pages/CrudeAdvisor.jsx'))
const ConstraintSimulator = lazy(() => import('./pages/ConstraintSimulator.jsx'))
const StressTester = lazy(() => import('./pages/StressTester.jsx'))
const About = lazy(() => import('./pages/About.jsx'))

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-armit-bg text-armit-text">
      <Navbar />
      <main className="flex-1 pt-20">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/crude-advisor" element={<CrudeAdvisor />} />
            <Route path="/constraint-simulator" element={<ConstraintSimulator />} />
            <Route path="/stress-tester" element={<StressTester />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
