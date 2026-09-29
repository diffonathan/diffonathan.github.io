import Navbar from './components/Navbar'
import Torche from './components/Torche'
import Hero from './components/Hero'
import About from './components/About'
import TechStack from './components/TechStack'
import Projects from './components/Projects'
import Services from './components/Services'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { useContenu } from './i18n'

function App() {
  const { ui } = useContenu()

  return (
    <>
      <a href="#main" className="skip-link">
        {ui.skipLink}
      </a>
      <Torche />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Services />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
