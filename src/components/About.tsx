import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import { about, identity, stats } from '../data/portfolio'
import type { Stat } from '../data/portfolio'

/** Compteur animé (0 → valeur) déclenché à l'apparition, en tabular-nums. */
function StatCard({ stat, delay }: { stat: Stat; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(reduceMotion ? stat.value : 0)

  useEffect(() => {
    if (!inView || reduceMotion) return
    const controls = animate(0, stat.value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, reduceMotion, stat.value])

  return (
    <Reveal delay={delay}>
      <div ref={ref} className="card card-hover px-6 py-8 text-center">
        <p className="stat-number text-4xl text-accent">
          {display}
          {stat.suffix}
        </p>
        <p className="mt-2 text-sm text-secondary">{stat.label}</p>
      </div>
    </Reveal>
  )
}

export default function About() {
  const [photoError, setPhotoError] = useState(false)

  return (
    <section id="a-propos" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title={about.title} />

        <div className="grid items-center gap-12 md:grid-cols-[auto_1fr]">
          {/* Photo (ronde) avec repli sur les initiales si absente */}
          <Reveal className="justify-self-center">
            <div className="relative">
              <div
                className="absolute -inset-2 rounded-full bg-accent/20 blur-2xl"
                aria-hidden="true"
              />
              {photoError ? (
                <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-2 border-accent/40 bg-card text-4xl font-bold text-accent sm:h-52 sm:w-52">
                  {identity.initials}
                </div>
              ) : (
                <img
                  src={about.photoUrl}
                  alt={`Portrait de ${identity.name}`}
                  width={208}
                  height={208}
                  loading="lazy"
                  className="relative h-44 w-44 rounded-full border-2 border-accent/40 object-cover sm:h-52 sm:w-52"
                  onError={() => setPhotoError(true)}
                />
              )}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-4">
              {about.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="leading-relaxed text-body">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
