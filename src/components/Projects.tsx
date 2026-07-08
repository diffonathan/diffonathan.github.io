import { ExternalLink, Lock } from 'lucide-react'
import Reveal from './ui/Reveal'
import Badge from './ui/Badge'
import SectionHeading from './ui/SectionHeading'
import { projects, projectsSection } from '../data/portfolio'
import type { Project } from '../data/portfolio'

/* Classes complètes par couleur (Tailwind ne compile pas les classes dynamiques) */
const placeholderStyles: Record<Project['accentColor'], string> = {
  accent: 'from-accent/25 text-accent',
  success: 'from-success/25 text-success',
  info: 'from-info/25 text-info',
  warning: 'from-warning/25 text-warning',
  danger: 'from-danger/25 text-danger',
}

/** Visuel du projet : capture d'écran si fournie, sinon placeholder stylisé. */
function ProjectVisual({ project }: { project: Project }) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={`Capture d'écran de ${project.name}`}
        loading="lazy"
        className="aspect-video w-full rounded-t-2xl object-cover"
      />
    )
  }

  const initials = project.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()

  return (
    <div
      className={`relative flex aspect-video items-center justify-center overflow-hidden rounded-t-2xl border-b border-border bg-gradient-to-br via-surface to-surface ${placeholderStyles[project.accentColor]}`}
      role="img"
      aria-label={`Aperçu à venir pour ${project.name}`}
    >
      {/* Grille décorative discrète */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(color-mix(in srgb, var(--color-border) 60%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-border) 60%, transparent) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />
      <span className="relative text-5xl font-bold tracking-tight opacity-80">
        {initials}
      </span>
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projets" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading title={projectsSection.title} subtitle={projectsSection.subtitle} />

        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project, index) => (
            <Reveal key={project.name} delay={(index % 2) * 0.1}>
              <article className="card card-hover flex h-full flex-col overflow-hidden">
                <ProjectVisual project={project} />

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-semibold">{project.name}</h3>
                  <p className="mt-1 text-sm font-medium text-accent-soft">{project.tagline}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-secondary">
                    {project.description}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <li key={tech}>
                        <Badge label={tech} />
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-5">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary px-4 py-2 text-sm"
                      >
                        {projectsSection.demoLabel}
                        <ExternalLink size={15} aria-hidden="true" />
                      </a>
                    )}
                    {project.privateSource && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-secondary">
                        <Lock size={13} aria-hidden="true" />
                        {projectsSection.privateNote}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
