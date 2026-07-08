import { lazy, Suspense } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Download } from 'lucide-react'
import { hero, identity } from '../data/portfolio'

// Three.js est chargé en différé pour ne pas retarder le premier affichage
const ThreeBackground = lazy(() => import('./ThreeBackground'))

export default function Hero() {
  const reduceMotion = useReducedMotion()

  const enter = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: 'easeOut' as const },
        }

  return (
    <section
      id="accueil"
      className="relative flex min-h-dvh items-center overflow-hidden"
    >
      {/* Fond ConfluenceTerminal : grille technique + orbes vert/bleu + réseau Three.js */}
      <div className="bg-grid" aria-hidden="true" />
      <div
        className="absolute -left-24 top-16 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[90px]"
        aria-hidden="true"
      />
      <div
        className="absolute -right-24 bottom-10 h-[460px] w-[460px] rounded-full bg-info/10 blur-[100px]"
        aria-hidden="true"
      />
      <Suspense fallback={null}>
        <ThreeBackground />
      </Suspense>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-28 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div {...enter(0)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-medium text-secondary backdrop-blur">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              {identity.availabilityBadge}
            </span>
          </motion.div>

          <motion.h1
            {...enter(0.1)}
            className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-6xl"
          >
            {identity.name}
          </motion.h1>

          <motion.p
            {...enter(0.2)}
            className="grad-text mt-4 text-lg font-bold sm:text-xl"
          >
            {identity.baseline}
          </motion.p>

          <motion.p
            {...enter(0.3)}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-body sm:text-lg"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            {...enter(0.4)}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a href="#projets" className="btn-primary w-full sm:w-auto">
              {hero.ctaPrimary}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a
              href={identity.cvUrl}
              download
              className="btn-secondary w-full sm:w-auto"
            >
              <Download size={18} aria-hidden="true" />
              {hero.ctaSecondary}
            </a>
          </motion.div>

          <motion.p {...enter(0.5)} className="mt-8 text-sm text-secondary">
            {identity.location}
          </motion.p>
        </div>
      </div>

    </section>
  )
}
