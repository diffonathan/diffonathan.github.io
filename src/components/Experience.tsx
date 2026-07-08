import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import { experience, experienceSection } from '../data/portfolio'

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading
          title={experienceSection.title}
          subtitle={experienceSection.subtitle}
        />

        <ol className="relative space-y-10 border-l border-border pl-8 sm:pl-10">
          {experience.map((item, index) => (
            <li key={`${item.role}-${item.company}`} className="relative">
              {/* Point de la timeline */}
              <span
                className="absolute -left-[41px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-accent bg-background sm:-left-[49px]"
                aria-hidden="true"
              />
              <Reveal delay={index * 0.08}>
                <div className="card card-hover p-6">
                  <p className="stat-number text-sm text-accent-soft">{item.period}</p>
                  <h3 className="mt-2 text-lg font-semibold">{item.role}</h3>
                  <p className="mt-0.5 text-sm font-medium text-secondary">{item.company}</p>
                  <ul className="mt-4 space-y-2">
                    {item.missions.map((mission) => (
                      <li
                        key={mission.slice(0, 40)}
                        className="flex gap-2.5 text-sm leading-relaxed text-secondary"
                      >
                        <span
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent"
                          aria-hidden="true"
                        />
                        {mission}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
