import Reveal from './ui/Reveal'
import SectionHeading from './ui/SectionHeading'
import { services, servicesSection } from '../data/portfolio'

export default function Services() {
  return (
    <section id="services" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title={servicesSection.title} subtitle={servicesSection.subtitle} />

        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.08}>
              <div className="card card-hover h-full p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/[0.12] text-accent">
                  <service.icon size={24} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary">
                  {service.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
