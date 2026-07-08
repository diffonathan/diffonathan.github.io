import { identity, socials, footer } from '../data/portfolio'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6">
        <div>
          <p className="text-base font-semibold">{identity.name}</p>
          <p className="mt-1 text-sm text-secondary">{identity.baseline}</p>
        </div>

        <ul className="flex items-center gap-3">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.url}
                target={social.url.startsWith('http') ? '_blank' : undefined}
                rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={social.label}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card text-secondary transition-colors duration-200 hover:border-accent/40 hover:text-accent"
              >
                <social.icon size={18} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>

        <p className="text-xs text-secondary">
          © <span className="tabular-nums">{year}</span> {identity.name} — {footer.note}
        </p>
      </div>
    </footer>
  )
}
