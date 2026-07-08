import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { identity, navCta, navLinks } from '../data/portfolio'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('#accueil')

  // Scroll-spy : met en surbrillance le lien de la section visible
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter((el): el is Element => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`)
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Navigation principale"
      >
        {/* Logo */}
        <a href="#accueil" className="flex items-center gap-3" onClick={closeMobile}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
            {identity.initials}
          </span>
          <span className="hidden text-sm font-semibold sm:block">{identity.name}</span>
        </a>

        {/* Liens desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  activeSection === link.href
                    ? 'text-accent-soft'
                    : 'text-secondary hover:text-foreground'
                }`}
                aria-current={activeSection === link.href ? 'true' : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href={navCta.href} className="btn-primary hidden px-5 py-2.5 md:inline-flex">
            {navCta.label}
          </a>

          {/* Burger mobile */}
          <button
            type="button"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-secondary transition-colors hover:text-foreground md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Menu mobile — toujours dans le DOM (cible valide d'aria-controls) */}
      <div
        id="mobile-menu"
        hidden={!mobileOpen}
        className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-background md:hidden"
      >
        <ul className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  activeSection === link.href
                    ? 'bg-accent/10 text-accent-soft'
                    : 'text-secondary hover:bg-surface hover:text-foreground'
                }`}
                aria-current={activeSection === link.href ? 'true' : undefined}
                onClick={closeMobile}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="mt-2">
            <a href={navCta.href} className="btn-primary w-full" onClick={closeMobile}>
              {navCta.label}
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
