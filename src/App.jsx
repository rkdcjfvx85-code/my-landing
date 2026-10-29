import Header from './components/Header'
import Hero from './components/Hero'
import CasePanorama from './components/CasePanorama'
import PracticeAreas from './components/PracticeAreas'
import Process from './components/Process'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CasePanorama />
        <PracticeAreas />
        <Process />
      </main>
      <Footer />
    </>
  )
}
