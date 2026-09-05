import Hero from '../components/home/Hero.jsx'
import GapSection from '../components/home/GapSection.jsx'
import FeaturesSection from '../components/home/FeaturesSection.jsx'
import ScienceSection from '../components/home/ScienceSection.jsx'
import BuiltBySection from '../components/home/BuiltBySection.jsx'

export default function Home() {
  return (
    <div>
      <Hero />
      <GapSection />
      <FeaturesSection />
      <ScienceSection />
      <BuiltBySection />
    </div>
  )
}
