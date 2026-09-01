import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Calculator from './pages/Calculator.jsx'
import CrudeAdvisor from './pages/CrudeAdvisor.jsx'
import ConstraintSimulator from './pages/ConstraintSimulator.jsx'
import StressTester from './pages/StressTester.jsx'
import About from './pages/About.jsx'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-armit-bg text-armit-text">
      <Navbar />
      <main className="flex-1 pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/crude-advisor" element={<CrudeAdvisor />} />
          <Route path="/constraint-simulator" element={<ConstraintSimulator />} />
          <Route path="/stress-tester" element={<StressTester />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
