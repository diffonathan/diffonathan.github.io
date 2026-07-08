import Reveal from './ui/Reveal'
import Badge from './ui/Badge'
import SectionHeading from './ui/SectionHeading'
import { stackCategories, stackSection } from '../data/portfolio'

export default function TechStack() {
  return (
    <section id="stack" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title={stackSection.title} subtitle={stackSection.subtitle} />

        <div className="grid gap-6 sm:grid-cols-2">
          {stackCategories.map((category, index) => (
            <Reveal key={category.title} delay={index * 0.08}>
              <div className="card card-hover h-full p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/[0.12] text-accent">
                    <category.icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-semibold">{category.title}</h3>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <li key={item}>
                      <Badge label={item} />
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
