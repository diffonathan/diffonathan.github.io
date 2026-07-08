import Reveal from './Reveal'

interface SectionHeadingProps {
  title: string
  subtitle?: string
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <Reveal className="mb-12 text-center">
      <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">{title}</h2>
      <div
        className="mx-auto mt-3 h-1 w-16 rounded-full"
        style={{ background: 'var(--grad-accent)' }}
        aria-hidden="true"
      />
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-secondary">
          {subtitle}
        </p>
      )}
    </Reveal>
  )
}
